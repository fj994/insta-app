import { Component, OnInit } from '@angular/core';
import { DataStorageService } from 'src/app/core/services/data-storage.service';
import { authService } from 'src/app/core/auth/auth.service';
import { Profile } from 'src/app/core/shared/models/profile.model';
import { ActivatedRouteSnapshot, ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
  profile: Profile;
  owner: boolean;

  constructor(
    private dataStorage: DataStorageService,
    private auth: authService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    let id;

    if (this.route.snapshot.params.id) {
      id = this.route.snapshot.params.id;
      this.owner = false;
    } else {
      id = this.auth.getUserId();
      this.owner = true;
    }

    this.dataStorage.getProfile(id).subscribe(profile => {
      console.log(profile);
      
      this.profile = profile;
    }, () => {
      this.router.navigate(['']);
    });
  }


  onFollowClick() {
    this.dataStorage.followStatusChange(this.profile.followStatus, this.profile.id).subscribe(() => {
      this.profile.followStatus = !this.profile.followStatus;
    })
  }
}

