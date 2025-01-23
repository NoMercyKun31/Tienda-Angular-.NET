import { Component } from '@angular/core';
import { VideojuegosService } from '../../services/videojuegos.service';
import { NgFor, CurrencyPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CarritoService } from '../../services/carrito.service';
import { EstadoVideojuegoPipe } from '../../pipes/estado-videojuego.pipe';

@Component({
  standalone: true,
  imports: [NgFor, RouterLink, EstadoVideojuegoPipe, CurrencyPipe],
  selector: 'app-listadolanzamientos',
  templateUrl: './listadolanzamientos.component.html',
  styleUrls: ['./listadolanzamientos.component.css']
})
export class ListadolanzamientosComponent {
  videojuegosFiltrados: any[] = [];

  constructor(
    private videojuegosService: VideojuegosService,
    private router: Router,
    private carritoService: CarritoService
  ) {}

  ngOnInit() {
    this.cargarVideojuegos();
  }

  cargarVideojuegos() {
    this.videojuegosService.obtenerVideojuegos().subscribe({
      next: (videojuegos: any) => {
        this.videojuegosFiltrados = videojuegos.filter((v: any) => v.estado === 'Nuevo Lanzamiento');
      },
      error: (error) => {
        console.error('Error al obtener los videojuegos', error);
      },
    });
  }

  agregarAlCarrito(videojuego: any) {
    this.carritoService.agregarAlCarrito(videojuego);
  }

  verDetalles(id: number) {
    this.router.navigate(['/detalles', id]);
  }
}
