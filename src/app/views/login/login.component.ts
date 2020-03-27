import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AccountService } from 'src/app/core/services/account.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  logInForm: FormGroup;

  constructor(private accountService: AccountService, private router: Router) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.logInForm = new FormGroup({
      'email': new FormControl(null, Validators.email),
      'password': new FormControl(null)
    })
  }

  loginSubmit({ value }) {
    this.accountService.loginPost(value).subscribe(
      ({ login }: { login: boolean }) => {
        login === true ? this.router.navigate(['/']) : alert('login failed!');
      }
    )
  }
}
