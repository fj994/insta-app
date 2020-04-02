import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';

import { AppComponent } from './app.component';
import { LoginComponent } from './views/login/login.component';
import { SignUpComponent } from './views/sign-up/sign-up.component';
import { NewsFeedComponent } from './views/news-feed/news-feed.component';

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
        tokenGetter: () => 'aa',
        whitelistedDomains: ['localhost:3000'],
        blacklistedRoutes: []
      }
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
