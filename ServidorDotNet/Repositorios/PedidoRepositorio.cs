using MySql.Data.MySqlClient;
using ServidorDotNet.Model;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Dapper;
using System.Linq;

namespace ServidorDotNet.Repositorios
{
    public class PedidoRepositorio : IPedidoRepositorio
    {
        private readonly string _connectionString;
        private readonly ICarritoRepositorio _carritoRepositorio;

        public PedidoRepositorio(string connectionString, ICarritoRepositorio carritoRepositorio)
        {
            _connectionString = connectionString;
            _carritoRepositorio = carritoRepositorio;
        }

        public async Task<PedidoResponse> CrearPedido(int idUsuario, PedidoRequest pedido, string ipAddress, string userAgent)
        {
            using var connection = new MySqlConnection(_connectionString);
            await connection.OpenAsync();
            using var transaction = await connection.BeginTransactionAsync();

            try
            {
                // 1. Verificar que hay items
                if (pedido.items == null || !pedido.items.Any())
                {
                    throw new Exception("El pedido no contiene items");
                }

                // 2. Crear pedido
                var nuevoPedido = new Pedido
                {
                    IdUsuario = idUsuario,
                    Nombre = pedido.nombre,
                    Email = pedido.email,
                    Direccion = pedido.direccion,
                    Telefono = pedido.telefono,
                    NumeroTarjeta = pedido.numero_tarjeta,
                    Total = pedido.total,
                    Estado = "pendiente",
                    FechaCreacion = DateTime.Now,
                    IpAddress = ipAddress,
                    UserAgent = userAgent
                };

                var sql = @"
                    INSERT INTO pedidos (id_usuario, nombre, email, direccion, telefono, 
                        numero_tarjeta, total, estado, fecha_creacion, ip_address, user_agent)
                    VALUES (@IdUsuario, @Nombre, @Email, @Direccion, @Telefono,
                        @NumeroTarjeta, @Total, @Estado, @FechaCreacion, @IpAddress, @UserAgent);
                    SELECT LAST_INSERT_ID();";

                int idPedido = await connection.ExecuteScalarAsync<int>(sql, nuevoPedido, transaction);

                // 3. Crear detalles del pedido
                foreach (var item in pedido.items)
                {
                    var detalle = new DetallePedido
                    {
                        IdPedido = idPedido,
                        IdVideojuego = item.id_videojuego,
                        Cantidad = item.cantidad,
                        PrecioUnitario = item.precio,
                        Titulo = item.titulo
                    };

                    await connection.ExecuteAsync(@"
                        INSERT INTO detalles_pedido (id_pedido, id_videojuego, cantidad, precio_unitario)
                        VALUES (@IdPedido, @IdVideojuego, @Cantidad, @PrecioUnitario)",
                        detalle, transaction);
                }

                // 4. Limpiar carrito
                await _carritoRepositorio.LimpiarCarrito(idUsuario);

                await transaction.CommitAsync();

                // 5. Retornar pedido creado
                return await ObtenerPedido(idPedido, idUsuario);
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        public async Task<List<PedidoResponse>> ObtenerPedidosUsuario(int idUsuario)
        {
            using var connection = new MySqlConnection(_connectionString);
            var pedidos = await connection.QueryAsync<PedidoResponse>(@"
                SELECT id, nombre, email, direccion, telefono, total, estado, fecha_creacion
                FROM pedidos
                WHERE id_usuario = @IdUsuario
                ORDER BY fecha_creacion DESC",
                new { IdUsuario = idUsuario });

            var listaPedidos = pedidos.ToList();

            foreach (var pedido in listaPedidos)
            {
                pedido.Detalles = (await connection.QueryAsync<DetallePedido>(@"
                    SELECT dp.*, v.titulo
                    FROM detalles_pedido dp
                    JOIN videojuegos_retro v ON dp.id_videojuego = v.id
                    WHERE dp.id_pedido = @IdPedido",
                    new { IdPedido = pedido.Id })).ToList();
            }

            return listaPedidos;
        }

        public async Task<PedidoResponse> ObtenerPedido(int idPedido, int idUsuario)
        {
            using var connection = new MySqlConnection(_connectionString);
            var pedido = await connection.QueryFirstOrDefaultAsync<PedidoResponse>(@"
                SELECT id, nombre, email, direccion, telefono, total, estado, fecha_creacion
                FROM pedidos
                WHERE id = @IdPedido AND id_usuario = @IdUsuario",
                new { IdPedido = idPedido, IdUsuario = idUsuario });

            if (pedido != null)
            {
                pedido.Detalles = (await connection.QueryAsync<DetallePedido>(@"
                    SELECT dp.*, v.titulo
                    FROM detalles_pedido dp
                    JOIN videojuegos_retro v ON dp.id_videojuego = v.id
                    WHERE dp.id_pedido = @IdPedido",
                    new { IdPedido = idPedido })).ToList();
            }

            return pedido;
        }

        public async Task<List<PedidoResponse>> ObtenerTodosPedidos()
        {
            using var connection = new MySqlConnection(_connectionString);
            await connection.OpenAsync();

            var sql = @"
                SELECT 
                    p.id,
                    p.id_usuario,
                    p.nombre,
                    p.email,
                    p.direccion,
                    p.telefono,
                    p.total,
                    p.estado,
                    p.fecha_creacion as FechaCreacion,
                    dp.id as DetalleId,
                    dp.id_videojuego as IdVideojuego,
                    dp.cantidad as Cantidad,
                    dp.precio_unitario as PrecioUnitario,
                    v.titulo as Titulo
                FROM pedidos p
                LEFT JOIN detalles_pedido dp ON p.id = dp.id_pedido
                LEFT JOIN videojuegos_retro v ON dp.id_videojuego = v.id
                ORDER BY p.fecha_creacion DESC";

            var pedidoDict = new Dictionary<int, PedidoResponse>();

            await connection.QueryAsync<Pedido, DetallePedido, PedidoResponse>(
                sql,
                (pedido, detalle) =>
                {
                    if (!pedidoDict.TryGetValue(pedido.Id, out var pedidoResponse))
                    {
                        pedidoResponse = new PedidoResponse
                        {
                            Id = pedido.Id,
                            Nombre = pedido.Nombre,
                            Email = pedido.Email,
                            Direccion = pedido.Direccion,
                            Telefono = pedido.Telefono,
                            Total = pedido.Total,
                            Estado = pedido.Estado,
                            FechaCreacion = pedido.FechaCreacion,
                            Detalles = new List<DetallePedido>()
                        };
                        pedidoDict[pedido.Id] = pedidoResponse;
                    }

                    if (detalle != null)
                    {
                        pedidoResponse.Detalles.Add(detalle);
                    }

                    return pedidoResponse;
                },
                splitOn: "DetalleId"
            );

            return pedidoDict.Values.ToList();
        }

        public async Task<bool> EliminarPedido(int idPedido)
        {
            using var connection = new MySqlConnection(_connectionString);
            await connection.OpenAsync();
            using var transaction = await connection.BeginTransactionAsync();

            try
            {
                // Primero eliminamos los detalles del pedido
                var deleteDetallesQuery = "DELETE FROM detalles_pedido WHERE id_pedido = @IdPedido";
                await connection.ExecuteAsync(deleteDetallesQuery, new { IdPedido = idPedido }, transaction);

                // Luego eliminamos el pedido
                var deletePedidoQuery = "DELETE FROM pedidos WHERE id = @IdPedido";
                var result = await connection.ExecuteAsync(deletePedidoQuery, new { IdPedido = idPedido }, transaction);

                await transaction.CommitAsync();
                return result > 0;
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        public async Task<bool> ActualizarEstadoPedido(int idPedido, string nuevoEstado)
        {
            using var connection = new MySqlConnection(_connectionString);
            var query = "UPDATE pedidos SET estado = @Estado WHERE id = @IdPedido";
            var result = await connection.ExecuteAsync(query, new { Estado = nuevoEstado, IdPedido = idPedido });
            return result > 0;
        }
    }
}
