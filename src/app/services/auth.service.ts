import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://prueba.ajaw.com.mx/api';

  constructor(private http: HttpClient) {}

  loginAuth(email: string, pass: string): Observable<any> {
    if (!email.trim() || !pass.trim()) {
      return throwError(() => new Error('Los campos no pueden estar vacíos.'));
    }

    return this.http.post(`${this.apiUrl}/login.php`, { email, pass }).pipe(
      catchError((error) => {
        console.error('Error en loginAuth:', error);
        return throwError(() => new Error('Error en la autenticación.'));
      })
    );
  }

  registerAuth(email: string, pass: string, codigo: string): Observable<any> {
    if (!email.trim() || !pass.trim() || !codigo.trim()) {
      return throwError(() => new Error('Todos los campos son obligatorios.'));
    }

    return this.http.post(`${this.apiUrl}/register.php`, { email, pass, codigo }).pipe(
      catchError((error) => {
        console.error('Error en registerAuth:', error);
        return throwError(() => new Error('Error en el registro.'));
      })
    );
  }
}
