import { Component, OnInit } from '@angular/core';
import { DataStorageService } from 'src/app/core/services/data-storage.service';
import { authService } from 'src/app/core/auth/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {

  pictureArray = [];

  constructor(private dataStorage: DataStorageService, private auth: authService) { }

  ngOnInit() {
    this.dataStorage.getProfile().subscribe( res => {
      res.resu.forEach(element => {
        this.pictureArray.push(`http://localhost:3000/static/${element.image_path}`);
      });

    })
  }

  uploadImage(event) {
    this.dataStorage.uploadPost(event.target.files[0], this.auth.user.value.id).subscribe(res=>{
      alert(res.image);
      this.pictureArray.push(`http://localhost:3000/static/${res.image}`);
    });

  }
}
