import { Component } from '@angular/core';
import { Videojuego } from '../../models/videojuego';
import { VideojuegosService } from '../../services/videojuegos.service';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-nuevo-productos',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './admin-nuevo-productos.component.html',
  styleUrls: ['./admin-nuevo-productos.component.css']
})
export class AdminNuevoProductosComponent {
  videojuego: Videojuego = {
    id: 0,
    titulo: '',
    precio: 0,
    compania: '',
    estado: 'En Oferta',
    anio_lanzamiento: 0,
    categoria: '',
  };
  archivo: File = {} as File;
  nombreArchivo: string = '';
  productoForm: FormGroup;

  // Validador personalizado para texto
  noMultipleSpaces(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    
    const value = control.value.toString();
    if (value.includes('  ')) {
      return { multipleSpaces: true };
    }
    
    // Validar caracteres especiales y scripts
    const scriptPattern = /<[^>]*>|javascript:|script:|alert\(|eval\(|document\.|window\./i;
    if (scriptPattern.test(value)) {
      return { invalidCharacters: true };
    }

    return null;
  }

  // Validador personalizado para año
  validYear(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    
    const year = Number(control.value);
    const currentYear = new Date().getFullYear();
    
    if (isNaN(year) || year < 1950 || year > currentYear + 2) {
      return { invalidYear: true };
    }
    
    return null;
  }

  constructor(
    private videojuegosService: VideojuegosService,
    private fb: FormBuilder,
    private router: Router
  ){
    this.productoForm = this.fb.group({
      titulo: ['', [
        Validators.required, 
        Validators.minLength(3), 
        Validators.maxLength(100),
        this.noMultipleSpaces.bind(this)
      ]],
      precio: ['', [
        Validators.required, 
        Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$')
      ]],
      compania: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100),
        this.noMultipleSpaces.bind(this)
      ]],
      estado: ['En Oferta'],
      anio_lanzamiento: [null, [
        Validators.required,
        this.validYear.bind(this)
      ]],
      categoria: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        this.noMultipleSpaces.bind(this)
      ]]
    });
  }

  archivoSeleccionado(event: any) {
    this.archivo = event.target.files[0];
    this.nombreArchivo = this.archivo.name;
  }

  registrarVideojuego() {
    if (this.productoForm.invalid) {
      Object.keys(this.productoForm.controls).forEach(key => {
        const control = this.productoForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
      return;
    }

    if (!this.archivo || !this.archivo.name) {
      alert('Por favor, seleccione una imagen para el videojuego');
      return;
    }

    const formValues = this.productoForm.value;
    let formData = new FormData();
    
    // Convertir explícitamente a número y validar
    const anio = parseInt(formValues.anio_lanzamiento);
    if (isNaN(anio) || anio <= 0) {
        alert('Por favor, ingrese un año válido');
        return;
    }
    
    // Manejo especial para el precio
    let precio = formValues.precio;
    console.log('Precio original:', precio, typeof precio);
    
    if (typeof precio === 'string') {
      precio = precio.replace(',', '.');
      console.log('Precio después de reemplazar coma:', precio);
    }
    
    precio = parseFloat(precio);
    console.log('Precio como número:', precio);
    
    const precioFinal = precio.toFixed(2);
    console.log('Precio final a enviar:', precioFinal);
    
    formData.append("titulo", formValues.titulo.trim());
    formData.append("precio", precioFinal);
    formData.append("compania", formValues.compania.trim());
    formData.append("estado", formValues.estado);
    formData.append("anioLanzamiento", anio.toString()); 
    formData.append("categoria", formValues.categoria.trim());
    formData.append("archivo", this.archivo);

    console.log('Enviando año:', anio); 

    this.videojuegosService.registrarVideojuego(formData).subscribe({
        next: (res) => {
            console.log('Respuesta del servidor:', res);
            alert('Videojuego registrado con éxito');
            setTimeout(() => {
              this.router.navigate(['/administracion']);
            }, 2000);
            this.productoForm.reset({
              estado: 'EnOferta',
              precio: 0,
              anio_lanzamiento: null
            });
            this.nombreArchivo = '';
            this.archivo = {} as File;
        },
        error: (error) => {
            console.error('Error al registrar el videojuego:', error);
            alert('Error al registrar el videojuego: ' + (error.error?.message || 'Error desconocido'));
        }
    });
  }

  registrarLibroOk() {
    alert('Videojuego registrado con éxito');
    setTimeout(() => {
      this.router.navigate(['/administracion']);
    }, 2000);
  }

  volver() {
    this.router.navigate(['/administracion']);
  }

  formatearPrecio(event: any) {
    let valor = event.target.value;
    console.log('Valor original en formatearPrecio:', valor);
    
    // Reemplazar comas por puntos
    valor = valor.replace(',', '.');
    console.log('Valor después de reemplazar coma:', valor);
    
    // Asegurarse de que solo hay un punto decimal
    const partes = valor.split('.');
    if (partes.length > 2) {
      valor = partes[0] + '.' + partes.slice(1).join('');
    }
    
    // Limitar a dos decimales
    if (partes.length === 2 && partes[1].length > 2) {
      valor = partes[0] + '.' + partes[1].substring(0, 2);
    }
    
    console.log('Valor después de procesar decimales:', valor);
    
    // Convertir a número y asignar al formulario
    const numeroFormateado = parseFloat(valor);
    console.log('Número formateado:', numeroFormateado);
    
    if (!isNaN(numeroFormateado)) {
      // Asegurar que siempre tenga 2 decimales
      const precioFormateado = numeroFormateado.toFixed(2);
      console.log('Precio final formateado:', precioFormateado);
      
      this.productoForm.patchValue({
        precio: precioFormateado
      });
      // Actualizar el valor en el input para mostrar siempre dos decimales
      event.target.value = precioFormateado;
    }
  }

  // Métodos de ayuda para mostrar mensajes de error
  getErrorMessage(controlName: string): string {
    const control = this.productoForm.get(controlName);
    if (!control || !control.errors || !control.touched) return '';

    if (control.errors['required']) return 'Este campo es requerido';
    if (control.errors['minlength']) return `Mínimo ${control.errors['minlength'].requiredLength} caracteres`;
    if (control.errors['maxlength']) return `Máximo ${control.errors['maxlength'].requiredLength} caracteres`;
    if (control.errors['min']) return `El valor mínimo es ${control.errors['min'].min}`;
    if (control.errors['max']) return `El valor máximo es ${control.errors['max'].max}`;
    if (control.errors['multipleSpaces']) return 'No se permiten espacios múltiples';
    if (control.errors['invalidCharacters']) return 'Contiene caracteres no permitidos';
    if (control.errors['invalidYear']) return 'Año no válido (entre 1950 y ' + (new Date().getFullYear() + 2) + ')';
    if (control.errors['pattern']) return 'Precio inválido, debe ser un número decimal con máximo dos decimales';

    return 'Error de validación';
  }
}
