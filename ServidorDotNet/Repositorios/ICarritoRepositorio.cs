using ServidorDotNet.Model;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ServidorDotNet.Repositorios
{
    public interface ICarritoRepositorio
    {
        Task<IEnumerable<ItemCarrito>> ObtenerCarritoPorUsuario(int idUsuario);
        Task<Carrito> AgregarAlCarrito(Carrito item);
        Task<bool> ActualizarCantidad(int idUsuario, int idVideojuego, int cantidad);
        Task<bool> EliminarDelCarrito(int idUsuario, int idVideojuego);
        Task<bool> LimpiarCarrito(int idUsuario);
    }
}
