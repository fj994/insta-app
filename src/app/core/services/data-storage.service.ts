import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { authService } from '../auth/auth.service';
import { Profile } from '../shared/models/profile.model';
import { Post } from '../shared/models/post.model';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {
  apiPath: string = environment.apiPath;

  postSubject = new Subject<Post>();

  constructor(private http: HttpClient, private authService: authService) { }

  getProfile(id) {
    return this.http.get<Profile | any>(`${this.apiPath}/profile/${id}`).pipe(map(profile => {
      profile.profileImage = `${this.apiPath}/static/${profile.profileImage}`,
        profile.posts = [...profile.posts.map(post => `${this.apiPath}/static/${post}`)]
      return profile;
    }));
  }

  uploadPost(formValues) {
    console.log(formValues);
    
    let uploadData = new FormData();
    uploadData.append('file', formValues.image);
    uploadData.append('caption', formValues.caption);
    uploadData.append('hashtags', formValues.hashtags);
    uploadData.append('location', formValues.location);

    return this.http.post<{ image: string, post_id, profile_image_path }>(`${this.apiPath}/post/upload`, uploadData).pipe(map(res=> {
        return { 
          post_id: res.post_id,
          image_path: `${this.apiPath}/static/${res.image}`,
          hashtags: formValues.hashtags,
          caption: formValues.caption,
          comments: [],
          likes: [],
          profile_image_path: `${this.apiPath}/static/${res.profile_image_path}`,
          user_id: this.authService.getUserId(),
          username: this.authService.user.value.username,
          location: formValues.location
        };
    }));
  }

  uploadProfileImage(file) {
    let uploadData = new FormData();
    uploadData.append('file', file);

    return this.http.post<{ image: string }>(`${this.apiPath}/uploadProfile`, uploadData);
  }

  getNewsfeed(next?) {
    const params = new HttpParams().set('next', next ? next : null);

    return this.http.get<Post[]>(`${this.apiPath}/newsfeed`, {params}).pipe(map(posts => {
      console.log(posts);
      
      posts.map(post => {
        console.log(posts);
        post.profile_image_path = `${this.apiPath}/static/${post.profile_image_path}`;
        post.image_path = `${this.apiPath}/static/${post.image_path}`;
        post.caption = post.caption === 'null' ? null : post.caption;
        post.location = post.location  === 'null' ? '' : post.location;
      });
      
      return posts;
    }));
  }

  getHashtagPosts(hashtag) {
    let params = new HttpParams().set('hashtag', hashtag);

    return this.http.get<Post[]>(`${this.apiPath}/hashtag`, {params}).pipe(map(posts => {
      posts.map(post => {
        post.profile_image_path = `${this.apiPath}/static/${post.profile_image_path}`;
        post.image_path = `${this.apiPath}/static/${post.image_path}`;
        post.caption = post.caption === 'null' ? null : post.caption;
        post.location = post.location  === 'null' ? '' : post.location;
      });
      return posts;
    }));
  }

  postComment(comment: string, post_id: number) {
    const commentObj = {
      post_id: post_id,
      comment: comment
    };

    return this.http.post(`${this.apiPath}/comment`, commentObj);
  }

  postLike(value: boolean, post_id: number) {
    const like = {
      value: value,
      post_id: post_id
    }
    return this.http.post(`${this.apiPath}/like`, like);
  }

  followStatusChange(currentStatus, id) {
    return this.http.post(`${this.apiPath}/follow`, { status: currentStatus, id: id });
  }

  getSearchResults(value: string): any {
    if (value[0] === '#') {
      value = value.replace(/ /g, '');
    }

    let params = new HttpParams().set('params', value);

    return value[0] === '#' ?
      this.getSearchHashtagResults(params) :
      this.getSearchUserResults(params);
  }

  getSearchUserResults(params) {
    return this.http.get<{ users: [{ profile_image_path }] }>(`${this.apiPath}/search-users`, { params }).pipe(map(users => {
      users.users.map(user => user.profile_image_path = `${this.apiPath}/static/${user.profile_image_path}`);
      return users;
    }));
  }

  getSearchHashtagResults(params) {
    return this.http.get(`${this.apiPath}/search-hashtags`, { params });
  }
}
