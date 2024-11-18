import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  email = '';
  pass = '';
  pass_verify = '';
  codigo = '';
  verPassword = false;
  verPassConfirm = false;
  verCodigo = false;

  constructor(private router: Router, private authService: AuthService) {}

  register() {
    if (this.pass !== this.pass_verify) {
      alert('Las contraseñas no coinciden');
      return;
    }

    this.authService.registerAuth(this.email, this.pass, this.codigo).subscribe(
      (response) => {
        console.log('Respuesta del registro:', response);

        sessionStorage.setItem('isAuthenticated', 'true');
        const rol = parseInt(this.codigo, 10) === 982647035 ? 'admin' : 'client';
        sessionStorage.setItem('rol', rol);

        if (rol === 'admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/client']);
        }
      },
      (error) => {
        console.error('Error al registrar:', error);
        alert('Error al registrar el usuario');
      }
    );
  }

  showPassword() {
    this.verPassword = !this.verPassword;
  }

  showPasswordConfirm() {
    this.verPassConfirm = !this.verPassConfirm;
  }

  showCodigo() {
    this.verCodigo = !this.verCodigo;
  }
}
