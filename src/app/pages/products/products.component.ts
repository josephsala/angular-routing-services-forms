import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Producto } from '../../interfaces/producto';
import { ProductoService } from '../../services/producto.service';


@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsComponent {
  
  productos: Producto[] = [];
  searchTerm: string = '';

  constructor(private productoService: ProductoService) { }

  ngOnInit(): void {
    this.productos = this.productoService.getAllProductos();
  }

  search(term: string): void {
    // Si el término de búsqueda está vacío, mostrar todos los productos
    if (!term.trim()) {
      this.productos = this.productoService.getAllProductos();
      return;
    }

    // Filtrar los productos que coincidan con el término de búsqueda
    this.productos = this.productoService.getAllProductos().filter(producto =>
      producto.name.toLowerCase().includes(term.toLowerCase())
    );
  }
 }
