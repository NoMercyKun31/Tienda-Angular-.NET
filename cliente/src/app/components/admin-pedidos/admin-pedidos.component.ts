import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { PedidosService } from '../../services/pedidos.service';
import { Router } from '@angular/router';

interface Pedido {
  id: number;
  nombre: string;
  email: string;
  direccion: string;
  telefono: string;
  total: number;
  estado: string;
  fechaCreacion: string;
  detalles: any[];
  editandoEstado?: boolean;
}

@Component({
  selector: 'app-admin-pedidos',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './admin-pedidos.component.html',
  styleUrls: ['./admin-pedidos.component.css']
})
export class AdminPedidosComponent implements OnInit {
  pedidos: Pedido[] = [];
  estadosDisponibles = ['pendiente', 'completado', 'cancelado'];
  
  constructor(
    private pedidosService: PedidosService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarPedidos();
  }

  cargarPedidos() {
    this.pedidosService.obtenerTodosPedidos().subscribe({
      next: (data) => {
        this.pedidos = data;
        console.log('Pedidos cargados (raw):', JSON.stringify(data, null, 2));
      },
      error: (error) => {
        console.error('Error al cargar pedidos:', error);
      }
    });
  }

  eliminarPedido(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este pedido?')) {
      this.pedidosService.eliminarPedido(id).subscribe({
        next: () => {
          this.pedidos = this.pedidos.filter(p => p.id !== id);
        },
        error: (error) => {
          console.error('Error al eliminar pedido:', error);
          alert('Error al eliminar el pedido');
        }
      });
    }
  }

  onEstadoChange(event: Event, pedidoId: number) {
    const select = event.target as HTMLSelectElement;
    if (select) {
      this.actualizarEstado(pedidoId, select.value);
    }
  }

  actualizarEstado(id: number, nuevoEstado: string) {
    this.pedidosService.actualizarEstadoPedido(id, nuevoEstado).subscribe({
      next: () => {
        const pedido = this.pedidos.find(p => p.id === id);
        if (pedido) {
          pedido.estado = nuevoEstado;
        }
      },
      error: (error) => {
        console.error('Error al actualizar estado:', error);
        alert('Error al actualizar el estado del pedido');
      }
    });
  }

  getEstadoClass(estado: string): string {
    switch (estado.toLowerCase()) {
      case 'pendiente':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'completado':
        return 'bg-green-500/20 text-green-400';
      case 'cancelado':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  }

  cambiarEstado(id: number, event: any) {
    const nuevoEstado = event.target.value;
    this.pedidosService.actualizarEstadoPedido(id, nuevoEstado).subscribe({
      next: () => {
        const pedido = this.pedidos.find(p => p.id === id);
        if (pedido) {
          pedido.estado = nuevoEstado;
          pedido.editandoEstado = false;
        }
      },
      error: (error) => {
        console.error('Error al actualizar el estado:', error);
      }
    });
  }

  volverAtras() {
    this.router.navigate(['/administracion']);
  }

  formatearFecha(fecha: string | null): string {
    if (!fecha) {
      console.log('Fecha recibida es null o undefined');
      return 'Fecha no disponible';
    }

    console.log('Fecha recibida:', fecha);
    
    try {
      const date = new Date(fecha);
      console.log('Fecha parseada:', date);
      
      if (isNaN(date.getTime())) {
        console.log('Fecha inválida después del parseo');
        return 'Fecha inválida';
      }

      const formatoEspanol = new Intl.DateTimeFormat('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });

      return formatoEspanol.format(date);
    } catch (error) {
      console.error('Error al formatear fecha:', error);
      return 'Error en fecha';
    }
  }
}
