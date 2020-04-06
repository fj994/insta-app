import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { authService } from 'src/app/core/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html'
})
export class SignUpComponent implements OnInit {
  signInForm: FormGroup;

  constructor(
    private http: HttpClient,
    private authService: authService,
    private router: Router) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.signInForm = new FormGroup({
      'email': new FormControl(null, [Validators.email, Validators.required]),
      password: new FormControl(null, Validators.required),
      confirmPassword: new FormControl(null, Validators.required)
    })
  }

  signup({ value }) {
    this.authService.signup(value).subscribe(
      (response: { message, error }) => {
        alert(response.message);
        this.router.navigate(['/login']);
      },
      response => {
        alert(response.error.message);
      }
    );
  }
}
