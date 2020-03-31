import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  apiPath: string = environment.apiPath;

  constructor(private http: HttpClient, private router: Router) { }

  signUpPost(newUser) {
    this.http.post(`${this.apiPath}users`, newUser).subscribe(
      (response: { message, error }) => {
        alert(response.message);
        if (!response.error) {
          this.router.navigate(['/login']);
        }
      }
    )
  }

  loginPost(user) {
    return this.http.post(`${this.apiPath}login`, user);
  }
}
