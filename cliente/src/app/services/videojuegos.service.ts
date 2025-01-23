import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Videojuego } from '../models/videojuego';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class VideojuegosService {
  private apiUrl = '/server/';

  constructor(private http: HttpClient) {}

  obtenerVideojuegos(): Observable<Videojuego[]> {
    return this.http.get<Videojuego[]>(this.apiUrl + "rest/obtener_videojuegos");
  }

  obtenerVideojuegosNuevos(): Observable<Videojuego[]> {
    return this.http.get<Videojuego[]>(this.apiUrl + "rest/obtener_videojuegos_nuevos");
  }

  obtenerVideojuegoPorId(id: number): Observable<Videojuego> {
    return this.http.get<Videojuego>(`${this.apiUrl}rest/obtener_videojuego_por_id?id=${id}`);
  }  

  obtenerNumeroVideojuegos(): Observable<number> {
    return this.http.get<number>(this.apiUrl + "rest/obtener_numero_videojuegos");
  }

  obtenerCategorias(): Observable<string[]> {
    return this.http.get<string[]>(this.apiUrl + "rest/obtener_categorias");
  }

  agregarAlCarrito(id_videojuego: number, cantidad: number)  {
    return this.http.post<any>(this.apiUrl + "rest/agregar_producto_al_carrito", { 
      "id": id_videojuego, 
      "cantidad": cantidad 
    });
  }

  registrarVideojuego(formData: FormData): Observable<Videojuego> {
    return this.http.post<Videojuego>(this.apiUrl + "rest/registrar_videojuego", formData);
  }

  registrarVideojuegoUsandoFormData(formData: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl + "rest/registrar_videojuego", formData);
  }

  borrarVideojuego(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}rest/borrar_videojuego?id=${id}`);
  }

  actualizarVideojuego(formData: FormData): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}rest/actualizar_videojuego`, formData);
  }
}
