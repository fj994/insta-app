import { postComment } from './comment.model';

export interface Post {
    post_id: number;
    imagePath: string;
    hashtags: string[];
    user: string;
    profile_image_path: string; 
    comments: postComment[];
    likes: number[];
}