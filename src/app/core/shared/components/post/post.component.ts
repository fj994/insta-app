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

  constructor(private dataStorage: DataStorageService, private auth: authService) { }

  ngOnInit() {
    console.log(this.post);
  }

  onPostComment(commentInput) {
    const commentObj = {
      post_id: this.post.post_id,
      comment: commentInput.value
    };

    this.dataStorage.postComment(commentObj).subscribe(() => {
      const newComment: postComment = {
        user_id: '1',
        post_id: this.post.post_id,
        email: this.auth.user.value.email,
        comment: commentInput.value,
        timestamp: ''
      }

      this.post.comments.push(newComment);
      commentInput.value = '';
    })
  }

}
