import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, effect } from '@angular/core';
import { ProductsService } from '../../services/products-service';
import { Product } from '../../interfaces/product';
import { FormControl, FormGroup, Validators, ReactiveFormsModule, ValidatorFn, AbstractControl } from '@angular/forms';
import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './products.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsComponent implements OnInit {

  products = this.ProductsService.products;
  isEditing: boolean = false;
  showPopup: boolean = false;

  constructor(private titleService: Title, private ProductsService: ProductsService) {

    effect(() => { this.products = this.ProductsService.productSignal(); });

    
  }
  ngOnInit(): void {
    // Establecemos el título de la página
    this.titleService.setTitle('Products');
    // Obtenemos los productos desde el servicio
    this.products = this.ProductsService.productSignal();
    // Movemos el scroll al principio de la página
    window.scrollTo(0, 0);
  }

  deleteProduct(index: number) {
    // Método para eliminar un producto de la base de datos
    this.ProductsService.deleteProduct(this.products[index].reference);
    // Enviamos la eliminación del producto al servicio
    this.ProductsService.productSignal.set(this.products);
  }

}
