import { Component, OnInit } from '@angular/core';
import { DataStorageService } from 'src/app/core/services/data-storage.service';
import { Post } from 'src/app/core/shared/models/post.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-news-feed',
  templateUrl: './news-feed.component.html'
})
export class NewsFeedComponent implements OnInit {
  posts: Post[];
  hashtag: string;

  constructor(
    private dataStorage: DataStorageService,
    private activatedRoute: ActivatedRoute,
  ) { }


  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      if (params.hashtag) {
        this.hashtag = params.hashtag;
        this.loadPosts(null, this.hashtag);
      } else {
        this.loadPosts();
      }
    });


    this.dataStorage.postSubject.subscribe(
      post => {
        if (!this.hashtag || post.hashtags.includes(this.hashtag)) {
          this.posts.unshift(post)
        }
      }
    );
  }

  loadPosts(next?, hashtag?): void {
    this.dataStorage.getPosts(next, hashtag).subscribe(res => {
      this.posts = [...res];
    })
  }

  onScroll(): void {
    console.log('scrolled');
    this.dataStorage.getPosts(this.posts[this.posts.length - 1].post_id, this.hashtag).subscribe(posts => {
      this.posts.push(...posts);
    });
  }
}
