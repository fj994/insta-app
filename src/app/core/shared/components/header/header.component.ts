import { Component, OnInit } from '@angular/core';
import { ModalService } from '../../modals/modal.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {

  constructor(private modalService: ModalService) { }

  ngOnInit() {
  }

  onUploadImageClick() {
    this.modalService.initUploadImageModal({});
  }
}
