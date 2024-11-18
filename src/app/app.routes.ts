import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { AdminComponent } from './dashboard/admin/admin.component';
import { ClientComponent } from './dashboard/client/client.component';
import { authGuard } from './services/auth.guard';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent},
    { path: 'admin', component: AdminComponent, canActivate: [authGuard], data: { role: 'admin' } },
    { path: 'client', component: ClientComponent, canActivate: [authGuard], data: { role: 'client' } },
    { path: '', redirectTo: '/login', pathMatch: 'full' }
];