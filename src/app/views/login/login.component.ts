import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { authService } from 'src/app/core/auth/auth.service';
import { Router } from '@angular/router';
import { ModalService } from 'src/app/core/shared/modals/modal.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit, OnDestroy {
  logInForm: FormGroup;

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

  initForm(): void {
    this.logInForm = new FormGroup({
      'username': new FormControl(null, [Validators.required]),
      'password': new FormControl(null, Validators.required)
    })
  }

  loginSubmit({ value }): void {
    if (value.password && value.username) {
      this.authService.login(value).subscribe(
        ({ login, token, refreshToken }: { login: boolean, token: string, refreshToken: string }) => {
          if (login && token && refreshToken) {
            this.router.navigate(['/']);
          }
        },
        errorRes => {
          console.log(errorRes);
          this.modalService.initDialogModal({ message: errorRes.error.message });
        }
      )
    } else {
      this.modalService.initDialogModal({ message: 'Please enter username and password!' });
    }
  }

  ngOnDestroy(): void {
    this.modalService.destroy();
  }
}
