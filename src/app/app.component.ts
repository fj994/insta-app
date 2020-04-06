import { Component, OnInit } from '@angular/core';
import { authService } from './core/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'instagram-app';
  constructor(private authService: authService, private router: Router) {}
  
  ngOnInit() {
    if(!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
    }
  }
}
