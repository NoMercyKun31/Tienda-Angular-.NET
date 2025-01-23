namespace ServidorDotNet.Constantes
{
    public class ConstantesSQL
    {
        public const string SQL_OBTENER_VIDEOJUEGOS =
            "SELECT * FROM videojuegos_retro";

        public const string SQL_INSERTAR_VIDEOJUEGO =
            "INSERT INTO videojuegos_retro (titulo, precio, estado, compania, anio_lanzamiento, categoria) " +
            "VALUES (@titulo, @precio, @estado, @compania, @anio_lanzamiento, @categoria)";

        public const string SQL_OBTENER_VIDEOJUEGO_POR_ID =
            "SELECT * FROM videojuegos_retro WHERE id = @id";

        public const string SQL_ELIMINAR_VIDEOJUEGO =
            "DELETE FROM videojuegos_retro WHERE id = @id";

        public const string SQL_ACTUALIZAR_VIDEOJUEGO =
            "UPDATE videojuegos_retro " +
            "SET titulo = @titulo, " +
            "precio = @precio, " +
            "estado = @estado, " +
            "compania = @compania, " +
            "anio_lanzamiento = @anio_lanzamiento, " +
            "categoria = @categoria " +
            "WHERE id = @id";
    }
}
