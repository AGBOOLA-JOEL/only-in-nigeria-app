
export interface Comment {
  id: string;
  content: string;
  timestamp: number;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  votes: number;
  userVote?: 'up' | 'down' | null;
  commentCount: number;
  comments?: Comment[];
  timestamp: number;
}
