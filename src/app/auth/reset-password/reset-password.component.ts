import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
  token: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  showPassword = false;
  mensaje: string = '';
  error: string = '';

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) {
    this.token = this.route.snapshot.queryParamMap.get('token') || ''; // Obtener token del enlace
  }

  resetPassword() {
    if (!this.newPassword || this.newPassword !== this.confirmPassword) {
      this.error = 'Las contraseñas no coinciden o están vacías.';
      return;
    }

    this.http
      .post('https://clientes.ajaw.com.mx/api/reset_password.php', {
        token: this.token,
        newPassword: this.newPassword,
      })
      .subscribe({
        next: (response: any) => {
          this.mensaje = response.message;
          this.error = '';
          alert('Contraseña actualizada, inicia sesiòn para continuar')
          setTimeout(() => this.router.navigate(['/login']), 3000);
        },
        error: (err) => {
          this.error = err.error?.error || 'Error al restablecer la contraseña.';
          this.mensaje = '';
        },
      });
  }
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
