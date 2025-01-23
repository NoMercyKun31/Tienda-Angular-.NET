using Microsoft.AspNetCore.Mvc;
using ServidorDotNet.Model;
using ServidorDotNet.Repositorios;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ServidorDotNet.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminPedidosController : ControllerBase
    {
        private readonly IPedidoRepositorio _pedidoRepositorio;

        public AdminPedidosController(IPedidoRepositorio pedidoRepositorio)
        {
            _pedidoRepositorio = pedidoRepositorio;
        }

        // GET: api/AdminPedidos
        [HttpGet]
        public async Task<ActionResult<List<PedidoResponse>>> GetPedidos()
        {
            var pedidos = await _pedidoRepositorio.ObtenerTodosPedidos();
            return Ok(pedidos);
        }

        // DELETE: api/AdminPedidos/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePedido(int id)
        {
            var result = await _pedidoRepositorio.EliminarPedido(id);
            if (!result)
            {
                return NotFound();
            }
            return NoContent();
        }

        // PUT: api/AdminPedidos/5/estado
        [HttpPut("{id}/estado")]
        public async Task<IActionResult> UpdateEstadoPedido(int id, [FromBody] string nuevoEstado)
        {
            var result = await _pedidoRepositorio.ActualizarEstadoPedido(id, nuevoEstado);
            if (!result)
            {
                return NotFound();
            }
            return NoContent();
        }
    }
}
