import { Component, OnInit, Output, EventEmitter } from '@angular/core';
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
export class NavBarComponent implements OnInit {
  @Output() viewChange = new EventEmitter<string>();
  showLogoutConfirm: boolean = false;
  isAdmin: boolean = false;
  clientCode: string = '';
  clientName: string = '';

  constructor(private router: Router) {}

  ngOnInit() {
    this.checkUserRole();  
  }

  checkUserRole() {
    const code = sessionStorage.getItem('clientCode');
    const name = sessionStorage.getItem('clientName');

    if (code === '982647035') {  // Código del administrador
      this.isAdmin = true;
    } else if (code && name) {  // Si es cliente
      this.isAdmin = false;
      this.clientCode = code;
      this.clientName = name;
    } else {
      this.isAdmin = false;
    }
  }

  openLogoutConfirm() {
    this.showLogoutConfirm = true;
  }

  confirmLogout() {
    this.showLogoutConfirm = false;
    sessionStorage.removeItem('isAuthenticated');
    sessionStorage.removeItem('clientCode');
    sessionStorage.removeItem('clientName');
    this.router.navigate(['/login']);
  }

  cancelLogout() {
    this.showLogoutConfirm = false;
  }

  showGenerales() {
    this.viewChange.emit('generales');
  }

  showClientes() {
    this.viewChange.emit('clientes');
  }

  showGraficas() {
    this.viewChange.emit('graficas'); 
  }

  showDetalles() {
    this.viewChange.emit('detalles'); 
  }
}
