import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LodgingService } from '../../service/lodging-service';
import { CardLodgingComponent } from '../../components/card-lodging/card-lodging';
import { AdminService } from '../../service/admin-service';
import { LodgingsType } from '../../types/types';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CardLodgingComponent],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit {
  lodgingService = inject(LodgingService);

  private adminService = inject(AdminService);
  private router = inject(Router);


  ngOnInit() {
    this.lodgingService.loadLodgingsPage(0, 3);
    
  }

  onDelete(lodging: LodgingsType) {

    Swal.fire({
      title: '¿Estás seguro?',
      text: `Vas a eliminar "${lodging.name}". Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6'
    }).then((result) => {

      if (result.isConfirmed) {

        this.adminService.deleteLodging(lodging.id).subscribe({
          next: () => {
            Swal.fire({
              title: 'Eliminado',
              text: 'El alojamiento ha sido eliminado correctamente.',
              icon: 'success',
              timer: 1500,
              showConfirmButton: false
            });

            // Recargar lista
            this.lodgingService.loadLodgingsPage(0, 3);
          },
          error: (err) => {
            console.error("ERROR DEL BACKEND:", err);

            Swal.fire({
              title: 'Error',
              text: 'No se pudo eliminar el alojamiento (401: token inválido o no enviado).',
              icon: 'error'
            });
          }
        });

      }

    });

  }
  
  onEdit(lodging: LodgingsType) {
    this.router.navigateByUrl("/edit/lodging/" + lodging.id);
  }

}