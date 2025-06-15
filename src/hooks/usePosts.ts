
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Post, Comment } from '@/types/post';

// Client-side vote tracking in localStorage
const getVotedPosts = (): Record<string, 'up'> => {
  if (typeof window === 'undefined') return {};
  const voted = localStorage.getItem('nigeria-voted-posts');
  // Only allow 'up' for userVote
  const parsed = voted ? JSON.parse(voted) : {};
  // Filter out any old "down" votes for safety
  Object.keys(parsed).forEach(k => {
    if (parsed[k] !== "up") {
      delete parsed[k];
    }
  });
  return parsed;
};

const setVotedPost = (postId: string, voteType: 'up' | null) => {
  const voted = getVotedPosts();
  if (voteType === 'up') {
    voted[postId] = voteType;
  } else {
    delete voted[postId];
  }
  localStorage.setItem('nigeria-voted-posts', JSON.stringify(voted));
};


export const usePosts = () => {
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ['posts'],
        queryFn: async (): Promise<Post[]> => {
            // Fetch posts and comments in parallel
            const postsPromise = supabase.from('posts').select('*').order('created_at', { ascending: false });
            const commentsPromise = supabase.from('comments').select('*');
            
            const [postsRes, commentsRes] = await Promise.all([postsPromise, commentsPromise]);
            
            if (postsRes.error) throw new Error(postsRes.error.message);
            if (commentsRes.error) throw new Error(commentsRes.error.message);

            const postsData = postsRes.data || [];
            const commentsData = commentsRes.data || [];
            const votedPosts = getVotedPosts();

            // Group comments by post_id
            const commentsByPostId = commentsData.reduce<Record<string, Comment[]>>((acc, comment) => {
                const typedComment: Comment = {
                    id: comment.id,
                    content: comment.content,
                    created_at: comment.created_at,
                    post_id: comment.post_id,
                };
                if (!acc[typedComment.post_id]) {
                    acc[typedComment.post_id] = [];
                }
                acc[typedComment.post_id].push(typedComment);
                return acc;
            }, {});

            // Combine posts with their comments and vote status, NO DOWNVOTES
            const posts: Post[] = postsData.map(p => {
                const postComments = commentsByPostId[p.id] || [];
                return {
                    ...p,
                    votes: typeof p.votes === "number" ? p.votes : 0,
                    comments: postComments.sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
                    commentCount: postComments.length,
                    userVote: votedPosts[p.id] === "up" ? "up" : null, // Only "up" or null
                };
            });
            
            return posts;
        },
        staleTime: 60 * 1000, // 1 minute
    });

    const addPostMutation = useMutation({
        mutationFn: async ({ title, content }: { title: string; content: string }) => {
            // Insert into posts with upvote = 1
            const { data, error } = await supabase.from('posts').insert({ title, content, votes: 1 }).select().single();
            if (error) throw new Error(error.message);
            setVotedPost(data.id, 'up'); // User who creates a post auto-upvotes it.
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
        },
    });

    const addCommentMutation = useMutation({
        mutationFn: async ({ postId, content }: { postId: string; content: string }) => {
            const { error } = await supabase.from('comments').insert({ post_id: postId, content });
            if (error) throw new Error(error.message);
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
        },
    });

    // Upvote Only (no more downvote logic)
    const voteOnPostMutation = useMutation({
        mutationFn: async ({ postId, voteType }: { postId: string; voteType: 'up' }) => {
            const currentVote = getVotedPosts()[postId];
            let upvoteChange = 0;
            let nextVoteState: 'up' | null = voteType;

            if (!currentVote) {
              // New vote (never voted)
              upvoteChange = 1;
            } else if (currentVote === voteType) {
              // Remove vote (toggle same)
              upvoteChange = -1;
              nextVoteState = null;
            }
            if (upvoteChange !== 0) {
              const { error } = await supabase.rpc('update_post_vote', {
                post_id_to_update: postId,
                vote_value: upvoteChange,
              });
              if (error) throw new Error(error.message);
            }
            setVotedPost(postId, nextVoteState);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
        },
    });

    // Sorting: "top" by upvotes, trending uses upvotes per hour, "new" is newest first
    const sortPosts = (postsToSort: Post[], sortType: 'new' | 'top' | 'trending') => {
        if (!postsToSort) return [];
        switch (sortType) {
          case 'new':
            return [...postsToSort].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
          case 'top':
            return [...postsToSort].sort(
              (a, b) =>
                b.votes - a.votes
            );
          case 'trending':
            // Trending = upvotes / hours since post
            const now = Date.now();
            return [...postsToSort].sort((a, b) => {
              const aScore = a.votes / ((now - new Date(a.created_at).getTime()) / 3600000 + 1);
              const bScore = b.votes / ((now - new Date(b.created_at).getTime()) / 3600000 + 1);
              return bScore - aScore;
            });
          default:
            return postsToSort;
        }
    };
    
    return {
        posts: data || [],
        isLoading,
        addPost: addPostMutation.mutate,
        voteOnPost: voteOnPostMutation.mutate,
        addComment: addCommentMutation.mutate,
        sortPosts
    };
};
