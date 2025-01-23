using System;

namespace ServidorDotNet.Model
{
    public class Carrito
    {
        public int Id { get; set; }
        public int IdUsuario { get; set; }
        public int IdVideojuego { get; set; }
        public int Cantidad { get; set; }
        public DateTime FechaAgregado { get; set; }
    }

    public class ItemCarrito
    {
        public int id_videojuego { get; set; }
        public string titulo { get; set; }
        public decimal precio { get; set; }
        public int cantidad { get; set; }
    }
}
