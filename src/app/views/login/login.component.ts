import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { authService } from 'src/app/core/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  logInForm: FormGroup;

  constructor(private authService: authService, private router: Router) { }

  ngOnInit() {
    console.log(this.authService.isLoggedIn());
    
    if(this.authService.isLoggedIn()) {
      console.log('2');
      
      this.router.navigate(['']);
    }
    this.initForm();
  }

  initForm() {
    this.logInForm = new FormGroup({
      'username': new FormControl(null, [Validators.required]),
      'password': new FormControl(null, Validators.required)
    })
  }

  loginSubmit({ value }) {
    if (value.password && value.username) {
      this.authService.login(value).subscribe(
        ({ login, token, refreshToken }: { login: boolean, token: string, refreshToken: string }) => {
          if (login && token && refreshToken) {
            this.router.navigate(['/']);
          }
        }, 
        errorRes => {
          console.log(errorRes);
          
          alert(errorRes.error.message);
        }
      )
    } else {
      alert('Username or password empty!');
    }
  }
}
