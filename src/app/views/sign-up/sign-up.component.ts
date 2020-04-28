import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { authService } from 'src/app/core/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html'
})
export class SignUpComponent implements OnInit {
  signInForm: FormGroup;

  constructor(
    private authService: authService,
    private router: Router) { }

  ngOnInit() {
    if(this.authService.isLoggedIn()) {      
      this.router.navigate(['']);
    }

    this.initForm();
  }

  initForm() {
    this.signInForm = new FormGroup({
      'username': new FormControl(null, [Validators.required]),
      password: new FormControl(null, Validators.required),
      confirmPassword: new FormControl(null, Validators.required)
    })
  }

  signup({ value }) {
    this.authService.signup(value).subscribe(
      (response: { message, error }) => {
        console.log(response);
        
        alert(response.message);
        this.router.navigate(['/login']);
      },
      response => {
        console.log(response);

        alert(response.error.message);
      }
    );
  }
}
