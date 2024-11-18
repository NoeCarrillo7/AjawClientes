import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent implements OnInit {
  @Input() clients: any[] = [];
  @Output() clienteSeleccionado = new EventEmitter<number>();
  @Output() datosCliente = new EventEmitter<any>();
  
  clientesUnicos: any[] = [];
  clientesFiltrados: any[] = [];
  terminoBusqueda: string = '';
  paginaActual: number = 1;
  itemsPorPagina: number = 12;

  ngOnInit(): void {
    this.eliminarDuplicados();
    this.clientesFiltrados = this.clientesUnicos;
  }

  seleccionarCliente(clienteId: number): void {
    this.clienteSeleccionado.emit(clienteId);
  }

  eliminarDuplicados(): void {
    const idsUnicos = new Set();
  
    this.clients.sort((a, b) => {
      const fechaA = new Date(a.dateCreated).getTime();
      const fechaB = new Date(b.dateCreated).getTime();
      return fechaB - fechaA;
    });
  
    this.clientesUnicos = this.clients.filter(clients => {
      const esDuplicado = idsUnicos.has(clients.customer.id);
      idsUnicos.add(clients.customer.id);
      return !esDuplicado;
    });
  
    this.clientesFiltrados = [...this.clientesUnicos];
  }

  filtrarClientes(): void {
    if (this.terminoBusqueda.trim() === '') {
      this.clientesFiltrados = [...this.clientesUnicos];
    } else {
      this.clientesFiltrados = this.clientesUnicos.filter(cliente =>
        cliente.customer.name.toLowerCase().includes(this.terminoBusqueda.toLowerCase())
      );
    }
    this.paginaActual = 1;
  }

  get clientesPaginados(): any[] {
    const indiceInicio = (this.paginaActual - 1) * this.itemsPorPagina;
    return this.clientesFiltrados.slice(indiceInicio, indiceInicio + this.itemsPorPagina);
  }

  cambiarPagina(pagina: number): void {
    this.paginaActual = pagina;
  }

  get totalPaginas(): number {
    return Math.ceil(this.clientesFiltrados.length / this.itemsPorPagina);
  }

  rangoResultados(): string {
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina + 1;
    const fin = Math.min(this.paginaActual * this.itemsPorPagina, this.clientesFiltrados.length);
    return `${inicio} - ${fin}`;
  }
}