import { Component, Input, OnInit,OnChanges  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartOptions, ChartType, ChartData } from 'chart.js';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { DatosGeneralesService } from '../../../services/datos-generales.service';

@Component({
  selector: 'app-charts',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  providers: [provideCharts(withDefaultRegisterables())],
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})
export class ChartsComponent implements OnChanges  {
  @Input() jobs: any[] = [];
  @Input() datosCliente: any[] = [];
  mesActualActivo: boolean = false;
  trabajosPorMesOriginal: number[] = [];
  horasPorMesOriginal: number[] = [];
  lugaresOriginal: { [key: string]: number } = {};
  tiempoTrabajoOriginal: { fecha: Date, horasTrabajadas: number }[] = [];
  
  trabajosPorMes: number[] = [];
  horasPorMes: number[] = [];
  lugares: { [key: string]: number } = {};
  tiempoTrabajo: { fecha: Date, horasTrabajadas: number }[] = [];
  totalTrabajos: number = 0;
  totalHoras: number = 0;

  totalTrabajosOriginal: number = 0;
  totalHorasOriginal: number = 0;


  constructor(
    private datosGeneralesService: DatosGeneralesService,
  ) {}

  ngOnChanges() {
    if (this.datosCliente.length > 0) {
      this.processClientData(this.datosCliente);
      this.sortTiempoTrabajoPorFecha();
      this.updateChartData();
    }
  }
  
  processClientData(datos: any[]) {
    console.log('Procesando datos del cliente:', datos);
  }

