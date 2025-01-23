import { Component, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarritoService } from '../../services/carrito.service';
import { CheckoutModalComponent } from '../checkout-modal/checkout-modal.component';
import { ItemCarrito } from '../../models/item-carrito';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, CheckoutModalComponent],
  templateUrl: './carrito.component.html',
})
export class CarritoComponent {
  items: ItemCarrito[] = [];
  private carritoService = inject(CarritoService);
  @ViewChild('checkoutModal') checkoutModal!: CheckoutModalComponent;

  ngOnInit() {
    this.cargarCarrito();
  }

  cargarCarrito() {
    try {
      this.carritoService.obtenerCarrito().subscribe({
        next: (response) => {
          this.items = response || []; 
        },
        error: (error) => {
          console.error('Error al cargar el carrito:', error);
          this.items = []; 
        }
      });
    } catch (error) {
      console.error('Error al cargar el carrito:', error);
      this.items = []; 
    }
  }

  async actualizarCantidad(id: number, cantidad: number) {
    if (cantidad < 1) return;
    
    try {
      await this.carritoService.actualizarCantidad(id, cantidad).toPromise();
      await this.cargarCarrito();
    } catch (error) {
      console.error('Error al actualizar cantidad:', error);
    }
  }

  async eliminarItem(id: number) {
    try {
      await this.carritoService.eliminarDelCarrito(id).toPromise();
      await this.cargarCarrito();
    } catch (error) {
      console.error('Error al eliminar item:', error);
    }
  }

  async vaciarCarrito() {
    try {
      await this.carritoService.vaciarCarrito().toPromise();
      this.items = [];
    } catch (error) {
      console.error('Error al vaciar el carrito:', error);
    }
  }

  calcularTotal(): number {
    return this.items.reduce((total, item) => total + (item.precio * item.cantidad), 0);
  }

  abrirCheckout() {
    this.checkoutModal.openModal();
  }
}
