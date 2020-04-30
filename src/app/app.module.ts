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
import { AuthGuard } from './core/auth/auth.guard';
import { authService } from './core/auth/auth.service';
import { ProfileComponent } from './views/profile/profile.component';
import { HeaderComponent } from './core/shared/components/header/header.component';
import { PostComponent } from './core/shared/components/post/post.component';
import { SearchComponent } from './core/shared/components/search/search.component';
import { UploadImageModalComponent } from './core/shared/modals/upload-image-modal/upload-image-modal.component';
import { AutosizeModule } from 'ngx-autosize';

const appRoutes: Routes = [
  { path: '', component: NewsFeedComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'profile/:id', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'hashtag/:hashtag', component: NewsFeedComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignUpComponent },
  { path: '**', redirectTo: '' }
]

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignUpComponent,
    NewsFeedComponent,
    ProfileComponent,
    HeaderComponent,
    PostComponent,
    SearchComponent,
    UploadImageModalComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    JwtModule.forRoot({
      config: {
        tokenGetter: () =>
          JSON.parse(localStorage.getItem('userData')) !== null ?
            JSON.parse(localStorage.getItem('userData'))._token : null,
        blacklistedRoutes: ['localhost:3000/login', 'localhost:3000/signup'],
        whitelistedDomains: ['localhost:3000']
      }
    }),
    AutosizeModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RefreshTokenInterceptor,
      multi: true
    },
    Location,
    UploadImageModalComponent
  ],
  entryComponents: [UploadImageModalComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
