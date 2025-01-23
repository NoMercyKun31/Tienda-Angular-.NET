using Microsoft.AspNetCore.Mvc;
using ServidorDotNet.Model;
using ServidorDotNet.Repositorios;
using System.Threading.Tasks;

namespace ServidorDotNet.Controllers
{
    [ApiController]
    [Route("rest/[controller]")]
    public class PedidosController : ControllerBase
    {
        private readonly IPedidoRepositorio _pedidoRepositorio;

        public PedidosController(IPedidoRepositorio pedidoRepositorio)
        {
            _pedidoRepositorio = pedidoRepositorio;
        }

        [HttpPost("crear")]
        public async Task<IActionResult> CrearPedido([FromBody] PedidoRequest pedido)
        {
            // Por ahora, hardcodeamos el id de usuario a 1
            int idUsuario = 1;
            
            try
            {
                var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";
                var userAgent = HttpContext.Request.Headers["User-Agent"].ToString();
                
                var resultado = await _pedidoRepositorio.CrearPedido(idUsuario, pedido, ipAddress, userAgent);
                return Ok(resultado);
            }
            catch (System.Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("usuario")]
        public async Task<IActionResult> ObtenerPedidosUsuario()
        {
            // Por ahora, hardcodeamos el id de usuario a 1
            int idUsuario = 1;
            
            var pedidos = await _pedidoRepositorio.ObtenerPedidosUsuario(idUsuario);
            return Ok(pedidos);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> ObtenerPedido(int id)
        {
            // Por ahora, hardcodeamos el id de usuario a 1
            int idUsuario = 1;
            
            var pedido = await _pedidoRepositorio.ObtenerPedido(id, idUsuario);
            if (pedido == null)
                return NotFound();
            return Ok(pedido);
        }
    }
}
