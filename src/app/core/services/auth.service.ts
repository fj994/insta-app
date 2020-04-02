import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import * as jwt_decode from 'jwt-decode';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class authService {
  apiPath: string = environment.apiPath;

  user = new BehaviorSubject<User>(null);

  constructor(private http: HttpClient, private router: Router) { }

  signup(newUser) {
    return this.http.post(`${this.apiPath}users`, newUser).pipe(
      catchError(errorRes => {
        return throwError(errorRes);
      })
    )
  }

  loginPost(user) {
    return this.http.post<{email, login, token}>(`${this.apiPath}login`, user).pipe(
      catchError(errorRes => {
        return throwError(errorRes)
      }), tap(
        resData => {
        this.handleAuthentication(resData.email, resData.login, resData.token);
        }
      )
    )
  }

  handleAuthentication(email:string, login: boolean, token: string) {
    const payload = jwt_decode(token);
    const expDate = new Date(new Date(0).getTime() + +payload.exp * 1000);
    const user = new User(payload.email, payload.id, token, expDate);
    
    this.user.next(user);
  }
}
