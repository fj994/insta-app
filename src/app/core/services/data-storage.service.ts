import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { authService } from '../auth/auth.service';
import { take, exhaustMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {
  apiPath: string = environment.apiPath;

  constructor(private http: HttpClient, private authService: authService) { }

  getProfile() {
    
    return this.http.get(`${this.apiPath}profile/${this.authService.user.value.id}`);
  }

  uploadPost(image: File, id: string) {
    console.log(image);
    
    let uploadData = new FormData();
    uploadData.append('file', image);
    console.log(uploadData);
    
    return this.http.post(`${this.apiPath}post/upload/${id}`, uploadData);
  }

  
}
