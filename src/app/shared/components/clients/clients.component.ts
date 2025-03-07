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
  @Output() clientSelected = new EventEmitter<number>();
  @Output() clientData = new EventEmitter<any>();
  
  uniqueClients: any[] = [];
  filteredClients: any[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 12;

  ngOnInit(): void {
    this.removeDuplicates();
    this.filteredClients = this.uniqueClients;
  }

  seleccionarCliente(clientId: number): void {
    this.clientSelected.emit(clientId);
  }

  removeDuplicates(): void {
    const uniqueIds = new Set();
  
    this.clients.sort((a, b) => {
      const dateA = new Date(a.dateCreated).getTime();
      const dateB = new Date(b.dateCreated).getTime();
      return dateB - dateA;
    });
  
    this.uniqueClients = this.clients.filter(client => {
      if (!client.customer || !client.customer.id) {
        return false;
      }
      const isDuplicate = uniqueIds.has(client.customer.id);
      uniqueIds.add(client.customer.id);
      return !isDuplicate;
    });
  
    this.filteredClients = [...this.uniqueClients];
  }
  

  filtrarClientes(): void {
    if (this.searchTerm.trim() === '') {
      this.filteredClients = [...this.uniqueClients];
    } else {
      this.filteredClients = this.uniqueClients.filter(client =>
        client.customer.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
    this.currentPage = 1;
  }

  get paginatedClients(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredClients.slice(startIndex, startIndex + this.itemsPerPage);
  }

  cambiarPagina(page: number): void {
    this.currentPage = page;
  }

  get totalPages(): number {
    return Math.ceil(this.filteredClients.length / this.itemsPerPage);
  }

  rangoResultados(): string {
    const start = (this.currentPage - 1) * this.itemsPerPage + 1;
    const end = Math.min(this.currentPage * this.itemsPerPage, this.filteredClients.length);
    return `${start} - ${end}`;
  }
}
