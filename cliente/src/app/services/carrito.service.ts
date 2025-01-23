import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';
import { Videojuego } from '../models/videojuego';

export interface ItemCarrito {
  id_videojuego: number;
  titulo: string;
  precio: number;
  cantidad: number;
}

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private apiUrl = '/server/';
  private totalItemsSubject = new BehaviorSubject<number>(0);
  totalItems$ = this.totalItemsSubject.asObservable();
  private carritoActualizadoSource = new Subject<void>();
  carritoActualizado$ = this.carritoActualizadoSource.asObservable();

  constructor(private http: HttpClient) {}

  obtenerCarrito(): Observable<ItemCarrito[]> {
    return this.http.get<ItemCarrito[]>(this.apiUrl + "rest/carrito/obtener").pipe(
      tap(items => this.updateTotalItems(items))
    );
  }

  agregarAlCarrito(id_videojuego: number, cantidad: number = 1): Observable<any> {
    return this.http.post<any>(this.apiUrl + "rest/carrito/agregar", {
      id_videojuego,
      cantidad
    }).pipe(
      tap(() => {
        this.carritoActualizadoSource.next();
      })
    );
  }

  actualizarCantidad(id_videojuego: number, cantidad: number): Observable<any> {
    return this.http.put<any>(this.apiUrl + "rest/carrito/actualizar", {
      id_videojuego,
      cantidad
    }).pipe(
      tap(() => {
        this.carritoActualizadoSource.next();
      })
    );
  }

  eliminarDelCarrito(id_videojuego: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}rest/carrito/eliminar/${id_videojuego}`).pipe(
      tap(() => {
        this.carritoActualizadoSource.next();
      })
    );
  }

  vaciarCarrito(): Observable<any> {
    return this.http.delete<any>(this.apiUrl + "rest/carrito/vaciar").pipe(
      tap(() => {
        this.carritoActualizadoSource.next();
      })
    );
  }

  private updateTotalItems(items: ItemCarrito[]) {
    const total = items.reduce((sum, item) => sum + item.cantidad, 0);
    this.totalItemsSubject.next(total);
  }
}
