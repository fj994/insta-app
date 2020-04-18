import { Component, OnInit } from '@angular/core';
import { ModalService } from '../modal.service';
import { DataStorageService } from 'src/app/core/services/data-storage.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-upload-image-modal',
  templateUrl: './upload-image-modal.component.html'
})
export class UploadImageModalComponent implements OnInit {
  previewUrl: string | ArrayBuffer | any = '/assets/icons/no-img-placeholder.png';
  imageName: string;
  uploadForm: FormGroup;

  constructor(private modalService: ModalService, private dataStorage: DataStorageService) { }

  ngOnInit() {
    this.uploadForm = new FormGroup({
      'image': new FormControl(null, Validators.required),
      'caption': new FormControl(null),
      'hashtags': new FormControl(null)
    });
  }

  onFormSubmit({ value }) {    
    if (value.hashtags && typeof(value.hashtags) !== 'object') {
      value.hashtags = value.hashtags.split(' ')
        .map(element => element[0] === '#' ? element : '#' + element);
    }

    this.dataStorage.uploadPost(value).subscribe(res => {
      console.log(res);
    }
    );
  }

  test(event) {
    if (event.target.files && event.target.files[0]) {      
      this.imageName = event.target.files[0].name;
      this.uploadForm.patchValue({
        image: event.target.files[0]
      })
      console.log(event.target.files[0]);
      
      let reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]);

      reader.onload = (event: any) => {
        this.previewUrl = event.target.result;
        }
      
    }
  }

  cancel() {
    this.modalService.destroy();
  }
}