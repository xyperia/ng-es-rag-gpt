import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UserModel } from 'src/app/models';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private http: HttpClient) { }

  getById(id: string) {
    return this.http.get<UserModel>(`${environment.apiUrl}/user/${id}`);
  }
}
