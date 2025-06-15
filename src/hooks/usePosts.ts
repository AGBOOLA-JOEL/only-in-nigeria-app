
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Post, Comment } from '@/types/post';

// Client-side vote tracking in localStorage
const getVotedPosts = (): Record<string, 'up' | 'down'> => {
  if (typeof window === 'undefined') return {};
  const voted = localStorage.getItem('nigeria-voted-posts');
  return voted ? JSON.parse(voted) : {};
};

const setVotedPost = (postId: string, voteType: 'up' | 'down' | null) => {
  const voted = getVotedPosts();
  if (voteType) {
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

            // Combine posts with their comments and vote status
            const posts: Post[] = postsData.map(p => {
                const postComments = commentsByPostId[p.id] || [];
                return {
                    ...p,
                    comments: postComments.sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
                    commentCount: postComments.length,
                    userVote: votedPosts[p.id] || null,
                };
            });
            
            return posts;
        },
        staleTime: 60 * 1000, // 1 minute
    });

    const addPostMutation = useMutation({
        mutationFn: async ({ title, content }: { title: string; content: string }) => {
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

    const voteOnPostMutation = useMutation({
        mutationFn: async ({ postId, voteType }: { postId: string; voteType: 'up' | 'down' }) => {
            const currentVote = getVotedPosts()[postId];
            let voteValue = 0;
            let nextVoteState: 'up' | 'down' | null = voteType;

            if (currentVote === voteType) {
                voteValue = voteType === 'up' ? -1 : 1;
                nextVoteState = null;
            } else if (currentVote) {
                voteValue = voteType === 'up' ? 2 : -2;
            } else {
                voteValue = voteType === 'up' ? 1 : -1;
            }
            
            const { error } = await supabase.rpc('update_post_vote', {
                post_id_to_update: postId,
                vote_value: voteValue,
            });

            if (error) throw new Error(error.message);
            
            setVotedPost(postId, nextVoteState);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
        },
    });

    const sortPosts = (postsToSort: Post[], sortType: 'new' | 'top' | 'trending') => {
        if (!postsToSort) return [];
        switch (sortType) {
          case 'new':
            return [...postsToSort].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
          case 'top':
            return [...postsToSort].sort((a, b) => b.votes - a.votes);
          case 'trending':
            return [...postsToSort].sort((a, b) => {
              const aScore = a.votes / (Date.now() - new Date(a.created_at).getTime() + 1);
              const bScore = b.votes / (Date.now() - new Date(b.created_at).getTime() + 1);
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
