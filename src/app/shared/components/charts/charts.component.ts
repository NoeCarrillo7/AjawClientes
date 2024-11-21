import { Component, Input, OnInit,OnChanges  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatosGeneralesService } from '../../../services/datos-generales.service';
import { ChartOptions, ChartType, ChartData } from 'chart.js';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';

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
  trabajosPorMes: number[] = [];
  horasPorMes: number[] = [];
  lugares: { [key: string]: number } = {};
  tiempoTrabajo: { fecha: Date, horasTrabajadas: number }[] = [];
  totalTrabajos: number = 0;
  totalHoras: number = 0;

  constructor(
    private datosGeneralesService: DatosGeneralesService,
  ) {}

  ngOnChanges() {
    if (this.datosCliente.length > 0) {
      this.processClientData(this.datosCliente);
    }
  }
  processClientData(datos: any[]) {
    console.log('Procesando datos del cliente:', datos);
    // Aquí reutiliza la lógica de datos que tienes en Admin
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
    
    if (this.jobs && this.jobs.length > 0) {
      processedData = this.datosGeneralesService.DatosGenerales(this.jobs);
      if (Object.keys(processedData.lugares).length > 10) this.lugares = this.groupSmallValues(processedData.lugares, 5);
      else this.lugares = processedData.lugares;
      
    } else if (this.datosCliente && this.datosCliente.length > 0) {
      processedData = this.datosGeneralesService.DatosGenerales(this.datosCliente);
      console.log(processedData);
      
      if (Object.keys(processedData.lugares).length > 8) this.lugares = this.groupSmallValues(processedData.lugares, 5);
      else this.lugares = processedData.lugares;
      
    } else {
      console.error('No se encontraron datos para procesar.');
      return;
    }

    this.trabajosPorMes = processedData.trabajosPorMes;
    this.horasPorMes = processedData.horasTrabajadasPorMes;
    this.tiempoTrabajo = processedData.tiempoPorTrabajo;

    const ultimos12Meses = this.getUltimos12Meses();

    // Asigna los datos a los gráficos
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

    // Calcula los totales
    this.totalTrabajos = this.trabajosPorMes.reduce((acc, cur) => acc + cur, 0);
    this.totalHoras = this.horasPorMes.reduce((acc, cur) => acc + cur, 0);
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


