import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatosGeneralesService } from '../../../dashboard/admin/datos-generales.service';
import { ChartOptions, ChartType, ChartData } from 'chart.js';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-charts',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  providers: [provideCharts(withDefaultRegisterables())],
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})
export class ChartsComponent implements OnInit {
  trabajosPorMes: number[] = [];
  horasPorMes: number[] = [];
  lugares: { [key: string]: number } = {};
  tiempoTrabajo: { fecha: Date, horasTrabajadas: number }[] = [];
  totalTrabajos: number = 0;
  totalHoras: number = 0;

  constructor(
    private apiService: ApiService,
    private datosGeneralesService: DatosGeneralesService,
  ) {}

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
    this.apiService.fetchAllJobs().subscribe(
      (data) => {
        const processedData = this.datosGeneralesService.DatosGenerales(data);
    
        this.trabajosPorMes = processedData.trabajosPorMes;
        this.horasPorMes = processedData.horasTrabajadasPorMes;
        this.lugares = processedData.lugares;
        this.tiempoTrabajo = processedData.tiempoPorTrabajo;

        const ultimos12Meses = this.getUltimos12Meses();
        const threshold = 5; // Define el umbral para agrupar valores pequeños
        this.lugares = this.groupSmallValues(this.lugares, threshold);

         // Calcular el total de trabajos y horas trabajadas
        this.totalTrabajos = this.trabajosPorMes.reduce((acc, cur) => acc + cur, 0);
        this.totalHoras = this.horasPorMes.reduce((acc, cur) => acc + cur, 0);
  
        // Asignar datos a las gráficas
        this.trabajosPorMesData = {
          ...this.trabajosPorMesData,
          labels: ultimos12Meses,
          datasets: [{ data: [...this.trabajosPorMes,], label: 'Número de trabajos' }]
        };
        this.horasPorMesData = {
          ...this.horasPorMesData,
          labels: ultimos12Meses,
          datasets: [{ data: [...this.horasPorMes,], label: 'Número de horas' }]
        };
  
        this.lugaresData = {
          ...this.lugaresData,
          labels: Object.keys(this.lugares),
          datasets: [{ data: Object.values(this.lugares), label: 'Lugares' }]
        };
  
        // Asignar los datos para la gráfica de tiempo por trabajo
        const trabajosLabels = this.tiempoTrabajo.slice(-20).map(trabajo => trabajo.fecha.toLocaleDateString());
        const trabajosData = this.tiempoTrabajo.slice(-20).map(trabajo => trabajo.horasTrabajadas);
  
        this.tiempoTrabajoData = {
          ...this.tiempoTrabajoData,
          labels: trabajosLabels,
          datasets: [{
            label: 'Horas Trabajadas',
            data: trabajosData,
            backgroundColor: 'rgba(153, 102, 255, 0.6)',
            borderColor: 'rgba(153, 102, 255, 1)',
          }]
        };
      },
      (error) => {
        console.error('Error al obtener los trabajos:', error);
      }
    );
  }
  
  // Función para agrupar valores pequeños en la categoría "Otros"
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

  getUltimos12Meses = () => {
    const meses = [
      'Enero', 'Febrero', 'Marzo', 'Abril',
      'Mayo', 'Junio', 'Julio', 'Agosto',
      'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    const hoy = new Date();
    let mesActual = hoy.getMonth();
    let ultimos12Meses = [];
  
    for (let i = 0; i < 12; i++) {
      ultimos12Meses.unshift(meses[mesActual]);
      mesActual = (mesActual - 1 + 12) % 12;
    }
    return ultimos12Meses;
  };
}


