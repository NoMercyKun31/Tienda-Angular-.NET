import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PedidosService } from '../../services/pedidos.service';
import { CarritoService } from '../../services/carrito.service';

@Component({
  selector: 'app-checkout-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './checkout-modal.component.html',
})
export class CheckoutModalComponent {
  currentStep = 1;
  datosPersonalesForm: FormGroup;
  datosPagoForm: FormGroup;
  isModalOpen = false;
  pedidoResumen: any = null;
  cartItems: any[] = [];
  total: number = 0;
  
  private fb = inject(FormBuilder);
  private pedidosService = inject(PedidosService);
  private carritoService = inject(CarritoService);

  constructor() {
    this.datosPersonalesForm = this.fb.group({
      nombre: ['', [
        Validators.required,
        Validators.pattern(/^(?!.*\s{3,})[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]{2,50}$/),
      ]],
      email: ['', [
        Validators.required, 
        Validators.email
      ]],
      direccion: ['', [
        Validators.required,
        Validators.pattern(/^(?!.*\s{3,})[a-zA-Z0-9ñÑáéíóúÁÉÍÓÚ\s,./-]{5,100}$/),
      ]],
      telefono: ['', [
        Validators.required
      ]]
    });

    this.datosPagoForm = this.fb.group({
      numero_tarjeta: ['', [
        Validators.required,
        Validators.pattern(/^[0-9]{16}$/),
      ]]
    });
  }

  async openModal() {
    this.isModalOpen = true;
    this.currentStep = 1;
    this.datosPersonalesForm.reset();
    this.datosPagoForm.reset();
    await this.cargarCarrito();
  }

  async cargarCarrito() {
    try {
      const response = await this.carritoService.obtenerCarrito().toPromise();
      this.cartItems = response || [];
      this.total = this.cartItems.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    } catch (error) {
      console.error('Error al cargar el carrito:', error);
    }
  }

  closeModal() {
    this.isModalOpen = false;
  }

  nextStep() {
    if (this.currentStep === 1 && this.datosPersonalesForm.valid) {
      this.currentStep++;
    } else if (this.currentStep === 2 && this.datosPagoForm.valid) {
      this.currentStep++;
      this.prepararResumen();
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  prepararResumen() {
    this.pedidoResumen = {
      ...this.datosPersonalesForm.value,
      ...this.datosPagoForm.value,
      items: this.cartItems,
      total: this.total
    };
  }

  async finalizarPedido() {
    if (this.datosPersonalesForm.valid && this.datosPagoForm.valid) {
      try {
        const pedidoData = {
          ...this.datosPersonalesForm.value,
          ...this.datosPagoForm.value,
          items: this.cartItems,
          total: this.total
        };
        
        const response = await this.pedidosService.crearPedido(pedidoData).toPromise();
        // Vaciar el carrito después de un pedido exitoso
        await this.carritoService.vaciarCarrito().toPromise();
        alert('¡Pedido realizado con éxito!');
        this.closeModal();
      } catch (error) {
        console.error('Error al crear el pedido:', error);
        alert('Error al procesar el pedido. Por favor, inténtelo de nuevo.');
      }
    }
  }

  get nombreError() {
    const control = this.datosPersonalesForm.get('nombre');
    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'El nombre es requerido';
      if (control.errors['pattern']) return 'El nombre no puede contener más de dos espacios consecutivos';
    }
    return '';
  }

  get direccionError() {
    const control = this.datosPersonalesForm.get('direccion');
    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'La dirección es requerida';
      if (control.errors['pattern']) return 'La dirección no puede contener más de dos espacios consecutivos';
    }
    return '';
  }

  get numeroTarjetaError() {
    const control = this.datosPagoForm.get('numero_tarjeta');
    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'El número de tarjeta es requerido';
      if (control.errors['pattern']) return 'El número de tarjeta debe tener exactamente 16 dígitos';
    }
    return '';
  }
}
