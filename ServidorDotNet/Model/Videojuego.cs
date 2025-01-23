using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Http;

public class Videojuego
{
    [JsonPropertyName("id")]
    public int Id { get; set; }
    [JsonPropertyName("titulo")]
    public string Titulo { get; set; }
    [JsonPropertyName("precio")]
    public decimal Precio { get; set; }
    [JsonPropertyName("estado")]
    public string Estado { get; set; }
    [JsonPropertyName("compania")]
    public string Compania { get; set; }
    [JsonPropertyName("anio_lanzamiento")]
    public int AnioLanzamiento { get; set; }
    [JsonPropertyName("categoria")]
    public string Categoria { get; set; }
    [JsonPropertyName("archivo")]
    public IFormFile archivo { get; set; }
}
