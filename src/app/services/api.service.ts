import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly apiUrl = 'https://servidorapi.ajaw.com.mx/api.php?endpoint=/Api/v3/job/list';

  constructor(private http: HttpClient) {}

  fetchAllJobs(pageSize: number = 100): Observable<any[]> {
    const initialUrl = `${this.apiUrl}&page=1&pageSize=1`;

    return this.http.get<any>(initialUrl).pipe(
      switchMap(responseTotal => {
        const totalRecords = responseTotal.recordsTotal;  // Número total de registros
        const totalPages = Math.ceil(totalRecords / pageSize);  // Calcular total de páginas

        const requests = [];
        for (let page = 1; page <= totalPages; page++) {
          const pageUrl = `${this.apiUrl}&page=${page}&pageSize=${pageSize}`;
          requests.push(this.http.get<any>(pageUrl));
        }

        return forkJoin(requests).pipe(
          map(responses => {
            const allData = responses.reduce((acc, response) => acc.concat(response.data), []);
            console.log('Datos obtenidos:', allData);
            
            return allData;
          })
        );
      }),
      catchError(error => {
        console.error('Error al obtener datos de la API', error);
        return throwError(() => error);
      })
    );
  }
}
