import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { authService } from 'src/app/core/auth/auth.service';
import { Router } from '@angular/router';
import { ModalService } from 'src/app/core/shared/modals/modal.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html'
})
export class SignUpComponent implements OnInit {
  signInForm: FormGroup;

  constructor(
    private authService: authService,
    private router: Router,
    private modalService: ModalService
  ) { }

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
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
    if (value.username && value.password && value.confirmPassword) {
      value.username = value.username.trim();
      value.password = value.password.trim();
      value.confirmPassword = value.confirmPassword.trim();
    } else {
      this.modalService.initDialogModal({ message: 'Please fill all fileds!' });
      return;
    }

    if (value.password !== value.confirmPassword) {
      this.modalService.initDialogModal({ message: 'Passwords do not match!' });
      return;
    }

    this.authService.signup(value).subscribe(
      (response: { message, error }) => {        
        this.modalService.initDialogModal({ message: response.message });
        this.router.navigate(['/login']);
      },
      response => {
        console.log(response);
        this.modalService.initDialogModal({ message: response.error.message });
      }
    );
  }
}
