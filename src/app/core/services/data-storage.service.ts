import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { authService } from '../auth/auth.service';
import { Profile } from '../shared/models/profile.model';
import { Post } from '../shared/models/post.model';
import { map } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {
  apiPath: string = environment.apiPath;

  postSubject = new Subject<Post>();

  constructor(private http: HttpClient, private authService: authService) { }

  getProfile(id): Observable<any> {
    return this.http.get<Profile | any>(`${this.apiPath}/profile/${id}`);
  }

  getMoreProfileImages(next, profileId): Observable<{posts: string[], next: string}> {
    const params = new HttpParams().set('next', next).set('profile_id', profileId);
    return this.http.get<{posts: string[], next: string}>(`${this.apiPath}/profile-images`, { params });
  }

  uploadPost(formValues): Observable<Post> {
    let uploadData = new FormData();
    uploadData.append('image', formValues.image);
    uploadData.append('caption', formValues.caption);
    uploadData.append('hashtags', formValues.hashtags);
    uploadData.append('location', formValues.location);

    return this.http.post<{ image: string, post_id, profile_image_path }>(`${this.apiPath}/post/upload`, uploadData).pipe(map(res => {
      return {
        post_id: res.post_id,
        image_path: res.image,
        hashtags: [...new Set<string>(formValues.hashtags)],
        caption: formValues.caption,
        comments: [],
        likes: [],
        profile_image_path: res.profile_image_path,
        user_id: this.authService.getUserId(),
        username: this.authService.user.value.username,
        location: formValues.location
      };
    }));
  }

  uploadProfileImage(file): Observable<{ image: string }> {
    let uploadData = new FormData();
    uploadData.append('image', file);

    return this.http.post<{ image: string }>(`${this.apiPath}/uploadProfile`, uploadData);
  }

  getPosts(next?, hashtag?: string): Observable<Post[]> {
    const params = new HttpParams()
      .set('next', next ? next : null)
      .set('hashtag', hashtag ? hashtag : null);

    return this.http.get<Post[]>(`${this.apiPath}/posts`, { params }).pipe(map(posts => {
      posts.map(post => {
        post.profile_image_path = post.profile_image_path;
        post.image_path = post.image_path;
        post.caption = post.caption === 'null' ? null : post.caption;
        post.location = post.location === 'null' ? '' : post.location;
      });

      return posts;
    }));
  }

  postComment(comment: string, post_id: number): Observable<any> {
    const commentObj = {
      post_id: post_id,
      comment: comment
    };

    return this.http.post(`${this.apiPath}/comment`, commentObj);
  }

  postLike(value: boolean, post_id: number): Observable<any> {
    const like = {
      value: value,
      post_id: post_id
    }
    return this.http.post(`${this.apiPath}/like`, like);
  }

  followStatusChange(currentStatus, id): Observable<any> {
    return this.http.post(`${this.apiPath}/follow`, { status: currentStatus, id: id });
  }

  getSearchResults(value: string): Observable<any> {
    if (value[0] === '#') {
      value = value.replace(/ /g, '');
    }

    let params = new HttpParams().set('params', value);

    return value[0] === '#' ?
      this.getSearchHashtagResults(params) :
      this.getSearchUserResults(params);
  }

  getSearchUserResults(params): Observable<{ users: [{ profile_image_path }] }> {
    return this.http.get<{ users: [{ profile_image_path }] }>(`${this.apiPath}/search-users`, { params }).pipe(map(users => {
      users.users.map(user => user.profile_image_path = user.profile_image_path);
      return users;
    }));
  }

  getSearchHashtagResults(params): Observable<any> {
    return this.http.get(`${this.apiPath}/search-hashtags`, { params });
  }
}
