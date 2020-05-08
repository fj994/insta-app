import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { throwError, BehaviorSubject, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from '../shared/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class authService {
  apiPath: string = environment.apiPath;
  user = new BehaviorSubject<User>(null);

  constructor(
    private http: HttpClient,
    private router: Router,
    private jwt: JwtHelperService
  ) { }

  signup(newUser): Observable<Object> {
    return this.http.post(`${this.apiPath}/users`, newUser, { headers: { skip: 'true' } }).pipe(
      catchError(errorRes => {
        return throwError(errorRes);
      })
    )
  }

  login(user): Observable<{ login, token, refreshToken }> {
    return this.http.post<{ login, token, refreshToken }>(`${this.apiPath}/login`, user, { headers: { skip: 'true' } }).pipe(
      catchError(errorRes => {
        return throwError(errorRes)
      }), tap(
        resData => {
          this.handleAuthentication(resData.token, resData.refreshToken);
        }
      )
    )
  }

  updatePassword(values): Observable<Object | any> {
    return this.http.patch(`${this.apiPath}/password`, values);
  }

  updateUsername(values): Observable<Object | any> {
    return this.http.patch(`${this.apiPath}/username`, values);
  }

  logout(): void {
    this.user.next(null);
    localStorage.setItem('userData', null);
    this.router.navigate(['/login']);
  }

  refreshToken(): Observable<{ login: boolean, token: string, err: string }> {
    const tokens = {
      token: this.user.value.token,
      refreshToken: this.user.value.refreshToken
    }
    return this.http.post<{ login: boolean, token: string, err: string }>(`${this.apiPath}/refresh`, tokens, { headers: { skip: 'true' } });
  }

  handleAuthentication(token: string, refreshToken: string): void {
    const payload = this.jwt.decodeToken(token);

    this.user.next(new User(payload.username, payload.id, token, refreshToken));
    this.storeUserData(this.user.value);
  }

  isLoggedIn(): boolean {    
    return !!JSON.parse(localStorage.getItem('userData'));
  }

  isTokenExpired(): boolean {
    return this.jwt.isTokenExpired(this.user.value.token);
  }

  autoLogin(): void {
    const user = JSON.parse(localStorage.getItem('userData'));
    if (!user) {
      return;
    }

    this.user.next(new User(user.username, user.id, user._token, user._refreshToken));
  }

  getUserId(): string {
    return this.user.value.id;
  }

  storeUserData(user: User): void {
    localStorage.setItem('userData', JSON.stringify(user));
  }

  updateToken(newToken: string): void {
    let user = new User(this.user.value.username, this.user.value.id, newToken, this.user.value.refreshToken);
    this.storeUserData(user);
    this.user.next(user);
  }
}