# LunarGames - Tienda de Videojuegos

Aplicación web fullstack para una tienda de videojuegos desarrollada con Angular y .NET. El sistema permite gestionar un catálogo de videojuegos, carrito de compras y realizar pedidos.

## Tecnologías Utilizadas

### Backend
- .NET Core (API REST)
- MySQL como base de datos
- Entity Framework Core para el acceso a datos

### Frontend
- Angular
- TypeScript
- Bootstrap para estilos

## Requisitos Previos

- Node.js y npm (última versión estable)
- .NET SDK 7.0 o superior
- MySQL Server
- Angular CLI

## Instrucciones de Instalación

1. **Base de Datos**
   - Crear una base de datos MySQL llamada `tienda_angular_dotnet_lunargames`
   - Importar el archivo SQL proporcionado: `tienda_angular_dotnet_lunargames.sql`

2. **Backend (.NET)**
   - Navegar al directorio `ServidorDotNet`
   - Configurar la cadena de conexión en `Program.cs` si es necesario
   - Ejecutar el Programa:
    
   El servidor se iniciará en `http://localhost:5132`

3. **Frontend (Angular)**
   - Navegar al directorio `cliente`
   - Instalar dependencias:
     ```
     npm install
     ```
   - Iniciar el servidor de desarrollo:
     ```
     ng serve --proxy-config proxy.conf.json
     ```
   La aplicación estará disponible en `http://localhost:4200`

## Estructura del Proyecto

- `/ServidorDotNet` - Backend API
- `/cliente` - Frontend Angular
- `tienda_angular_dotnet_lunargames.sql` - Script de base de datos

## Descarga del Proyecto

El proyecto completo está disponible para su descarga en el siguiente enlace:
[Descargar Proyecto (MediaFire)](https://www.mediafire.com/file/a95hxemspysq9no/doNet.zip/file)

## Archivo Comprimido

El proyecto completo está disponible en el archivo `doNet.rar` que incluye todos los componentes necesarios para la ejecución.

## Notas Adicionales

- Asegúrese de que los puertos 4200 (Angular) y 5000 (.NET) estén disponibles
- La base de datos debe estar en ejecución antes de iniciar el backend

## Contacto

Para cualquier duda o sugerencia, por favor abrir un issue en el repositorio.
