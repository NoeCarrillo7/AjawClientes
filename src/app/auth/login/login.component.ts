import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  pass = '';
  recordarme = false;
  verPassword = false;

  constructor(private router: Router, private authService: AuthService) { }

  login() {
    this.authService.loginAuth(this.email, this.pass).subscribe(
      (response) => {
        const code = response.code;
        sessionStorage.setItem('isAuthenticated', 'true');
        sessionStorage.setItem('rol', code === 982647035 ? 'admin' : 'client');

        if (code === 982647035) {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/client']);
        }
      },
      (error) => {
        console.error('Error de autenticación:', error);
        alert('Credenciales incorrectas');
      }
    );
  }
  showPassword() {
    this.verPassword = !this.verPassword;
  }
}
