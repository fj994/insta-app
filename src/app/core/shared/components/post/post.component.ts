import { Component, OnInit, Input } from '@angular/core';
import { Post } from '../../models/post.model';
import { DataStorageService } from 'src/app/core/services/data-storage.service';
import { authService } from 'src/app/core/auth/auth.service';
import { postComment } from '../../models/comment.model';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html'
})
export class PostComponent implements OnInit {
  @Input() post: Post;
  commentExpand: boolean = false;
  liked: boolean;

  constructor(private dataStorage: DataStorageService, private auth: authService) { }

  ngOnInit() {
    this.liked = this.post.likes.includes(+this.auth.user.value.id);
  }

  onPostComment(commentInput): void {
    if (!commentInput.value) {
      return;
    }

    this.dataStorage.postComment(commentInput.value, this.post.post_id).subscribe(() => {
      const newComment: postComment = {
        user_id: this.auth.getUserId(),
        post_id: this.post.post_id,
        username: this.auth.user.value.username,
        comment: commentInput.value,
        timestamp: ''
      }

      this.post.comments.push(newComment);
      commentInput.value = '';
    })
  }

  onLikeClick(): void {
    this.dataStorage.postLike(!this.liked, this.post.post_id).subscribe(() => {
      this.liked = !this.liked;
      if (!this.liked) {
        const index = this.post.likes.indexOf(+this.auth.user.value.id);
        this.post.likes.splice(index, 1);
      } else {
        this.post.likes.push(+this.auth.user.value.id);
      }
    })
  }
}
