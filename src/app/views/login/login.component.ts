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

  constructor(private accountService: authService, private router: Router) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.logInForm = new FormGroup({
      'email': new FormControl(null, [Validators.email, Validators.required]),
      'password': new FormControl(null, Validators.required)
    })
  }

  loginSubmit({ value }) {
    if (value.password && value.email) {
      this.accountService.login(value).subscribe(
        ({ login, token }: { login: boolean, token: string }) => {
          if (login && token) {
            this.router.navigate(['/']);
          }
        }, 
        errorRes => {
          alert(errorRes.error.message);
        }
      )
    } else {
      alert('Username or password empty!');
    }
  }
}
