import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpResponse,
    HttpHandler,
    HttpEvent,
    HttpErrorResponse
} from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';

import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { authService } from './auth.service';

@Injectable()
export class RefreshTokenInterceptor implements HttpInterceptor {

    constructor(private authService: authService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (this.authService.isTokenExpired()) {
            
            this.authService.refreshToken().subscribe(res => {
                const token = `Bearer ${res}`;
                this.authService.storeToken(token);

                const clone = request.clone({
                    setHeaders: {
                        Accept: `application/json`,
                        'Content-Type': `application/json`,
                        Authorization: `Bearer ${token}`
                    }
                });

                return next.handle(clone);
            })
        } else {
            return next.handle(request);
        }
    }

    
}