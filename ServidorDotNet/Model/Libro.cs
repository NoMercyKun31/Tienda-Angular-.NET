using System.Text.Json.Serialization;

namespace ServidorDotNet.Model
{
    public class Libro
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }
        [JsonPropertyName("titulo")]
        public string Titulo { get; set; }
        [JsonPropertyName("precio")]
        public double Precio { get; set; }
        [JsonPropertyName("descripcion")]
        public string Descripcion { get; set; }

        [JsonPropertyName("archivo")]
        public FormFile archivo { get; set; }

        

    }
}
