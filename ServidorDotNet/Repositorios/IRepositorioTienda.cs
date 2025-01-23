using ServidorDotNet.Model;

namespace ServidorDotNet.Repositorios
{
    public interface IRepositorioTienda
    {
        List<Videojuego> obtenerVideojuegos();
        long RegistrarVideojuego(Videojuego videojuego);
        Videojuego obtenerVideojuegoPorId(long id);
        void eliminarVideojuego(long id);
        void ActualizarVideojuego(Videojuego videojuego);
    }
}
