export interface Videojuego {
    id: number; // Identificador único
    titulo: string; // Nombre del videojuego
    precio: number; // Precio del videojuego
    estado: 'En Oferta' | 'Destacado' | 'Nuevo Lanzamiento'; // Estado del videojuego
    compania: string; // Compañía desarrolladora
    anio_lanzamiento: number; // Año de lanzamiento
    categoria: string; // Categoría del videojuego
  }
  