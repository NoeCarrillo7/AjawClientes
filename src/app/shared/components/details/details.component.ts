import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  @Input() jobs: any[] = [];  // Recibe los trabajos
  @Input() datosCliente: any[] = [];
  trabajos: any[] = [];
  mesSeleccionado: number | null = null;
  meses = Array.from({ length: 12 }, (_, i) => i);
  trabajosOriginales: any[] = [];
  paginaActual: number = 1;
  itemsPorPagina: number = 6;
  totalPaginas: number = 1;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    if(this.jobs && this.jobs.length > 0)
      this.trabajosOriginales = this.jobs;
    else
      this.trabajosOriginales = this.datosCliente;

    const fechaActual = new Date();
    this.mesSeleccionado = fechaActual.getMonth();
    this.filtrarTrabajosPorMes();
  }

  filtrarTrabajosPorMes(): void {
    const trabajosFiltrados = this.trabajosPorMes(this.trabajosOriginales, this.mesSeleccionado);
    this.totalPaginas = Math.ceil(trabajosFiltrados.length / this.itemsPorPagina);
    this.actualizarTrabajosPaginados(trabajosFiltrados);
  }

  actualizarTrabajosPaginados(trabajosFiltrados: any[]): void {
    const startIndex = (this.paginaActual - 1) * this.itemsPorPagina;
    const endIndex = startIndex + this.itemsPorPagina;
    this.trabajos = trabajosFiltrados.slice(startIndex, endIndex);
  }

  cambioPagina(page: number): void {
    this.paginaActual = page;
    this.filtrarTrabajosPorMes();
  }

  paginasVisibles(): number[] {
    const maxVisiblePages = 4;
    const pages: number[] = [];

    if (this.totalPaginas <= maxVisiblePages) {
        for (let i = 1; i <= this.totalPaginas; i++) pages.push(i);
    } else {
        const start = Math.max(1, this.paginaActual - Math.floor(maxVisiblePages / 2));
        const end = Math.min(this.totalPaginas, start + maxVisiblePages - 1);

        if (end === this.totalPaginas) {
            for (let i = this.totalPaginas - maxVisiblePages + 1; i <= this.totalPaginas; i++) pages.push(i);
        } else if (start === 1) {
            for (let i = 1; i <= maxVisiblePages; i++) pages.push(i);
        } else {
            for (let i = start; i <= end; i++) pages.push(i);
        }
    }
    return pages;
  }

  nombreMes(month: number): string {
    const date = new Date(0, month);
    const monthName = date.toLocaleString('es-ES', { month: 'long' });
    return monthName.charAt(0).toUpperCase() + monthName.slice(1);
  }

  onMesChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.mesSeleccionado = +selectElement.value;
    this.filtrarTrabajosPorMes();
  }

  tiempoTrabajo(start: Date, end: Date): string {
    const diff = end.getTime() - start.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
  }

  trabajosPorMes(data: any[], mes: number | null): any[] {
    if (mes === null) return [];

    return data
      .filter(job => {
        const jobDate = new Date(job.dateCreated);
        return jobDate.getMonth() === mes;
      })
      .map(job => {
        const actualStart = new Date(job.actualStart);
        const dateCreated = new Date(job.dateCreated);
        const actualEnd = job.actualEnd ? new Date(job.actualEnd) : null;
        const tiempoTrabajado = actualEnd
          ? this.tiempoTrabajo(actualStart, actualEnd)
          : "N/A";

        return {
          type: job.type?.name,
          description: job.description,
          addressCity: job.addressCity,
          equipmentName: job.equipment?.name,
          technicianName: job.technician?.name,
          sitio: job.site?.name,
          dateCreated: dateCreated.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          }),
          actualEnd: actualEnd?.toLocaleDateString() || "N/A",
          tiempoTrabajado,
          actualStartDate: actualStart
        };
      })
      .sort((a, b) => b.actualStartDate.getTime() - a.actualStartDate.getTime());
  }
}
