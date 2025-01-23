import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { VideojuegosService } from '../../services/videojuegos.service';
import { Videojuego } from '../../models/videojuego';
import { Router } from '@angular/router';
import { EstadoVideojuegoPipe } from '../../pipes/estado-videojuego.pipe';

@Component({
  selector: 'app-admin-productos',
  templateUrl: './admin-productos.component.html',
  styleUrls: ['./admin-productos.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, EstadoVideojuegoPipe]
})
export class AdminProductosComponent implements OnInit {
  videojuegos: Videojuego[] = [];
  mostrarModalEdicion = false;
  videojuegoEnEdicion: any = {};
  archivoSeleccionado: File | null = null;
  estados = ['En Oferta', 'Destacado', 'Nuevo Lanzamiento'];
  mensajeExito: string = '';
  mostrarMensaje: boolean = false;

  constructor(
    private videojuegosService: VideojuegosService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarVideojuegos();
  }

  cargarVideojuegos(): void {
    this.videojuegosService.obtenerVideojuegos().subscribe({
      next: (data) => {
        this.videojuegos = data;
      },
      error: (error: Error) => {
        console.error('Error al cargar los videojuegos:', error);
      }
    });
  }

  abrirModalEdicion(videojuego: Videojuego): void {
    this.videojuegoEnEdicion = { ...videojuego };
    this.mostrarModalEdicion = true;
  }

  cerrarModalEdicion(): void {
    this.mostrarModalEdicion = false;
    this.videojuegoEnEdicion = {};
    this.archivoSeleccionado = null;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.archivoSeleccionado = file;
    }
  }

  getEstadoClase(estado: string): string {
    switch (estado) {
      case 'En Oferta':
        return 'bg-green-500';
      case 'Destacado':
        return 'bg-blue-500';
      case 'Nuevo Lanzamiento':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  }

  getEstadoTexto(estado: string): string {
    return estado;
  }

  mostrarMensajeExito(mensaje: string) {
    this.mensajeExito = mensaje;
    this.mostrarMensaje = true;
    // Ocultar el mensaje después de 3 segundos
    setTimeout(() => {
      this.mostrarMensaje = false;
      this.mensajeExito = '';
    }, 3000);
  }

  formatearPrecio(event: any) {
    let valor = event.target.value;
    // Reemplazar comas por puntos
    valor = valor.replace(',', '.');
    // Asegurarse de que solo hay un punto decimal
    const partes = valor.split('.');
    if (partes.length > 2) {
      valor = partes[0] + '.' + partes.slice(1).join('');
    }
    // Limitar a dos decimales
    if (partes.length === 2 && partes[1].length > 2) {
      valor = partes[0] + '.' + partes[1].substring(0, 2);
    }
    // Convertir a número y asignar
    this.videojuegoEnEdicion.precio = parseFloat(valor);
    // Actualizar el valor en el input
    event.target.value = this.videojuegoEnEdicion.precio.toString();
  }

  guardarEdicion(): void {
    const formData = new FormData();
    
    // Crear una copia del objeto para manipular
    const videojuegoData = { ...this.videojuegoEnEdicion };
    
    // Asegurarnos de que el precio use punto decimal y sea un número válido
    const precio = typeof videojuegoData.precio === 'string' 
      ? parseFloat(videojuegoData.precio.replace(',', '.'))
      : videojuegoData.precio;

    // Añadir todos los campos al FormData
    formData.append('id', videojuegoData.id.toString());
    formData.append('titulo', videojuegoData.titulo);
    formData.append('precio', precio.toString());
    formData.append('estado', videojuegoData.estado);
    formData.append('compania', videojuegoData.compania);
    formData.append('anio_lanzamiento', videojuegoData.anio_lanzamiento.toString());
    formData.append('categoria', videojuegoData.categoria);

    // Añadir el archivo si se seleccionó uno nuevo
    if (this.archivoSeleccionado) {
      formData.append('archivo', this.archivoSeleccionado);
    }

    this.videojuegosService.actualizarVideojuego(formData).subscribe({
      next: (response) => {
        this.cerrarModalEdicion();
        this.cargarVideojuegos();
        this.mostrarMensajeExito(`¡El videojuego "${videojuegoData.titulo}" ha sido actualizado correctamente!`);
      },
      error: (error) => {
        console.error('Error detallado:', error);
        alert('Error al actualizar el videojuego');
      }
    });
  }

  editarVideojuego(id: number): void {
    this.router.navigate(['/admin-editar-producto', id]);
  }

  borrarVideojuego(id: number): void {
    if (confirm('¿Estás seguro de que quieres borrar este videojuego?')) {
      this.videojuegosService.borrarVideojuego(id).subscribe({
        next: () => {
          this.cargarVideojuegos();
        },
        error: (error) => {
          console.error('Error al borrar el videojuego:', error);
          alert('Error al borrar el videojuego');
        }
      });
    }
  }

  volver() {
    this.router.navigate(['/administracion']);
  }
}
