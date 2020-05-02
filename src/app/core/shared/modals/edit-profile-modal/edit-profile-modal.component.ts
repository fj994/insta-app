import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { authService } from 'src/app/core/auth/auth.service';

@Component({
  selector: 'app-edit-profile-modal',
  templateUrl: './edit-profile-modal.component.html'
})
export class EditProfileModalComponent implements OnInit {
  passwordTab: boolean = false;
  editForm: FormGroup;

  constructor(private authService: authService) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.editForm = new FormGroup({
      password: new FormControl(null, Validators.required),
      username: new FormControl(null, Validators.required),
      newPassword: new FormControl(null, Validators.required),
      confirmPassword: new FormControl(null, Validators.required)
    });
  }

  destroy() {
    this['inputs'].destroy();
  }

  onEditFormSubmit({ value }) {
    if ((this.passwordTab && (!value.password || !value.newPassword || !value.confirmPassword))
      || (!this.passwordTab && (!value.password || !value.username))) {
      this['inputs'].initAutoDialogModal({ message: 'Not all required fields were entered!' });
      return;
    }

    if (this.passwordTab && value.newPassword !== value.confirmPassword) {
      this['inputs'].initAutoDialogModal({ message: 'Passwords do not match!' });
      return;
    }

    if (this.passwordTab) {
      this.authService.updatePassword(value).subscribe((res: {message: string}) => {
        this['inputs'].initAutoDialogModal({ message: res.message });
        return;
      });
    } 

    if(!this.passwordTab) {
      this.authService.updateUsername(value).subscribe((res: {message: string}) => {
        this['inputs'].profile.name = value.username;
        this['inputs'].initAutoDialogModal({ message: res.message });
      }, res => {
        console.log(res);
        
        this['inputs'].initAutoDialogModal({ message: res.error.message });
      })
    }
  }

  onUsernameTabClick() {
    this.passwordTab = false;
    this.editForm.reset();
  }

  onPasswordTabClick() {
    this.passwordTab = true;
    this.editForm.reset();
  }

}
