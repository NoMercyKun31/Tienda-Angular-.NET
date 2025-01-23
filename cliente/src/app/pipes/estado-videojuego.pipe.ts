import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'estadoVideojuego',
  standalone: true
})
export class EstadoVideojuegoPipe implements PipeTransform {
  transform(value: string): string {
    switch (value) {
      case 'En Oferta':
        return 'En Oferta';
      case 'Destacado':
        return 'Destacado';
      case 'Nuevo Lanzamiento':
        return 'Nuevo Lanzamiento';
      default:
        return value || 'Desconocido';
    }
  }
}
