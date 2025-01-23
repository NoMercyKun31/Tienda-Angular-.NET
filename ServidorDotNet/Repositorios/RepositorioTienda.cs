using System;
using MySql.Data.MySqlClient;
using ServidorDotNet.Constantes;
using ServidorDotNet.Model;
using System.Collections.Generic;

namespace ServidorDotNet.Repositorios
{
    public class RepositorioTienda : IRepositorioTienda
    {
        private string connectionString =
            "Server=localhost;" +
            "Database=tienda_angular_dotnet_lunargames;" +
            "User=root;" +
            "Password=";

        private MySqlConnection obtenerConexion()
        {
            return new MySqlConnection(this.connectionString);
        }

        public List<Videojuego> obtenerVideojuegos()
        {
            List<Videojuego> videojuegos = new List<Videojuego>();
            MySqlConnection conn = obtenerConexion();
            conn.Open();

            MySqlCommand cmd = new MySqlCommand(ConstantesSQL.SQL_OBTENER_VIDEOJUEGOS, conn);
            MySqlDataReader reader = cmd.ExecuteReader();

            while (reader.Read())
            {
                Videojuego videojuego = new Videojuego
                {
                    Id = reader.GetInt32(0),
                    Titulo = reader.GetString(1),
                    Precio = reader.GetDecimal(2),
                    Estado = reader.GetString(3),
                    Compania = reader.GetString(4),
                    AnioLanzamiento = reader.GetInt32(5),
                    Categoria = reader.GetString(6)
                };
                videojuegos.Add(videojuego);
            }

            reader.Close();
            conn.Close();
            return videojuegos;
        }

        public Videojuego obtenerVideojuegoPorId(long id)
        {
            MySqlConnection conn = obtenerConexion();
            conn.Open();

            MySqlCommand cmd = new MySqlCommand(ConstantesSQL.SQL_OBTENER_VIDEOJUEGO_POR_ID, conn);
            cmd.Parameters.AddWithValue("@id", id);
            MySqlDataReader reader = cmd.ExecuteReader();

            Videojuego videojuego = null;
            if (reader.Read())
            {
                videojuego = new Videojuego
                {
                    Id = reader.GetInt32(0),
                    Titulo = reader.GetString(1),
                    Precio = reader.GetDecimal(2),
                    Estado = reader.GetString(3),
                    Compania = reader.GetString(4),
                    AnioLanzamiento = reader.GetInt32(5),
                    Categoria = reader.GetString(6)
                };
            }

            reader.Close();
            conn.Close();
            return videojuego;
        }

        public long RegistrarVideojuego(Videojuego videojuego)
        {
            MySqlConnection conn = obtenerConexion();
            conn.Open();

            try
            {
                Console.WriteLine($"[Repositorio] Precio antes de insertar: {videojuego.Precio}");

                MySqlCommand cmd = new MySqlCommand(ConstantesSQL.SQL_INSERTAR_VIDEOJUEGO, conn);
                cmd.Parameters.Add("@titulo", MySqlDbType.VarChar).Value = videojuego.Titulo;
                cmd.Parameters.Add("@precio", MySqlDbType.Decimal).Value = videojuego.Precio;
                cmd.Parameters.Add("@estado", MySqlDbType.VarChar).Value = videojuego.Estado;
                cmd.Parameters.Add("@compania", MySqlDbType.VarChar).Value = videojuego.Compania;
                cmd.Parameters.Add("@anio_lanzamiento", MySqlDbType.Int32).Value = videojuego.AnioLanzamiento;
                cmd.Parameters.Add("@categoria", MySqlDbType.VarChar).Value = videojuego.Categoria;

                cmd.ExecuteNonQuery();
                long id = cmd.LastInsertedId;

                // Verificar el precio guardado
                MySqlCommand verificarCmd = new MySqlCommand("SELECT precio FROM videojuegos_retro WHERE id = @id", conn);
                verificarCmd.Parameters.AddWithValue("@id", id);
                var precioGuardado = (decimal)verificarCmd.ExecuteScalar();
                Console.WriteLine($"[Repositorio] Precio después de insertar: {precioGuardado}");

                return id;
            }
            finally
            {
                conn.Close();
            }
        }

        public void eliminarVideojuego(long id)
        {
            MySqlConnection conn = obtenerConexion();
            conn.Open();

            MySqlCommand cmd = new MySqlCommand(ConstantesSQL.SQL_ELIMINAR_VIDEOJUEGO, conn);
            cmd.Parameters.AddWithValue("@id", id);
            cmd.ExecuteNonQuery();

            conn.Close();
        }

        public void ActualizarVideojuego(Videojuego videojuego)
        {
            MySqlConnection conn = obtenerConexion();
            conn.Open();

            MySqlCommand cmd = new MySqlCommand(ConstantesSQL.SQL_ACTUALIZAR_VIDEOJUEGO, conn);
            cmd.Parameters.AddWithValue("@id", videojuego.Id);
            cmd.Parameters.AddWithValue("@titulo", videojuego.Titulo);
            cmd.Parameters.AddWithValue("@precio", videojuego.Precio);
            cmd.Parameters.AddWithValue("@estado", videojuego.Estado);
            cmd.Parameters.AddWithValue("@compania", videojuego.Compania);
            cmd.Parameters.AddWithValue("@anio_lanzamiento", videojuego.AnioLanzamiento);
            cmd.Parameters.AddWithValue("@categoria", videojuego.Categoria);

            cmd.ExecuteNonQuery();
            conn.Close();
        }
    }
}
