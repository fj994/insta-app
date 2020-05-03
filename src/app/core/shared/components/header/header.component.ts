import { Component, OnInit } from '@angular/core';
import { ModalService } from '../../modals/modal.service';
import { authService } from 'src/app/core/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {

  constructor(private modalService: ModalService, private auth: authService) { }

  ngOnInit() {
  }

  onUploadImageClick(): void {
    this.modalService.initUploadImageModal({});
  }

  onLogoutclick(): void {
    this.auth.logout();
  }
}
