import { Component, OnInit } from '@angular/core';
import { DataStorageService } from 'src/app/core/services/data-storage.service';
import { authService } from 'src/app/core/auth/auth.service';
import { Profile } from 'src/app/core/shared/models/profile.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
  profile: Profile;

  constructor(private dataStorage: DataStorageService, private auth: authService) { }

  ngOnInit() {
    this.dataStorage.getProfile().subscribe( profile => {
      this.profile = {
        name: profile.name,
        profileImage: `${this.auth.apiPath}static/${profile.profileImage}`,
        posts: [...profile.posts.map(post => `${this.auth.apiPath}static/${post}`)]
      };
    })
  }

  uploadImage(event) {
    this.dataStorage.uploadPost(event.target.files[0], this.auth.user.value.id).subscribe(response =>{
      alert(response.image);
      this.profile.posts.unshift(`http://localhost:3000/static/${response.image}`);
    });

  }
}
