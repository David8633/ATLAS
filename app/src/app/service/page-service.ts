import { computed, signal, Signal } from '@angular/core';

export class PageService<T> {

  actualPage = signal(1); 
  itemsPerPage = signal(6);
  
  private dataSignal: Signal<T[]>;

  constructor(elementsSignal: Signal<T[]>) {
    this.dataSignal = elementsSignal;
  }

  countElements = computed(() => this.dataSignal().length);

  totalPage = computed(() => {
    return Math.ceil(this.countElements() / this.itemsPerPage()) || 1;
  });

  paginatedData = computed(() => {
    const start = (this.actualPage() - 1) * this.itemsPerPage();
    const end = start + this.itemsPerPage();
    return this.dataSignal().slice(start, end);
  });

  nextPage() {
    if (this.actualPage() < this.totalPage()) {
      this.actualPage.update(n => n + 1);
    }
  }

  comeBackPage() {
    if (this.actualPage() > 1) {
      this.actualPage.update(n => n - 1);
    }
  }
}