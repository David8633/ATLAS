import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { UserType } from '../types/types';


@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/users`;

  isLoading = signal(false);
  private usersSignal = signal<UserType[]>([]);

  allUsers = this.usersSignal.asReadonly();
  totalUsers = computed(() => this.usersSignal().length);

  loadAllUsers() {
    this.isLoading.set(true);
    this.http.get<UserType[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.usersSignal.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading users:', err);
        this.isLoading.set(false);
      }
    });
  }

  deleteUser(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  updateRole(id: number, role: string) {
    return this.http.patch<UserType>(`${this.apiUrl}/${id}/rol?rol=${role}`, {});
  }
}