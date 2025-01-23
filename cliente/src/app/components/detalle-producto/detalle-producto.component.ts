import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VideojuegosService } from '../../services/videojuegos.service';
import { CarritoService } from '../../services/carrito.service';
import { EstadoVideojuegoPipe } from '../../pipes/estado-videojuego.pipe';
import { EstadoVideojuego } from '../../models/estado-videojuego.enum';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-detalle-producto',
  standalone: true,
  imports: [EstadoVideojuegoPipe, RouterLink],
  templateUrl: './detalle-producto.component.html',
  styleUrls: ['./detalle-producto.component.css']
})
export class DetalleProductoComponent implements OnInit {
  videojuego: any;
  estadoVideojuego = EstadoVideojuego;

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private videojuegosService: VideojuegosService,
    private carritoService: CarritoService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.videojuegosService.obtenerVideojuegoPorId(+id).subscribe({
        next: (data) => {
          this.videojuego = data;
        },
        error: (error) => {
          console.error('Error al obtener los detalles del videojuego', error);
        },
      });
    }
  }

  agregarAlCarrito(id_videojuego: number, cantidad: number = 1) {
    this.carritoService.agregarAlCarrito(id_videojuego, cantidad).subscribe(
      (response) => {
        console.log('Producto agregado al carrito:', response);
        // Opcional: Puedes mostrar un mensaje de éxito
      },
      (error) => console.error('Error al agregar al carrito:', error)
    );
  }

  irAInicio(): void {
    this.router.navigate(['/']);
  }
}
