import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class authService {
  apiPath: string = environment.apiPath;
  user: User;

  constructor(private http: HttpClient, private router: Router, private jwt: JwtHelperService) { }

  signup(newUser) {
    return this.http.post(`${this.apiPath}users`, newUser).pipe(
      catchError(errorRes => {
        return throwError(errorRes);
      })
    )
  }

  login(user) {
    return this.http.post<{ email, login, token, refreshToken }>(`${this.apiPath}login`, user).pipe(
      catchError(errorRes => {
        return throwError(errorRes)
      }), tap(
        resData => {
          this.handleAuthentication(resData.email, resData.login, resData.token, resData.refreshToken);
        }
      )
    )
  }

  refreshToken() {
    const token = this.getToken();
    return this.http.post<string>(`${this.apiPath}refresh`, token);
  }

  handleAuthentication(email: string, login: boolean, token: string, refreshToken: string) {
    const payload = this.jwt.decodeToken(token);
    const expDate = this.jwt.getTokenExpirationDate(token)
    
    this.user = new User(payload.email, payload.id, token, expDate);
    
    this.storeToken(token);
    localStorage.setItem('refreshToken', refreshToken);
  }

  isLoggedIn() {
    const token = localStorage.getItem('authToken');
    return !this.jwt.isTokenExpired(token);
  }

  isTokenExpired() {
    return this.jwt.isTokenExpired(localStorage.getItem('authToken'));
  }

  storeToken(token: string): void  {
    localStorage.setItem('authToken', token);
  }

  getToken(): string {
    return localStorage.getItem('authToken');
  }
}