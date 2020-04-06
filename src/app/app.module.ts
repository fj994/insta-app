import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';

import { AppComponent } from './app.component';
import { LoginComponent } from './views/login/login.component';
import { SignUpComponent } from './views/sign-up/sign-up.component';
import { NewsFeedComponent } from './views/news-feed/news-feed.component';
import { RefreshTokenInterceptor } from './core/auth/refresh-token-interceptor';

const appRoutes: Routes = [
  {path: '', component: NewsFeedComponent},
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignUpComponent}
]

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignUpComponent,
    NewsFeedComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    JwtModule.forRoot({
      config: {
        tokenGetter: () => localStorage.getItem('authToken'),
        whitelistedDomains: ['localhost:3000'],
        blacklistedRoutes: []
      }
    })
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RefreshTokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
