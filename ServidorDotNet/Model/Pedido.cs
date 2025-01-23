using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace ServidorDotNet.Model
{
    public class Pedido
    {
        public int Id { get; set; }
        public int IdUsuario { get; set; }
        public string Nombre { get; set; }
        public string Email { get; set; }
        public string Direccion { get; set; }
        public string Telefono { get; set; }
        public string NumeroTarjeta { get; set; }
        public decimal Total { get; set; }
        public string Estado { get; set; }
        public DateTime FechaCreacion { get; set; }
        public string IpAddress { get; set; }
        public string UserAgent { get; set; }
    }

    public class DetallePedido
    {
        public int Id { get; set; }
        public int IdPedido { get; set; }
        public int IdVideojuego { get; set; }
        public int Cantidad { get; set; }
        public decimal PrecioUnitario { get; set; }
        public string Titulo { get; set; }
    }

    public class ItemCarritoPedido
    {
        public int id_videojuego { get; set; }
        public string titulo { get; set; }
        public decimal precio { get; set; }
        public int cantidad { get; set; }
    }

    public class PedidoRequest
    {
        public string nombre { get; set; }
        public string email { get; set; }
        public string direccion { get; set; }
        public string telefono { get; set; }
        public string numero_tarjeta { get; set; }
        public List<ItemCarritoPedido> items { get; set; }
        public decimal total { get; set; }
    }

    public class PedidoResponse
    {
        public int Id { get; set; }
        public string Nombre { get; set; }
        public string Email { get; set; }
        public string Direccion { get; set; }
        public string Telefono { get; set; }
        public decimal Total { get; set; }
        public string Estado { get; set; }
        
        [JsonPropertyName("fechaCreacion")]
        public DateTime FechaCreacion { get; set; }
        
        public List<DetallePedido> Detalles { get; set; }
    }
}
