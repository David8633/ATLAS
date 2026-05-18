import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-loading',
  imports: [],
  templateUrl: './loading.html',
  styleUrl: './loading.css',
})
export class Loading {
visible = signal(true);

  constructor() {
    setTimeout(() => {
      this.visible.set(false);
    }, 800);
  }
}
