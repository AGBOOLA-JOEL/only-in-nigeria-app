
export interface Comment {
  id: string;
  content: string;
  created_at: string;
  post_id: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  votes: number;
  userVote?: 'up' | 'down' | null;
  commentCount: number;
  comments: Comment[];
  created_at: string;
}
