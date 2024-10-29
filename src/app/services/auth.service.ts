import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/usuarios';

  constructor(private http: HttpClient) {}

  login(email: string, pass: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, pass });
  }

  register(email: string, pass: string, codigo: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { email, pass, codigo });
  }
}
