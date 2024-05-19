import { Injectable, signal } from '@angular/core';
import { Product } from '../interfaces/product';
import { HttpClient } from '@angular/common/http';
import { catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  // Inicializamos el array para almacenar los productos
  products: Product[] = [];

  // Signal para compartir los productos entre componentes hermanos
  productSignal = signal<Product[]>([]);

  // URL de la API REST
  apiURL: string = 'http://localhost:3000/api/products';

  // Inyectamos el servicio HttpClient y obtenemos todos los productos en el constructor
  constructor(private http: HttpClient) { this.getAllProducts(); }

  // Método GET para obtener todos los productos
  getAllProducts() {
    this.http.get<Product[]>(this.apiURL)
      .pipe(
        catchError(error => {
          console.error('Error when obtaining the products:', error);
          return of([]);
        })
      )
      .subscribe((products) => {
        this.productSignal.set(products);
      });
  }

  // Método GET para obtener un producto por referencia
  getProductByReference(reference: string) {
    return this.http.get<Product>(`${this.apiURL}/${reference}`)
      .pipe(
        catchError(error => {
          console.error('Error when obtaining the product:', error);
          return of(null);
        })
      );
  }

  // Método POST para crear un producto
  createProduct(product: Product) {
    this.http.post<Product>(this.apiURL, product)
      .pipe(
        catchError(error => {
          console.error('Error when creating the product:', error);
          return of(null);
        })
      )
      .subscribe(response => {
        if (response) {
          this.getAllProducts();
        }
      });
  }

  // Método PUT para actualizar un producto por referencia
  updateProduct(reference: string, product: Product) {
    this.http.put<Product>(`${this.apiURL}/${reference}`, product)
      .pipe(
        catchError(error => {
          console.error('Error when updating the product:', error);
          return of(null);
        })
      )
      .subscribe(response => {
        if (response) {
          this.getAllProducts();
        }
      });
  }

  // Método DELETE para eliminar un producto por referencia
  deleteProduct(reference: string) {
    this.http.delete<Product>(`${this.apiURL}/${reference}`)
      .pipe(
        catchError(error => {
          console.error('Error when deleting the product:', error);
          return of(null);
        })
      )
      .subscribe(response => {
        if (response) {
          this.getAllProducts();
        }
      });
  }
}