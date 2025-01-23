using Microsoft.AspNetCore.Mvc;
using ServidorDotNet.Model;
using ServidorDotNet.Repositorios;
using System.Threading.Tasks;

namespace ServidorDotNet.Controllers
{
    [ApiController]
    [Route("rest/carrito")]
    public class CarritoController : ControllerBase
    {
        private readonly ICarritoRepositorio _carritoRepositorio;

        public CarritoController(ICarritoRepositorio carritoRepositorio)
        {
            _carritoRepositorio = carritoRepositorio;
        }

        [HttpGet("obtener")]
        public async Task<IActionResult> ObtenerCarrito()
        {
            // Obtenemos el id del usuario de la sesión (por ahora hardcodeado a 1)
            int idUsuario = 1;
            var items = await _carritoRepositorio.ObtenerCarritoPorUsuario(idUsuario);
            return Ok(items);
        }

        [HttpPost("agregar")]
        public async Task<IActionResult> AgregarAlCarrito([FromBody] ItemCarritoRequest request)
        {
            // Obtenemos el id del usuario de la sesión (por ahora hardcodeado a 1)
            int idUsuario = 1;
            var item = new Carrito
            {
                IdUsuario = idUsuario,
                IdVideojuego = request.id_videojuego,
                Cantidad = request.cantidad
            };
            var resultado = await _carritoRepositorio.AgregarAlCarrito(item);
            return Ok(resultado);
        }

        [HttpPut("actualizar")]
        public async Task<IActionResult> ActualizarCantidad([FromBody] ItemCarritoRequest request)
        {
            // Obtenemos el id del usuario de la sesión (por ahora hardcodeado a 1)
            int idUsuario = 1;
            var resultado = await _carritoRepositorio.ActualizarCantidad(idUsuario, request.id_videojuego, request.cantidad);
            if (!resultado)
                return NotFound();
            return Ok();
        }

        [HttpDelete("eliminar/{idVideojuego}")]
        public async Task<IActionResult> EliminarDelCarrito(int idVideojuego)
        {
            // Obtenemos el id del usuario de la sesión (por ahora hardcodeado a 1)
            int idUsuario = 1;
            var resultado = await _carritoRepositorio.EliminarDelCarrito(idUsuario, idVideojuego);
            if (!resultado)
                return NotFound();
            return Ok();
        }

        [HttpDelete("vaciar")]
        public async Task<IActionResult> VaciarCarrito()
        {
            // Obtenemos el id del usuario de la sesión (por ahora hardcodeado a 1)
            int idUsuario = 1;
            var resultado = await _carritoRepositorio.LimpiarCarrito(idUsuario);
            return Ok(new { success = resultado });
        }
    }

    public class ItemCarritoRequest
    {
        public int id_videojuego { get; set; }
        public int cantidad { get; set; }
    }
}
