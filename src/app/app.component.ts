import { Component, OnInit } from '@angular/core';
import { authService } from './core/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'instagram-app';
  loggedIn: boolean;

  constructor(private authService: authService) {}

  ngOnInit() {
    this.authService.autoLogin();

    this.authService.user.subscribe(
      user => {
        this.loggedIn = !!user;
      }
    );
  }
}
