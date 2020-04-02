import { Component, OnInit } from '@angular/core';
import { authService } from 'src/app/core/services/auth.service';
import { Subscription } from 'rxjs';
import { User } from 'src/app/core/models/user.model';
import { DataStorageService } from 'src/app/core/services/data-storage.service';

@Component({
  selector: 'app-news-feed',
  templateUrl: './news-feed.component.html'
})
export class NewsFeedComponent implements OnInit {
  private userSub: Subscription;
  user: User;
  constructor(private authService: authService, private dataStorage: DataStorageService) { }

  ngOnInit() {
    this.userSub = this.authService.user.subscribe(
      user => {
        this.user = user;
      } 
    )   
    
    this.dataStorage.getProfile().subscribe(
      res => console.log(res) 
    )
    
  }

}
