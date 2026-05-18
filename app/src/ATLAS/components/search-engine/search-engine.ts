import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-search-engine',
  standalone: true,
  imports: [FormsModule],
  templateUrl: 'search-engine.html',
  styleUrls: ['search-engine.css']
})
export class SearchEngine {

  // Inputs → signals internos
  @Input() set destination(value: string | null) { this._destination.set(value || ''); }
  @Input() set type(value: string | null) { this._type.set(value || ''); }
  @Input() set checkin(value: string | null) { this._checkin.set(value || ''); }
  @Input() set checkout(value: string | null) { this._checkout.set(value || ''); }
  @Input() set count(value: string | null) { this._count.set(value || ''); }

  // Signals internos
  _destination = signal('');
  _type = signal('');
  _checkin = signal('');
  _checkout = signal('');
  _count = signal('');

  // Outputs → permiten null
  @Output() destinationChange = new EventEmitter<string | null>();
  @Output() typeChange = new EventEmitter<string | null>();
  @Output() checkinChange = new EventEmitter<string | null>();
  @Output() checkoutChange = new EventEmitter<string | null>();
  @Output() personChange = new EventEmitter<string | null>();

  tipos = ['Hotel', 'Hostal', 'ApartHotel', 'Albergue', 'Resort', 'Posada'];

  // DESTINO
  onDestinationChange(value: string) {
    this._destination.set(value);
    this.destinationChange.emit(value || null);
  }

  // TIPO
  onTypeChange(value: string) {
    this._type.set(value);
    this.typeChange.emit(value || null);
  }

  // CHECK-IN
  onCheckinChange(value: string) {
    this._checkin.set(value);

    if (this._checkout() && value > this._checkout()) {
      Swal.fire({
        icon: 'error',
        title: 'Fecha inválida',
        text: 'La fecha de entrada no puede ser posterior a la fecha de salida.',
        confirmButtonColor: '#142343'
      });

      this._checkin.set('');
      this.checkinChange.emit(null);
      return;
    }

    this.checkinChange.emit(value || null);
  }

  // CHECK-OUT
  onCheckoutChange(value: string) {
    this._checkout.set(value);

    if (this._checkin() && this._checkin() > value) {
      Swal.fire({
        icon: 'error',
        title: 'Fecha inválida',
        text: 'La fecha de salida no puede ser anterior a la fecha de entrada.',
        confirmButtonColor: '#142343'
      });

      this._checkout.set('');
      this.checkoutChange.emit(null);
      return;
    }

    this.checkoutChange.emit(value || null);
  }

  // PERSONAS
  onPersonChange(value: string) {
    this._count.set(value);
    this.personChange.emit(value || null);
  }
}
