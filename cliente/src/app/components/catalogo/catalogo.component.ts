import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { VideojuegosService } from '../../services/videojuegos.service';
import { CarritoService } from '../../services/carrito.service';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe],
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.css']
})
export class CatalogoComponent implements OnInit {
  videojuegos: any[] = [];
  videojuegosFiltrados: any[] = [];
  sortDirection: 'asc' | 'desc' = 'asc';
  precioMinimo: number = 0;
  precioMaximo: number = 1000;

  constructor(
    private videojuegosService: VideojuegosService,
    private router: Router,
    private carritoService: CarritoService,
    private searchService: SearchService
  ) {
    this.searchService.searchTerm$.subscribe(term => {
      this.filtrarJuegos(term);
    });
  }

  ngOnInit() {
    this.cargarVideojuegos();
  }

  cargarVideojuegos() {
    this.videojuegosService.obtenerVideojuegos().subscribe({
      next: (videojuegos: any) => {
        this.videojuegos = videojuegos;
        this.videojuegosFiltrados = [...this.videojuegos];
      },
      error: (error) => {
        console.error('Error al obtener los videojuegos', error);
      },
    });
  }

  verDetalles(id: string) {
    this.router.navigate(['/detalle', id]);
  }

  agregarAlCarrito(id_videojuego: number) {
    this.carritoService.agregarAlCarrito(id_videojuego, 1).subscribe(
      (response) => {
        console.log('Producto agregado al carrito:', response);
      },
      (error) => console.error('Error al agregar al carrito:', error)
    );
  }

  filtrarJuegos(searchTerm: string) {
    if (!searchTerm) {
      this.videojuegosFiltrados = this.videojuegos.filter(juego => {
        const precio = juego.precio;
        return precio >= this.precioMinimo && precio <= this.precioMaximo;
      });
    } else {
      this.videojuegosFiltrados = this.videojuegos.filter(juego => {
        const cumplePrecio = juego.precio >= this.precioMinimo && juego.precio <= this.precioMaximo;
        const cumpleBusqueda = juego.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              juego.compania.toLowerCase().includes(searchTerm.toLowerCase());
        return cumplePrecio && cumpleBusqueda;
      });
    }
  }

  filtrarPorPrecio() {
    const currentSearchTerm = this.searchService.getCurrentSearchTerm();
    this.filtrarJuegos(currentSearchTerm);
  }

  ordenarPorNombre() {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.videojuegosFiltrados.sort((a, b) => {
      const comparacion = a.titulo.localeCompare(b.titulo);
      return this.sortDirection === 'asc' ? comparacion : -comparacion;
    });
  }

  ordenarPorPrecio() {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.videojuegosFiltrados.sort((a, b) => {
      const comparacion = a.precio - b.precio;
      return this.sortDirection === 'asc' ? comparacion : -comparacion;
    });
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

  irAInicio() {
    this.router.navigate(['/']);
  }
}
