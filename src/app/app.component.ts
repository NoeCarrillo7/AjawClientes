import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from "./auth/login/login.component";
import { RegisterComponent } from './auth/register/register.component';
import { AdminComponent } from './dashboard/admin/admin.component';
import { ClientComponent } from './dashboard/client/client.component';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from './shared/components/nav-bar/nav-bar.component';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HttpClientModule,
    CommonModule,
    NavBarComponent,
    LoginComponent,
    RegisterComponent,
    AdminComponent,
    ClientComponent,
  ],
  templateUrl: './app.component.html',
})

export class AppComponent {
  title = 'ajaw-A';
}
