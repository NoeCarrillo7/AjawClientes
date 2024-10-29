import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, forkJoin } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly apiUrl = '/api/job/list';

  private readonly domain = 'ajaw';
  private readonly apiKey = '2c1a38fc-3170-4c33-9b78-a4ef92b4c730';
  private readonly headers = new HttpHeaders({
    'Authorization': `Basic ${btoa(`${this.domain}:${this.apiKey}`)}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  });

  constructor(private http: HttpClient) {}

  fetchAllJobs(pageSize: number = 100): Observable<any[]> {
    const initialUrl = `${this.apiUrl}?page=1&pageSize=1`;

    return this.http.get<any>(initialUrl, { headers: this.headers }).pipe(
      switchMap(responseTotal => {
        const totalRecords = responseTotal.recordsTotal;
        const totalPages = Math.ceil(totalRecords / pageSize);

        const requests = [];
        for (let page = 1; page <= totalPages; page++) {
          const pageUrl = `${this.apiUrl}?page=${page}&pageSize=${pageSize}`;
          requests.push(this.http.get<any>(pageUrl, { headers: this.headers }));
        }

        return forkJoin(requests).pipe(
          map(responses => {
            const allData = responses.reduce((acc, response) => {
              return acc.concat(response.data);
            }, []);
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
