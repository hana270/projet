// src/app/models/product.model.ts
export interface Product {
  id?: number;
  name: string;
  category: string;
  description: string;
  imagePath?: string; // Chemin de l'image normale
  image3DPath?: string; // Chemin de l'image 3D
}