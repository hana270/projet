import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import QRCode from 'qrcode';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  private baseUrl = 'http://localhost:8081/'; // URL de base du backend
  selectedProductId: number | null = null;
  qrCodeImageUrl: string | null = null;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        this.products = data;
        console.log('Loaded products:', this.products); // Vérifier les chemins d'images ici
      },
      error: (error) => {
        console.error('Error loading products', error);
      }
    });
  }

  getImageUrl(relativePath: string | undefined): string {
    if (!relativePath) {
        return 'assets/placeholder-image.png'; // Image par défaut
    }
    return `http://localhost:8081${relativePath}`;
  }

  deleteProduct(id: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.products = this.products.filter((product) => product.id !== id);
        },
        error: (error) => {
          console.error('Error deleting product', error);
        }
      });
    }
  }
  showQRCode(product: Product): void {
    // Vérifier si product.image3DPath est défini
    if (!product.image3DPath) {
      console.error('3D model path is undefined');
      return;
    }
  
    // URL pour Google Scene Viewer
    const arUrl = `https://arvr.google.com/scene-viewer/1.0?file=${encodeURIComponent(
      `http://localhost:8081${product.image3DPath}`
    )}&mode=ar_only`;
  
    // Générer le QR Code
    QRCode.toDataURL(arUrl, (err, url) => {
      if (err) {
        console.error('Error generating QR code', err);
        return;
      }
      this.qrCodeImageUrl = url;
    });
  }
}