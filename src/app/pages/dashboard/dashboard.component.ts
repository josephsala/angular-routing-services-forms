import { Component, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, Validators, ReactiveFormsModule, ValidatorFn, AbstractControl } from '@angular/forms';
import { ProductsService } from '../../services/products-service';
import { PopupComponent } from '../../components/popup/popup.component';
import { Product } from '../../interfaces/product';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, PopupComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  products = this.ProductsService.products;
  productForm: FormGroup;
  isEditing: boolean = false;
  showPopup: boolean = false;
  popupMessage: string = '';

  constructor(private titleService: Title, private ProductsService: ProductsService) {

    effect(() => { this.products = this.ProductsService.productSignal(); });

    this.productForm = new FormGroup({
      reference: new FormControl('', { validators: [Validators.required, Validators.minLength(1), Validators.maxLength(20), this.referenceStartNumber()] }),
      name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
      price: new FormControl('', [Validators.required, Validators.min(0), Validators.pattern(/^[0-9]+(\.[0-9]{1,2})?$/)]),
      description: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(500)]),
      type: new FormControl('', [Validators.required]),
      offer: new FormControl(false),
      image: new FormControl('', [Validators.required, Validators.pattern(/\.(jpg|jpeg|png)$/i)])
    });
  }

  product: Product = {
    reference: '', name: '', price: 0, description: '', type: '', offer: false, image: ''
  };

  referenceStartNumber(): ValidatorFn {
    // Método para comprobar si la referencia del producto empieza por un número
    return (control: AbstractControl): { [key: string]: any } | null => {
      const reference = control.value;

      if (reference && !/^[0-9]/.test(reference)) {
        return { 'uniqueReference': { value: control.value } };
      }
      return null;
    };
  }

  selectImage(event: any) {
    // Método para seleccionar un archivo de imagen y obtener su nombre
    if (event.target.files.length > 0) {
      // Obtenemos el archivo seleccionado
      const file = event.target.files[0];
      // Añadimos el nombre del archivo al input de imagen
      this.product.image = file.name;
    }
  }

  

  ngOnInit(): void {
    // Establecemos el título de la página
    this.titleService.setTitle('Forms');
    // Obtenemos los productos desde el servicio
    this.products = this.ProductsService.productSignal();
    // Movemos el scroll al principio de la página
    window.scrollTo(0, 0);
  }

  onSubmit() {
    if (this.productForm.valid) {
      // Verificamos si estamos editando un producto o añadiendo uno nuevo
      if (this.isEditing) {
        this.updateProduct();
      } else {
        this.addNewProduct();
      }
      this.showPopup = true;
      // Mostramos un mensaje de confirmación en el popup
      this.popupMessage = this.isEditing ? 'Producto editado correctamente' : 'Producto añadido correctamente';
      // El popup se ocultará automáticamente después de 3 segundos
      setTimeout(() => { this.showPopup = false; }, 3000);
      // Reiniciamos el estado de edición y el formulario
      this.isEditing = false;
      this.productForm.reset();
    }
  }

  addNewProduct() {
    // Creamos un nuevo producto con los datos del formulario
    const newProduct: Product = this.createProductForm();
    // Eliminamos la ruta del archivo y nos quedamos con el nombre del archivo
    newProduct.image = './assets/images/' + newProduct.image.replace(/^.*[\\\/]/, '');
    // Añadimos el nuevo producto a la base de datos
    this.ProductsService.createProduct(newProduct);
    // Enviamos el nuevo producto al servicio
    this.ProductsService.productSignal.set(this.products);
  }

  updateProduct() {
    // Creamos un producto con los datos del formulario
    const updateProduct: Product = this.createProductForm();
    // Eliminamos la ruta del archivo y nos quedamos con el nombre del archivo
    updateProduct.image = './assets/images/' + updateProduct.image.replace(/^.*[\\\/]/, '');
    // Actualizamos el producto de la base de datos
    this.ProductsService.updateProduct(updateProduct.reference, updateProduct);
    // Enviamos el producto actualizado al servicio
    this.ProductsService.productSignal.set(this.products);
  }

  createProductForm(): Product {
    // Método para crear un objeto producto con los datos del formulario
    return {
      reference: this.productForm.value.reference ? this.productForm.value.reference : '',
      name: this.productForm.value.name ? this.productForm.value.name : '',
      price: this.productForm.value.price ? this.productForm.value.price : 0,
      description: this.productForm.value.description ? this.productForm.value.description : '',
      type: this.productForm.value.type ? this.productForm.value.type : '',
      offer: this.productForm.value.offer ? this.productForm.value.offer : false,
      image: this.productForm.value.image ? this.productForm.value.image : ''
    }
  }

  searchReference() {
    // Buscamos la referencia del producto en el array de productos
    const reference = this.productForm.value.reference;
    // Comprobamos si la referencia ya existe en la base de datos
    this.ProductsService.getProductByReference(reference).subscribe(product => {
      // Si la referencia ya existe, completamos el formulario con los datos de ese producto
      if (product) {
        this.isEditing = true;
        this.autocompleteForm(product);
      }
    });
  }

  autocompleteForm(product: Product) {
    // Método para autocompletar el formulario con los datos del producto
    this.productForm.setValue({
      reference: product.reference,
      name: product.name,
      price: product.price,
      description: product.description,
      type: product.type,
      offer: product.offer,
      image: product.image
    });
  }
}