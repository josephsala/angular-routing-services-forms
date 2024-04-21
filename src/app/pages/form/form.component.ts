import { Component, ChangeDetectionStrategy, } from '@angular/core';
import { CommonModule } from '@angular/common';
//import { MatCheckboxModule } from '@angular/material/checkbox'; 
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { Producto } from '../../interfaces/producto';
import { ProductoService } from '../../services/producto.service';


@Component({
  selector: 'app-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormComponent{

  constructor(private productoService: ProductoService) { }

  nameExists: boolean = false;
  descriptionExists: boolean = false;

  categories: string[] = ['Componentes', 'Portatiles', 'Smartphones', 'Monitores', 'Hogar'];

  Form = new FormGroup({
    reference: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(10), Validators.pattern('[a-zA-Z0-9]*')]),
    name: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(50), Validators.pattern('[a-zA-Z0-9 ]*')]),
    price: new FormControl('', [Validators.required, Validators.min(0)]),
    description: new FormControl('', Validators.maxLength(200)),
    category: new FormControl('', Validators.required),
    sale: new FormControl(false),
    image: new FormControl(),
  });

  onSubmit() {
    const reference = this.Form.value.reference;

    if (reference) {
      const existingProducto = this.productoService.getProducto(reference);

      if (existingProducto) {
        existingProducto.name = this.Form.value.name ? this.Form.value.name : ' ';
        existingProducto.price = parseFloat(!!this.Form.value.price ? this.Form.value.price.toString() : '0');
        existingProducto.description = this.Form.value.description ? this.Form.value.description : ' ';
        existingProducto.category = this.Form.value.category ? this.Form.value.category : ' ';
        existingProducto.sale = typeof this.Form.value.sale === 'string' ? (this.Form.value.sale === 'true') : !!this.Form.value.sale;
        existingProducto.image = this.Form.value.image ? this.Form.value.image : ' ';

        this.productoService.updateProducto(existingProducto);
      } else {
        const newName = this.Form.value.name ?? '';
        const newDescription = this.Form.value.description ?? '';

        if (this.productoService.productoNameExists(newName)) {
          this.nameExists = true;
          console.error('Error: Name already exists.');
          return;
        }
  
        if (this.productoService.productoDescriptionExists(newDescription)) {
          this.descriptionExists = true;
          console.error('Error: Description already exists.');
          return;
        }

        const newProducto: Producto = {
          reference: reference,
          name: newName ? newName : ' ',
          price: parseFloat(!!this.Form.value.price ? this.Form.value.price.toString() : '0'),
          description: newDescription ? newDescription : ' ',
          category: this.Form.value.category ? this.Form.value.category : ' ',
          sale: typeof this.Form.value.sale === 'string' ? (this.Form.value.sale === 'true') : !!this.Form.value.sale,
          image: this.Form.value.image ? this.Form.value.image : ' '

        };
        this.productoService.addProducto(newProducto);
      }
      this.Form.reset();
      this.nameExists = false;
      this.descriptionExists = false;
    }
  }

}