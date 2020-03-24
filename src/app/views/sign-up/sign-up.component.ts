import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html'
})
export class SignUpComponent implements OnInit {
  signInForm: FormGroup;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.signInForm = new FormGroup({
      'email': new FormControl(null, Validators.email),
      password: new FormControl(null),
      confirmPassword: new FormControl(null)
    })
  }

  formSubmit({ value }) {
    console.log(value);

    this.http.post('http://localhost:3000/', value, {responseType: 'text'}).subscribe(
      response => {
        console.log(response);
      }
    )
  }
}
