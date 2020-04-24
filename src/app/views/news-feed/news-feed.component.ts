import { Component, OnInit } from '@angular/core';
import { authService } from 'src/app/core/auth/auth.service';
import { Subscription } from 'rxjs';
import { User } from 'src/app/core/shared/models/user.model';
import { DataStorageService } from 'src/app/core/services/data-storage.service';
import { Post } from 'src/app/core/shared/models/post.model';

@Component({
  selector: 'app-news-feed',
  templateUrl: './news-feed.component.html'
})
export class NewsFeedComponent implements OnInit {
  constructor(private authService: authService, private dataStorage: DataStorageService) { }

  posts: Post[];

  ngOnInit() {    
    this.dataStorage.getNewsfeed().subscribe(res => {
      this.posts = [...res];
    })
  }

  logout() {
    this.authService.logout();
  }
}
