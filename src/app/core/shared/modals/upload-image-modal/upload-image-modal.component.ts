import { Component, OnInit } from '@angular/core';
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
  uploading: boolean = false;
  uploaded: boolean = false;

  constructor(
    private dataStorage: DataStorageService
  ) { }

  ngOnInit() {
    this.uploadForm = new FormGroup({
      'image': new FormControl(null, Validators.required),
      'caption': new FormControl(null),
      'hashtags': new FormControl(null),
      'location': new FormControl(null)
    });
  }

  onFormSubmit({ value }) {    
    if (value.hashtags && typeof (value.hashtags) !== 'object') {
      value.hashtags = value.hashtags.split(' ')
        .map(element => element[0] === '#' ? element : '#' + element);
    }

    this.uploading = true;

    this.dataStorage.uploadPost(value).subscribe(res => {
      this.uploading = false;
      this.uploaded = true;
      this.dataStorage.postSubject.next(res);

      setTimeout(() => {
        this.cancel();
      }, 1000);
    }, err => console.log(err)
    );
  }

  onFileInputChange(event) {
    if (event.target.files && event.target.files[0]) {
      this.imageName = event.target.files[0].name;
      this.uploadForm.patchValue({
        image: event.target.files[0]
      })

      let reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]);

      reader.onload = (event: any) => {
        this.previewUrl = event.target.result;
      }

    }
  }

  updateLocationModel(value) {
    this.uploadForm.patchValue({
      location: value
    });
  }

  cancel() {
    if (!this.uploading) {
      this['inputs'].destroy();
    }
  }
}