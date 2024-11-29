import { Component, OnInit,HostListener  } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from "../../shared/components/nav-bar/nav-bar.component";
import { ChartsComponent } from "../../shared/components/charts/charts.component";
import { DetailsComponent } from '../../shared/components/details/details.component';
import { ClientsComponent } from "../../shared/components/clients/clients.component";

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, NavBarComponent, ChartsComponent, DetailsComponent, ClientsComponent],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  jobs: any[] = [];
  datosCliente: any[] = [];
  clienteFiltrado: any = null;
  selectedClientId: number | null = null;
  datosProcesados: any = null;
  cargando: boolean = true;
  showLogoutConfirm: boolean = false;
  currentView: string = 'generales';
  isSmallScreen: boolean = false; 

  constructor(
    private apiService: ApiService,
  ) {}

  ngOnInit() {
    this.cargando = true;
    this.checkScreenSize();
    this.apiService.fetchAllJobs().subscribe(
      (data) => {
        this.jobs = data;
        this.cargando = false;
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

  onViewChange(view: string) {
    this.currentView = view;
  }

  onClientSelected(clientID: number) {
    this.datosCliente = this.jobs.filter(job => job.customer.id === clientID);
    if (this.datosCliente && this.datosCliente.length > 0) this.currentView = 'client';
  }
  // Detecta cambios en el tamaño de la ventana
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }

  // Evalúa el tamaño de la pantalla
  checkScreenSize() {
    this.isSmallScreen = window.innerWidth <= 1024; 
  }
  
}