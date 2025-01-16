import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-ar-viewer',
  templateUrl: './ar-viewer.component.html',
})
export class ArViewerComponent implements OnInit {
  modelUrl: string | null = null; // URL du modèle 3D

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Récupérer le paramètre 'model' de l'URL
    this.route.queryParams.subscribe(params => {
      this.modelUrl = params['model'];
      console.log('Model URL:', this.modelUrl); // Vérifier l'URL du modèle
    });
  }
}