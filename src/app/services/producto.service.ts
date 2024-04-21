import { Injectable } from "@angular/core";
import { Producto } from '../interfaces/producto';

@Injectable({
    providedIn: 'root'
})
export class ProductoService {
    private productos: Producto[] = [];
    
    constructor() { }

    getAllProductos(): Producto[] {
        return this.productos;
    }

    getProducto(reference: string): Producto{
        return this.productos.find(producto => producto.reference === reference) as Producto;
    }

    addProducto(producto: Producto): void {
        this.productos.push(producto);
    }

    updateProducto(producto: Producto): void {
        const index = this.productos.findIndex(p => p.reference === producto.reference);
        this.productos[index] = producto;
    }

    deleteProducto(reference: string): void {
        this.productos = this.productos.filter(producto => producto.reference !== reference);
    }

    productoNameExists(name: string): boolean {
        return this.productos.some(producto => producto.name === name);
    }

    productoDescriptionExists(description: string): boolean {
        return this.productos.some(producto => producto.description === description);
    }

}