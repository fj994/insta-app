import { postComment } from './comment.model';

export interface Post {
    post_id: number;
    image_path: string;
    hashtags: string[];
    user_id: string;
    profile_image_path: string; 
    comments: postComment[];
    likes: number[];
    caption: string;
    username: string;
}