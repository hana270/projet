import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
})
export class AddProductComponent {
  productForm: FormGroup;
  imageFile?: File;
  image3DFile?: File;

  constructor(private fb: FormBuilder, private productService: ProductService) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      category: ['', Validators.required],
      description: [''],
    });
  }

  get nameControl() {
    return this.productForm.get('name');
  }



  onFileSelect(event: Event, type: 'image' | 'image3D') {
    const file = (event.target as HTMLInputElement).files?.[0];
    
    if (file) {
        if (type === 'image3D' && 
            !file.name.toLowerCase().endsWith('.glb') && 
            !file.name.toLowerCase().endsWith('.gltf')) {
            alert('Please select a valid 3D model file (.glb or .gltf)');
            return;
        }
        
        if (type === 'image') {
            this.imageFile = file;
        } else {
            this.image3DFile = file;
        }
    }
}




addProduct() {
  if (this.productForm.invalid) {
      this.markFormGroupTouched(this.productForm);
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
  }

  const formData = new FormData();

  // Log des données avant l'envoi
  console.log('Form values:', {
      name: this.productForm.get('name')?.value,
      category: this.productForm.get('category')?.value,
      description: this.productForm.get('description')?.value
  });
  console.log('Files:', {
      image: this.imageFile,
      image3D: this.image3DFile
  });

  formData.append('name', this.productForm.get('name')?.value || '');
  formData.append('category', this.productForm.get('category')?.value || '');
  formData.append('description', this.productForm.get('description')?.value || '');

  if (this.imageFile) {
      formData.append('image', this.imageFile, this.imageFile.name);
      console.log('Image added to FormData');
  }

  if (this.image3DFile) {
      formData.append('image3D', this.image3DFile, this.image3DFile.name);
      console.log('3D Image added to FormData');
  }

  // Vérification du contenu du FormData
  formData.forEach((value, key) => {
      console.log(`${key}:`, value);
  });

  this.productService.addProduct(formData).subscribe({
      next: (response) => {
          console.log('Success:', response);
          alert('Produit ajouté avec succès');
          this.productForm.reset();
          this.imageFile = undefined;
          this.image3DFile = undefined;
      },
      error: (error) => {
          console.error('Error details:', error);
          if (error.error instanceof ErrorEvent) {
              // Erreur côté client
              alert(`Une erreur est survenue : ${error.error.message}`);
          } else {
              // Erreur côté serveur
              alert(`Erreur ${error.status}: ${error.error}`);
          }
      }
  });
}

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}