import { Component, OnInit } from '@angular/core';
import { DataStorageService } from 'src/app/core/services/data-storage.service';
import { authService } from 'src/app/core/auth/auth.service';
import { Profile } from 'src/app/core/shared/models/profile.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalService } from 'src/app/core/shared/modals/modal.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
  profile: Profile;
  owner: boolean;
  next;

  constructor(
    private dataStorage: DataStorageService,
    private auth: authService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: ModalService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.loadProfile();
    })

    this.dataStorage.postSubject.subscribe(
      post => this.profile.posts.unshift(post.image_path)
    );
  }

  loadProfile(): void {
    let id;
    if (this.route.snapshot.params.id) {
      id = this.route.snapshot.params.id;

      if (id == this.auth.getUserId()) {
        this.router.navigate(['/profile']);
      }

      this.owner = false;
    } else {
      id = this.auth.getUserId();
      this.owner = true;
    }

    this.dataStorage.getProfile(id).subscribe(res => {
      this.profile = res.profile;
      this.next = res.next;
    }, () => {
      this.router.navigate(['']);
    });
  }


  onFollowClick(): void {
    this.dataStorage.followStatusChange(this.profile.followStatus, this.profile.id).subscribe(() => {
      this.profile.followStatus ? this.profile.followersCount-- : this.profile.followersCount++;
      this.profile.followStatus = !this.profile.followStatus;
    })
  }

  onEditProfileInfoClick = (): void => {
    this.modalService.initEditProfileModal({initAutoDialogModal: this.modalService.initAutoClosingDialogModal, profile: this.profile});
  }

  onProfileImgInputChange(event): void {
    this.dataStorage.uploadProfileImage(event.target.files[0]).subscribe(res => {
      this.profile.profileImage = `${this.dataStorage.apiPath}/static/${res.image}`;
    });
  }

  onScroll(): void {    
    this.dataStorage.getMoreProfileImages(this.next, this.profile.id).subscribe(res => {
      this.next = res.next;
      this.profile.posts.push(...res.posts);
    });
  }
}

