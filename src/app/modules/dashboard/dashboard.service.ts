import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  Url = environment.apiUrl;
  constructor(private http: HttpClient) { }

  getCovidData() {
    return this.http.get<any>(`https://raw.githubusercontent.com/xyperia/covid-api-indonesia/main/api/covid-id.json`);
  }

  sendMessage(message: string): EventSource {
    const url = `${environment.ragUrl}/chat?question=${encodeURIComponent(message)}`;
    return new EventSource(url);
  }
}
