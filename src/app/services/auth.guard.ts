import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class authGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const isAuthenticated = sessionStorage.getItem('isAuthenticated') === 'true';
    const rol = sessionStorage.getItem('rol');

    if (!isAuthenticated) {
      this.router.navigate(['/login']);
      return false;
    }

    const rolEsperado = route.data['rol'];

    if (rolEsperado && rol !== rolEsperado) {
      alert('No tienes acceso a esta ruta.');
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}
