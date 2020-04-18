import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { authService } from '../auth/auth.service';
import { take, exhaustMap } from 'rxjs/operators';
import { Profile } from '../shared/models/profile.model';
import { Post } from '../shared/models/post.model';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {
  apiPath: string = environment.apiPath;

  constructor(private http: HttpClient, private authService: authService) { }

  getProfile() {
    
    return this.http.get<Profile>(`${this.apiPath}profile/${this.authService.user.value.id}`);
  }

  uploadPost(formValues) {    
    let uploadData = new FormData();
    uploadData.append('file', formValues.image);
    uploadData.append('caption', formValues.caption);
    uploadData.append('hashtags', formValues.hashtags);
    
    return this.http.post<{image: string}>(`${this.apiPath}post/upload`, uploadData);
  }

  getNewsfeed() {
    return this.http.get<Post[]>(`${this.apiPath}newsfeed`);
  }
  
}
