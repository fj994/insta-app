import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { authService } from '../auth/auth.service';
import { Profile } from '../shared/models/profile.model';
import { Post } from '../shared/models/post.model';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ProfileComponent } from 'src/app/views/profile/profile.component';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {
  apiPath: string = environment.apiPath;

  constructor(private http: HttpClient, private authService: authService) { }

  getProfile(id) {
    return this.http.get<Profile | any>(`${this.apiPath}/profile/${id}`).pipe(map(profile => {
      profile.profileImage = `${this.apiPath}/static/${profile.profileImage}`,
        profile.posts = [...profile.posts.map(post => `${this.apiPath}/static/${post}`)]
      return profile;
    }));
  }

  uploadPost(formValues) {
    let uploadData = new FormData();
    uploadData.append('file', formValues.image);
    uploadData.append('caption', formValues.caption);
    uploadData.append('hashtags', formValues.hashtags);

    return this.http.post<{ image: string }>(`${this.apiPath}/post/upload`, uploadData);
  }

  uploadProfileImage(file) {
    let uploadData = new FormData();
    uploadData.append('file', file);

    return this.http.post<{ image: string }>(`${this.apiPath}/uploadProfile`, uploadData);
  }

  getNewsfeed() {
    return this.http.get<Post[]>(`${this.apiPath}/newsfeed`).pipe(map(posts => {
      posts.map(post => {
        post.profile_image_path = `${this.apiPath}/static/${post.profile_image_path}`;
        post.image_path = `${this.apiPath}/static/${post.image_path}`;
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
