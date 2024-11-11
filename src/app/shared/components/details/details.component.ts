import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent implements OnInit {
  trabajos: any[] = [];
  mesSeleccionado: number | null = null;
  meses = Array.from({ length: 12 }, (_, i) => i);
  trabajosOriginales: any[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    const fechaActual = new Date();
    this.mesSeleccionado = fechaActual.getMonth();

    this.apiService.fetchAllJobs().subscribe(data => {
      this.trabajosOriginales = data;
      this.filtrarTrabajosPorMes();
    });
  }

  filtrarTrabajosPorMes(): void {
    this.trabajos = this.trabajosPorMes(this.trabajosOriginales, this.mesSeleccionado);
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

    return data.filter(job => {
      const jobDate = new Date(job.dateCreated);
      return jobDate.getMonth() === mes;
    }).map(job => {
      const actualStart = new Date(job.actualStart);
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
        actualStart: actualStart.toLocaleDateString('es-ES', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        }),
        actualEnd: actualEnd?.toLocaleDateString() || "N/A",
        tiempoTrabajado,
      };
    });
  }
}
