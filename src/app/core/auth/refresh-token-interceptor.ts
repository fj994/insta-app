import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent
} from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';

import { Observable } from 'rxjs';
import { take, exhaustMap } from 'rxjs/operators';
import { authService } from './auth.service';

@Injectable()
export class RefreshTokenInterceptor implements HttpInterceptor {

    constructor(private authService: authService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (request.headers.get("skip")) {
            return next.handle(request);
        }

        if (this.authService.isTokenExpired()) {
            return this.authService.refreshToken().pipe(
                take(1),
                exhaustMap(data => {
                    this.authService.updateToken(data.token);
                    request = request.clone({
                        setHeaders: {Authorization: data.token}
                    })
                    return next.handle(request);
                })
            )
        } else {
            return next.handle(request);
        }
    }


}