import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  email = '';
  mensaje = '';
  error = '';

  constructor(private http: HttpClient) {}

  enviarCorreo() {
    if (!this.email.trim()) {
      this.error = 'Por favor, ingresa un correo electrónico válido.';
      this.mensaje = ''; // Limpiar mensajes previos
      return;
    }
  
    // Enviar solicitud al backend
    this.http.post('https://clientes.ajaw.com.mx/api/recover_password.php', { email: this.email }).subscribe({
      next: (response: any) => {
        if (response.error) {
          this.error = 'El correo no está registrado.';
          this.mensaje = '';
        } else {
          this.mensaje = response.message || 'Correo enviado exitosamente.';
          this.error = '';
        }
      },
      error: (err) => {
        this.error = err.error?.error || 'No se pudo procesar la solicitud. Inténtalo nuevamente.';
        this.mensaje = ''; 
      }
    });
  }
  
}
