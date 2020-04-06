import { Component, OnInit } from '@angular/core';
import { authService } from 'src/app/core/auth/auth.service';
import { Subscription } from 'rxjs';
import { User } from 'src/app/core/models/user.model';
import { DataStorageService } from 'src/app/core/services/data-storage.service';
import { Token } from '@angular/compiler/src/ml_parser/lexer';

@Component({
  selector: 'app-news-feed',
  templateUrl: './news-feed.component.html'
})
export class NewsFeedComponent implements OnInit {
  private userSub: Subscription;
  user: string;
  constructor(private authService: authService, private dataStorage: DataStorageService) { }

  ngOnInit() {
    this.user = localStorage.getItem('authToken');
    
    this.dataStorage.getProfile().subscribe(
      res => console.log(res) 
    )
    
  }

}
