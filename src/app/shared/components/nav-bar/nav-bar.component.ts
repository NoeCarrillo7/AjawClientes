import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CerrarSesionComponent } from '../cerrar-sesion/cerrar-sesion.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, CerrarSesionComponent],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent {
  showLogoutConfirm: boolean = false;

  constructor(private router: Router) {}

  openLogoutConfirm() {
    this.showLogoutConfirm = true;
  }

  confirmLogout() {
    this.showLogoutConfirm = false;
    sessionStorage.removeItem('isAuthenticated');
    this.router.navigate(['/login']);
    console.log('Sesión cerrada');
  }

  cancelLogout() {
    this.showLogoutConfirm = false;
  }
}
