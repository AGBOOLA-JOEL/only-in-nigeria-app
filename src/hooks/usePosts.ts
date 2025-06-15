
import { useState, useEffect } from 'react';
import { Post, Comment } from '@/types/post';

const SAMPLE_POSTS: Post[] = [
  {
    id: '1',
    title: 'Nigerian drivers and their road rage',
    content: 'Portuguese drivers have so much of road rage with 3 vehicles on the road 😂. But have you seen Lagos traffic? We have 300 vehicles and still maintain our sanity (mostly)!',
    votes: 15,
    commentCount: 8,
    timestamp: Date.now() - 2 * 60 * 60 * 1000, // 2 hours ago
    comments: [
      {
        id: '1-1',
        content: 'Lagos traffic is a whole different level of patience training 😅',
        timestamp: Date.now() - 1 * 60 * 60 * 1000,
      }
    ]
  },
  {
    id: '2',
    title: 'Only in Nigeria: Generator University',
    content: 'My neighbor bought a generator for his generator. When I asked why, he said "backup for the backup, you never know when NEPA will take light from both!" 😂',
    votes: 32,
    commentCount: 12,
    timestamp: Date.now() - 4 * 60 * 60 * 1000,
    comments: []
  },
  {
    id: '3',
    title: 'Nigerian parents and technology',
    content: 'My mum called me to come fix the TV. I came home and found out she was pressing the volume button on the remote to change channels. When I showed her the channel button, she said "But this one was working fine yesterday!" 🤦‍♂️',
    votes: 28,
    commentCount: 6,
    timestamp: Date.now() - 6 * 60 * 60 * 1000,
    comments: []
  }
];

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      const savedPosts = localStorage.getItem('nigeria-posts');
      if (savedPosts) {
        setPosts(JSON.parse(savedPosts));
      } else {
        setPosts(SAMPLE_POSTS);
        localStorage.setItem('nigeria-posts', JSON.stringify(SAMPLE_POSTS));
      }
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const saveToStorage = (updatedPosts: Post[]) => {
    localStorage.setItem('nigeria-posts', JSON.stringify(updatedPosts));
  };

  const addPost = (title: string, content: string) => {
    const newPost: Post = {
      id: Date.now().toString(),
      title,
      content,
      votes: 1,
      userVote: 'up',
      commentCount: 0,
      comments: [],
      timestamp: Date.now()
    };
    
    const updatedPosts = [newPost, ...posts];
    setPosts(updatedPosts);
    saveToStorage(updatedPosts);
  };

  const voteOnPost = (postId: string, voteType: 'up' | 'down') => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        let newVotes = post.votes;
        let newUserVote: 'up' | 'down' | null = voteType;

        // Handle vote logic
        if (post.userVote === voteType) {
          // Remove vote if clicking same vote
          newUserVote = null;
          newVotes += voteType === 'up' ? -1 : 1;
        } else if (post.userVote) {
          // Switch vote
          newVotes += voteType === 'up' ? 2 : -2;
        } else {
          // New vote
          newVotes += voteType === 'up' ? 1 : -1;
        }

        return { ...post, votes: newVotes, userVote: newUserVote };
      }
      return post;
    });
    
    setPosts(updatedPosts);
    saveToStorage(updatedPosts);
  };

  const addComment = (postId: string, content: string) => {
    const newComment: Comment = {
      id: `${postId}-${Date.now()}`,
      content,
      timestamp: Date.now()
    };

    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        const updatedComments = [...(post.comments || []), newComment];
        return {
          ...post,
          comments: updatedComments,
          commentCount: updatedComments.length
        };
      }
      return post;
    });
    
    setPosts(updatedPosts);
    saveToStorage(updatedPosts);
  };

  const sortPosts = (posts: Post[], sortType: 'new' | 'top' | 'trending') => {
    switch (sortType) {
      case 'new':
        return [...posts].sort((a, b) => b.timestamp - a.timestamp);
      case 'top':
        return [...posts].sort((a, b) => b.votes - a.votes);
      case 'trending':
        // Simple trending algorithm: posts with good vote/time ratio
        return [...posts].sort((a, b) => {
          const aScore = a.votes / (Date.now() - a.timestamp + 1);
          const bScore = b.votes / (Date.now() - b.timestamp + 1);
          return bScore - aScore;
        });
      default:
        return posts;
    }
  };

  return {
    posts,
    isLoading,
    addPost,
    voteOnPost,
    addComment,
    sortPosts
  };
};
