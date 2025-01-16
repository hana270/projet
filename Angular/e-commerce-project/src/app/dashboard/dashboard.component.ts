import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
  showMessagesList: boolean = false;

  showMessages() {
    this.showMessagesList = !this.showMessagesList;
  }
}