  // Opciones para cada gráfico
  trabajosPorMesOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };
  
  horasPorMesOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };
  lugaresOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    }
  };
  tiempoTrabajoOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  // Configuración para trabajosPorMes (Barras)
  trabajosPorMesLabels: string[] = [];
  trabajosPorMesType: ChartType = 'bar';
  trabajosPorMesData: ChartData<'bar'> = {
    labels: this.trabajosPorMesLabels,
    datasets: [{ data: [], label: 'Número de trabajos' }]
  };

  // Configuración para horasPorMes (Líneas)
  horasPorMesLabels: string[] = [];
  horasPorMesType: ChartType = 'line';
  horasPorMesData: ChartData<'line'> = {
    labels: this.horasPorMesLabels,
    datasets: [{ data: [], label: 'Número de horas' }]
  };

  // Configuración para lugares (Pastel)
  lugaresLabels: string[] = [];
  lugaresType: ChartType = 'pie';
  lugaresData: ChartData<'pie'> = {
    labels: this.lugaresLabels,
    datasets: [{ data: [], label: 'Lugares' }]
  };

  // Configuración para tiempo por trabajo (Barras)
  tiempoTrabajoLabels: string[] = [];
  tiempoTrabajoType: ChartType = 'bar';
  tiempoTrabajoData: ChartData<'bar'> = {
    labels: this.tiempoTrabajoLabels,
    datasets: [{
      data: [], label: 'Horas Trabajadas',
      backgroundColor: 'rgba(153, 102, 255, 0.6)',
      borderColor: 'rgba(153, 102, 255, 1)',
    }]
  };

  ngOnInit(): void {
    let processedData: any;
  
    // Determina si usar datos generales o de cliente
    if (this.jobs && this.jobs.length > 0) {
      processedData = this.datosGeneralesService.DatosGenerales(this.jobs);
      this.lugares = this.processLugares(processedData.lugares, 10);
    } else if (this.datosCliente && this.datosCliente.length > 0) {
      processedData = this.datosGeneralesService.DatosGenerales(this.datosCliente);
      this.lugares = this.processLugares(processedData.lugares, 8);
    } else {
      console.error('No se encontraron datos para procesar.');
      return;
    }
  
    this.trabajosPorMes = processedData.trabajosPorMes;
    this.horasPorMes = processedData.horasTrabajadasPorMes;
    this.tiempoTrabajo = processedData.tiempoPorTrabajo;

    this.sortTiempoTrabajoPorFecha();
  
    const ultimos12Meses = this.getUltimos12Meses();
  
    // Asigna datos a las gráficas
    this.trabajosPorMesData = {
      labels: ultimos12Meses,
      datasets: [{ data: this.trabajosPorMes, label: 'Número de trabajos' }]
    };
  
    this.horasPorMesData = {
      labels: ultimos12Meses,
      datasets: [{ data: this.horasPorMes, label: 'Número de horas' }]
    };
  
    this.lugaresData = {
      labels: Object.keys(this.lugares),
      datasets: [{ data: Object.values(this.lugares), label: 'Lugares' }]
    };
  
    const trabajosLabels = this.tiempoTrabajo.slice(-20).map(trabajo => trabajo.fecha.toLocaleDateString());
    const trabajosData = this.tiempoTrabajo.slice(-20).map(trabajo => trabajo.horasTrabajadas);
  
    this.tiempoTrabajoData = {
      labels: trabajosLabels,
      datasets: [{
        label: 'Horas Trabajadas',
        data: trabajosData,
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
      }]
    };
  
    // Calcula totales
    this.totalTrabajos = this.trabajosPorMes.reduce((acc, cur) => acc + cur, 0);
    this.totalHoras = this.horasPorMes.reduce((acc, cur) => acc + cur, 0);
  }

  sortTiempoTrabajoPorFecha() {
    this.tiempoTrabajo.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
  }  
  
  processLugares(lugares: { [key: string]: number }, maxItems: number): { [key: string]: number } {
    if (Object.keys(lugares).length > maxItems) {
      return this.groupSmallValues(lugares, 5);
    }
    return lugares;
  }
  
  // Agrupa valores pequeños en "Otros"
  groupSmallValues(data: { [key: string]: number }, threshold: number): { [key: string]: number } {
    const groupedData: { [key: string]: number } = {};
    let othersTotal = 0;
    Object.entries(data).forEach(([key, value]) => {
      if (value < threshold) othersTotal += value;
      else groupedData[key] = value;
    });
    if (othersTotal > 0) groupedData['Otros'] = othersTotal;
    return groupedData;
  }
  
  getUltimos12Meses(): string[] {
    const meses = [
      'Enero', 'Febrero', 'Marzo', 'Abril',
      'Mayo', 'Junio', 'Julio', 'Agosto',
      'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    const hoy = new Date();
    let mesActual = hoy.getMonth();
    const ultimos12Meses = [];
  
    for (let i = 0; i < 12; i++) {
      ultimos12Meses.unshift(meses[mesActual]);
      mesActual = (mesActual - 1 + 12) % 12;
    }
    return ultimos12Meses;
  }
  
  getSemanasDelMesActual() {
    const semanas = ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'];
    const hoy = new Date();
    const mesActual = hoy.getMonth();
    const añoActual = hoy.getFullYear();
  
    const trabajosPorSemana = Array(5).fill(0);
    const horasPorSemana = Array(4).fill(0);
  
    const datos = this.datosCliente.length > 0 ? this.datosCliente : this.jobs;
  
    datos.forEach(job => {
      const fechaTrabajo = new Date(job.dateCreated);
      const actualStart = new Date(job.actualStart);
      const actualEnd = job.actualEnd ? new Date(job.actualEnd) : null;
  
      if (fechaTrabajo.getMonth() === mesActual && fechaTrabajo.getFullYear() === añoActual) {
        const diaDelMes = fechaTrabajo.getDate();
        const semana = Math.floor((diaDelMes - 1) / 7);
  
        trabajosPorSemana[semana]++;
        if (actualEnd) {
          const horasTrabajadas = (actualEnd.getTime() - actualStart.getTime()) / (1000 * 60 * 60);
          horasPorSemana[semana] += horasTrabajadas;
        }
      }
    });
  
    return { semanas, trabajosPorSemana, horasPorSemana };
  }
  
  toggleMesActual() {
    this.mesActualActivo = !this.mesActualActivo;
  
    if (this.mesActualActivo) {
      const { semanas, trabajosPorSemana, horasPorSemana } = this.getSemanasDelMesActual();
  
      this.trabajosPorMesOriginal = [...this.trabajosPorMes];
      this.horasPorMesOriginal = [...this.horasPorMes];
      this.totalTrabajosOriginal = this.totalTrabajos;
      
      this.totalHorasOriginal = this.totalHoras;
  
      this.trabajosPorMes = trabajosPorSemana;
      this.horasPorMes = horasPorSemana;
  
      this.trabajosPorMesLabels = semanas;
      this.horasPorMesLabels = semanas;
      console.log(this.trabajosPorMes);
      
  
      this.totalTrabajos = this.trabajosPorMes.reduce((acc, cur) => acc + cur, 0);
      this.totalHoras = this.horasPorMes.reduce((acc, cur) => acc + cur, 0);
    } else {
      this.trabajosPorMes = [...this.trabajosPorMesOriginal];
      this.horasPorMes = [...this.horasPorMesOriginal];
      this.totalTrabajos = this.totalTrabajosOriginal;
      this.totalHoras = this.totalHorasOriginal;
  
      this.trabajosPorMesLabels = this.getUltimos12Meses();
      this.horasPorMesLabels = this.getUltimos12Meses();
    }
    this.updateChartData();
  }
  
  
  
  updateChartData() {
    const trabajosLabels = this.tiempoTrabajo.slice(-20).map(trabajo => trabajo.fecha.toLocaleDateString());
    const trabajosData = this.tiempoTrabajo.slice(-20).map(trabajo => trabajo.horasTrabajadas);
  
    this.tiempoTrabajoData = {
      labels: trabajosLabels,
      datasets: [{
        label: 'Horas Trabajadas',
        data: trabajosData,
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
      }]
    };

    this.trabajosPorMesData = {
      labels: this.trabajosPorMesLabels,
      datasets: [{ data: this.trabajosPorMes, label: 'Número de trabajos' }],
    };
  
    this.horasPorMesData = {
      labels: this.horasPorMesLabels,
      datasets: [{ data: this.horasPorMes, label: 'Número de horas' }],
    };
  }
  
  
  
}


