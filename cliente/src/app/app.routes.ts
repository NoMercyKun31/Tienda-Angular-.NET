import { Routes } from '@angular/router';
import { ListadolanzamientosComponent } from './components/listadolanzamientos/listadolanzamientos.component';
import { CatalogoComponent } from './components/catalogo/catalogo.component';
import { DetalleProductoComponent } from './components/detalle-producto/detalle-producto.component';
import { ContactComponent } from './contact/contact.component';
import { AdministracionComponent } from './components/administracion/administracion.component';
import { AdminProductosComponent } from './components/admin-productos/admin-productos.component';
import { AdminNuevoProductosComponent } from './components/admin-nuevo-productos/admin-nuevo-productos.component';
import { AdminPedidosComponent } from './components/admin-pedidos/admin-pedidos.component';

export const routes: Routes = [
    //Parte para el Cliente
    { path: '', component: ListadolanzamientosComponent },
    { path: 'catalogo', component: CatalogoComponent },
    { path: 'detalle/:id', component: DetalleProductoComponent }, 
    { path: 'contact', component: ContactComponent },
    //Parte Para la Administración
    { path: 'administracion', component: AdministracionComponent },
    { path: 'admin-productos', component: AdminProductosComponent },
    { path: 'admin-nuevo-producto', component: AdminNuevoProductosComponent },
    { path: 'admin-pedidos', component: AdminPedidosComponent },
    { path: '**', redirectTo: '' }
];
