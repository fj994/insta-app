import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  apiPath: string = environment.apiPath;

  constructor(private http: HttpClient) { }

  signUpPost(newUser) {
    this.http.post(`${this.apiPath}users`, newUser, { responseType: 'text' }).subscribe(
      response => {
        console.log(response);
      }
    )
  }

  loginPost(user) {
    return this.http.post(`${this.apiPath}login`, user);
  }
}
