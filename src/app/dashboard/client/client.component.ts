import { Component, OnInit,EventEmitter,Output  } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from "../../shared/components/nav-bar/nav-bar.component";
import { ChartsComponent } from "../../shared/components/charts/charts.component";
import { DetailsComponent } from '../../shared/components/details/details.component';
import { CerrarSesionComponent } from '../../shared/components/cerrar-sesion/cerrar-sesion.component';;


@Component({
  selector: 'app-client',
  standalone: true,
  imports: [CommonModule, ChartsComponent, DetailsComponent,CerrarSesionComponent,NavBarComponent],
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {
  @Output() clientDataEvent = new EventEmitter<any[]>(); 
  jobs: any[] = [];
  datosCliente: any[] = [];
  cargando: boolean = true;
  clientCode: string = '';
  showLogoutConfirm: boolean = false;

  vistaSeleccionada: string = 'graficas';

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    this.clientCode = sessionStorage.getItem('clientCode') || '';

    this.cargando = true;
    this.apiService.fetchAllJobs().subscribe(
      (data) => {
        this.jobs = data;
        this.onClientSelected(+this.clientCode);
        this.cargando = false;
        
      const clientName = this.datosCliente.length > 0 ? this.datosCliente[0].customer.name : '';
      sessionStorage.setItem('clientName', clientName);  
      },
      (error) => {
        console.error('Error al obtener los trabajos:', error);
        this.cargando = false;
      }
    );

    history.pushState(null, '', location.href);
    window.onpopstate = () => {
      history.pushState(null, '', location.href);
    };
  }

  
  onClientSelected(clientID: number) {
    this.datosCliente = this.jobs.filter(
      (job) => job.customer.id === clientID
    );
    this.clientDataEvent.emit(this.datosCliente);
  }
  

  openLogoutConfirm() {
    this.showLogoutConfirm = true;
  }

  confirmLogout() {
    this.showLogoutConfirm = false;
    sessionStorage.removeItem('isAuthenticated');
    this.router.navigate(['/login']);
  }  

  cancelLogout() {
    this.showLogoutConfirm = false;
  }
  cambiarVista(vista: string) {
    this.vistaSeleccionada = vista;
  }

  
}
