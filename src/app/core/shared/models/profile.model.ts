export interface Profile {
    id: string;
    name: string;
    profileImage: string;
    posts: string[];
    followersCount: number;
    followingCount: number;
    followStatus: boolean;
}