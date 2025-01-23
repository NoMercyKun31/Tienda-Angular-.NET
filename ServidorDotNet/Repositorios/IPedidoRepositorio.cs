using ServidorDotNet.Model;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ServidorDotNet.Repositorios
{
    public interface IPedidoRepositorio
    {
        Task<PedidoResponse> CrearPedido(int idUsuario, PedidoRequest pedido, string ipAddress, string userAgent);
        Task<List<PedidoResponse>> ObtenerPedidosUsuario(int idUsuario);
        Task<PedidoResponse> ObtenerPedido(int idPedido, int idUsuario);
        Task<List<PedidoResponse>> ObtenerTodosPedidos();
        Task<bool> EliminarPedido(int idPedido);
        Task<bool> ActualizarEstadoPedido(int idPedido, string nuevoEstado);
    }
}
