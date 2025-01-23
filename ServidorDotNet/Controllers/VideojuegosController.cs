using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using ServidorDotNet.Model;
using ServidorDotNet.Repositorios;
using MySql.Data.MySqlClient;
using Dapper;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace ServidorDotNet.Controllers
{
    [ApiController]
    [Route("rest")]
    public class VideojuegosController : ControllerBase
    {

        [HttpPost("rest/carrito/agregar")]
        public string agregarProductoAlCarrito()
        {
            //Prueba temporal
            HttpContext.Session.SetString("prueba", "sesion funciona");
            return "ok";
        }

        [HttpGet("obtener_prueba_sesion")]
        public string obtenerPruebaSesion()
        {
            return JsonSerializer.Serialize(HttpContext.Session.GetString("prueba"));
        }


        [HttpGet("obtener_videojuego_por_id")]
        public Videojuego obtenerVideojuegoPorId([FromQuery] int id)
        {
            int idInt = -1;
            try
            {
                idInt = Convert.ToInt32(id);
            }
            catch (Exception e)
            {
                return null;
            }
            RepositorioTienda repositorio = new RepositorioTienda();
            Videojuego videojuego = repositorio.obtenerVideojuegoPorId(idInt);
            return videojuego;
        }

        [HttpDelete("borrar_videojuego")]
        public IActionResult BorrarVideojuego([FromQuery] int id)
        {
            try
            {
                RepositorioTienda repositorio = new RepositorioTienda();
                repositorio.eliminarVideojuego(id);
                
                // Intentar eliminar la imagen asociada si existe
                var rutaImagenes = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "imagenes");
                var rutaImagen = Path.Combine(rutaImagenes, $"{id}.jpg");
                if (System.IO.File.Exists(rutaImagen))
                {
                    System.IO.File.Delete(rutaImagen);
                }
                
                return Ok(new { mensaje = "Videojuego eliminado correctamente" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = $"Error al eliminar el videojuego: {ex.Message}" });
            }
        }

        [Consumes("multipart/form-data")]
        [HttpPost("registrar_videojuego")]
        public string registrarVideojuego([FromForm] Videojuego videojuego)
        {
            try
            {
                // Obtener el precio como string del FormData
                var precioStr = Request.Form["precio"].ToString();
                Console.WriteLine($"Precio recibido como string: {precioStr}");

                // Convertir el string a decimal usando InvariantCulture
                if (decimal.TryParse(precioStr, System.Globalization.NumberStyles.Any, 
                    System.Globalization.CultureInfo.InvariantCulture, out decimal precioDecimal))
                {
                    videojuego.Precio = precioDecimal;
                    Console.WriteLine($"Precio convertido a decimal: {videojuego.Precio}");
                }
                else
                {
                    throw new ArgumentException($"El precio '{precioStr}' no es válido");
                }

                // Validar que el año de lanzamiento sea válido
                if (videojuego.AnioLanzamiento <= 0)
                {
                    throw new ArgumentException("El año de lanzamiento no es válido");
                }

                // Validar y procesar el precio
                if (videojuego.Precio <= 0)
                {
                    throw new ArgumentException("El precio debe ser mayor que 0");
                }

                // Redondear el precio a 2 decimales
                videojuego.Precio = Math.Round(videojuego.Precio, 2, MidpointRounding.AwayFromZero);
                Console.WriteLine($"Precio después de redondear: {videojuego.Precio}");

                RepositorioTienda repositorio = new RepositorioTienda();
                long idGenerado = repositorio.RegistrarVideojuego(videojuego);
                
                if (videojuego.archivo != null)
                {
                    var rutaImagenes = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "imagenes");
                    var rutaDestinoArchivo = Path.Combine(rutaImagenes, idGenerado.ToString() + ".jpg");

                    using (var stream = new FileStream(rutaDestinoArchivo, FileMode.Create))
                    {
                        videojuego.archivo.CopyTo(stream);
                    }
                }

                return JsonSerializer.Serialize("ok");
            }
            catch (Exception ex)
            {
                return JsonSerializer.Serialize($"Error: {ex.Message}");
            }
        }

        [Consumes("multipart/form-data")]
        [HttpPut("actualizar_videojuego")]
        public IActionResult ActualizarVideojuego([FromForm] IFormCollection form)
        {
            try
            {
                // Log de los datos recibidos
                Console.WriteLine("Datos del formulario recibidos:");
                foreach (var key in form.Keys)
                {
                    Console.WriteLine($"{key}: {form[key]}");
                }

                // Validar que todos los campos requeridos estén presentes
                var camposRequeridos = new[] { "id", "titulo", "precio", "estado", "compania", "anio_lanzamiento", "categoria" };
                foreach (var campo in camposRequeridos)
                {
                    if (!form.ContainsKey(campo))
                    {
                        return BadRequest(new { error = $"Campo requerido no encontrado: {campo}" });
                    }
                }

                // Procesar el precio
                var precioStr = form["precio"].ToString();
                Console.WriteLine($"Precio recibido como string: {precioStr}");
                decimal precio;
                if (!decimal.TryParse(precioStr, System.Globalization.NumberStyles.Any,
                    System.Globalization.CultureInfo.InvariantCulture, out precio))
                {
                    return BadRequest(new { error = $"El precio '{precioStr}' no es válido" });
                }
                Console.WriteLine($"Precio convertido a decimal: {precio}");

                var videojuego = new Videojuego
                {
                    Id = int.Parse(form["id"]),
                    Titulo = form["titulo"],
                    Precio = precio,
                    Estado = form["estado"],
                    Compania = form["compania"],
                    AnioLanzamiento = int.Parse(form["anio_lanzamiento"]),
                    Categoria = form["categoria"]
                };

                if (form.Files.Count > 0)
                {
                    videojuego.archivo = form.Files[0];
                }

                Console.WriteLine($"Objeto Videojuego creado:");
                Console.WriteLine($"ID: {videojuego.Id}");
                Console.WriteLine($"Título: {videojuego.Titulo}");
                Console.WriteLine($"Precio: {videojuego.Precio}");
                Console.WriteLine($"Estado: {videojuego.Estado}");
                Console.WriteLine($"Compañía: {videojuego.Compania}");
                Console.WriteLine($"Año: {videojuego.AnioLanzamiento}");
                Console.WriteLine($"Categoría: {videojuego.Categoria}");

                // Validaciones
                if (videojuego.AnioLanzamiento <= 0)
                {
                    return BadRequest(new { error = "El año de lanzamiento no es válido" });
                }

                if (videojuego.Precio <= 0)
                {
                    return BadRequest(new { error = "El precio debe ser mayor que 0" });
                }

                // Redondear el precio a 2 decimales
                videojuego.Precio = Math.Round(videojuego.Precio, 2, MidpointRounding.AwayFromZero);
                Console.WriteLine($"Precio después de redondear: {videojuego.Precio}");

                RepositorioTienda repositorio = new RepositorioTienda();
                repositorio.ActualizarVideojuego(videojuego);
                
                if (videojuego.archivo != null)
                {
                    var rutaImagenes = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "imagenes");
                    var rutaDestinoArchivo = Path.Combine(rutaImagenes, videojuego.Id.ToString() + ".jpg");

                    using (var stream = new FileStream(rutaDestinoArchivo, FileMode.Create))
                    {
                        videojuego.archivo.CopyTo(stream);
                    }
                }

                return Ok(new { mensaje = "Videojuego actualizado correctamente" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = $"Error al actualizar el videojuego: {ex.Message}" });
            }
        }

        [HttpGet("obtener_videojuegos")]
        public List<Videojuego> obtenerVideojuegos()
        {
            return new RepositorioTienda().obtenerVideojuegos();
        }

        private readonly string _connectionString;

        public VideojuegosController(string connectionString = "Server=localhost;Database=tienda_angular_dotnet_lunargames;User=root;Password=")
        {
            _connectionString = connectionString;
        }

        [HttpGet("obtener_videojuegos_nuevos")]
        public async Task<IActionResult> ObtenerVideojuegosNuevos()
        {
            using var connection = new MySqlConnection(_connectionString);
            var videojuegos = await connection.QueryAsync(@"
                SELECT * FROM videojuegos_retro 
                WHERE estado = 'Nuevo Lanzamiento'
                ORDER BY anio_lanzamiento DESC");
            return Ok(videojuegos);
        }

        [HttpGet("obtener_videojuego/{id}")]
        public async Task<IActionResult> ObtenerVideojuego(int id)
        {
            using var connection = new MySqlConnection(_connectionString);
            var videojuego = await connection.QueryFirstOrDefaultAsync(
                "SELECT * FROM videojuegos_retro WHERE id = @Id",
                new { Id = id });

            if (videojuego == null)
                return NotFound();

            return Ok(videojuego);
        }
    }
}
