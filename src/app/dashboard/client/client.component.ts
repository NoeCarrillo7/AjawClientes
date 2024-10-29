import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from "../../shared/components/nav-bar/nav-bar.component";

@Component({
  selector: 'app-client',
  standalone: true,
  imports: [CommonModule, NavBarComponent],
  templateUrl: './client.component.html',
  styleUrl: './client.component.css'
})
export class ClientComponent implements OnInit{
  jobs: any[] = [];
  isLoading: boolean = true;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.isLoading = true;
    this.apiService.fetchAllJobs().subscribe(
      (data) => {
        this.jobs = data;
        this.isLoading = false;
        console.log(data);
      },
      (error) => {
        console.error('Error al obtener los trabajos:', error);
        this.isLoading = false;
      }
    );
  }
}
