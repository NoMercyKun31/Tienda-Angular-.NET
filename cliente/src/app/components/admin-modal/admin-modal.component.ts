import { NgIf } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-modal',
  standalone: true,
  templateUrl: './admin-modal.component.html',
  imports: [FormsModule, NgIf],
})
export class AdminModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() authenticated = new EventEmitter<void>();
  
  password: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private authService: AuthService) {}

  checkPassword() {
    if (this.authService.login(this.password)) {
      this.successMessage = '¡Bienvenido Administrador!';
      this.errorMessage = '';
      setTimeout(() => {
        this.authenticated.emit();
        window.location.href = '/administracion';
      }, 1000);
    } else {
      this.errorMessage = 'No has sido identificado como administrador';
      this.successMessage = '';
    }
  }

  closeModal() {
    this.close.emit();
  }
}
