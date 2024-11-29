import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImagesService {

  constructor(
    private http: HttpClient
  ) { }

  uploadImage(image: File) {
    const formData = new FormData();

    formData.append('image', image);

    return this.http.post(`${environment.apiUrl}/image`, formData);
  }
  
  deleteImage(filename: string) {
    return this.http.delete(`${environment.apiUrl}/image/delete/${filename}`);
  }
}
