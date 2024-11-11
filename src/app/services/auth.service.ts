import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://prueba.ajaw.com.mx/api';

  constructor(private http: HttpClient) {}

  login(email: string, pass: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login.php`, { email, pass });
  }

  register(email: string, pass: string, codigo: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register.php`, { email, pass, codigo });
  }
}
