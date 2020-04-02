import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { authService } from './auth.service';
import { take, exhaustMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {
  apiPath: string = environment.apiPath;

  constructor(private http: HttpClient, private authService: authService) { }

  getProfile() {
    return this.http.get(this.apiPath);
    // this.authService.user.pipe(take(1), exhaustMap(user => {
    //   return this.http.get(this.apiPath);
    // }))
  }
}
