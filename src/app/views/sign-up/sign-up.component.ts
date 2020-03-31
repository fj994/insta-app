import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AccountService } from 'src/app/core/services/account.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html'
})
export class SignUpComponent implements OnInit {
  signInForm: FormGroup;

  constructor(private http: HttpClient, private accountService: AccountService) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.signInForm = new FormGroup({
      'email': new FormControl(null,  [Validators.email, Validators.required]),
      password: new FormControl(null, Validators.required),
      confirmPassword: new FormControl(null, Validators.required)
    })
  }

  formSubmit({ value }) {
    this.accountService.signUpPost(value);
  }
}
