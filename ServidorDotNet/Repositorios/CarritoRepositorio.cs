using MySql.Data.MySqlClient;
using ServidorDotNet.Model;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Dapper;

namespace ServidorDotNet.Repositorios
{
    public class CarritoRepositorio : ICarritoRepositorio
    {
        private readonly string _connectionString;

        public CarritoRepositorio(string connectionString)
        {
            _connectionString = connectionString;
        }

        public async Task<IEnumerable<ItemCarrito>> ObtenerCarritoPorUsuario(int idUsuario)
        {
            using var connection = new MySqlConnection(_connectionString);
            var query = @"
                SELECT 
                    v.id as id_videojuego,
                    v.titulo,
                    v.precio,
                    c.cantidad
                FROM carrito c
                JOIN videojuegos_retro v ON c.id_videojuego = v.id
                WHERE c.id_usuario = @IdUsuario";
            
            return await connection.QueryAsync<ItemCarrito>(query, new { IdUsuario = idUsuario });
        }

        public async Task<Carrito> AgregarAlCarrito(Carrito item)
        {
            using var connection = new MySqlConnection(_connectionString);
            // Primero verificamos si el item ya existe en el carrito
            var existingItem = await connection.QueryFirstOrDefaultAsync<Carrito>(
                "SELECT * FROM carrito WHERE id_usuario = @IdUsuario AND id_videojuego = @IdVideojuego",
                new { item.IdUsuario, item.IdVideojuego });

            if (existingItem != null)
            {
                // Si existe, actualizamos la cantidad
                await connection.ExecuteAsync(
                    "UPDATE carrito SET cantidad = cantidad + @Cantidad WHERE id_usuario = @IdUsuario AND id_videojuego = @IdVideojuego",
                    new { item.Cantidad, item.IdUsuario, item.IdVideojuego });
                return existingItem;
            }
            else
            {
                // Si no existe, lo insertamos
                var sql = @"
                    INSERT INTO carrito (id_usuario, id_videojuego, cantidad, fecha_agregado) 
                    VALUES (@IdUsuario, @IdVideojuego, @Cantidad, @FechaAgregado);
                    SELECT LAST_INSERT_ID();";
                
                item.Id = await connection.ExecuteScalarAsync<int>(sql, new {
                    item.IdUsuario,
                    item.IdVideojuego,
                    item.Cantidad,
                    FechaAgregado = DateTime.Now
                });
                
                return item;
            }
        }

        public async Task<bool> ActualizarCantidad(int idUsuario, int idVideojuego, int cantidad)
        {
            using var connection = new MySqlConnection(_connectionString);
            var rowsAffected = await connection.ExecuteAsync(
                "UPDATE carrito SET cantidad = @Cantidad WHERE id_usuario = @IdUsuario AND id_videojuego = @IdVideojuego",
                new { Cantidad = cantidad, IdUsuario = idUsuario, IdVideojuego = idVideojuego });
            
            return rowsAffected > 0;
        }

        public async Task<bool> EliminarDelCarrito(int idUsuario, int idVideojuego)
        {
            using var connection = new MySqlConnection(_connectionString);
            var rowsAffected = await connection.ExecuteAsync(
                "DELETE FROM carrito WHERE id_usuario = @IdUsuario AND id_videojuego = @IdVideojuego",
                new { IdUsuario = idUsuario, IdVideojuego = idVideojuego });
            
            return rowsAffected > 0;
        }

        public async Task<bool> LimpiarCarrito(int idUsuario)
        {
            using var connection = new MySqlConnection(_connectionString);
            var rowsAffected = await connection.ExecuteAsync(
                "DELETE FROM carrito WHERE id_usuario = @IdUsuario",
                new { IdUsuario = idUsuario });
            
            return rowsAffected > 0;
        }
    }
}
