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

            // Combine posts with their comments and vote status, including downvotes
            const posts: Post[] = postsData.map(p => {
                const postComments = commentsByPostId[p.id] || [];
                return {
                    ...p,
                    downvotes: typeof p.downvotes === "number" ? p.downvotes : 0,
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
            // Insert into posts with upvote = 1, downvotes = 0
            const { data, error } = await supabase.from('posts').insert({ title, content, votes: 1, downvotes: 0 }).select().single();
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

    // NEW VOTE LOGIC: handle upvote/downvote fields separately
    const voteOnPostMutation = useMutation({
        // If user toggles their current vote, revert it. If switching, adjust accordingly.
        mutationFn: async ({ postId, voteType }: { postId: string; voteType: 'up' | 'down' }) => {
            const currentVote = getVotedPosts()[postId];
            let upvoteChange = 0;
            let downvoteChange = 0;
            let nextVoteState: 'up' | 'down' | null = voteType;

            if (!currentVote) {
              // New vote (never voted)
              if (voteType === 'up') upvoteChange = 1;
              else downvoteChange = 1;
            } else if (currentVote === voteType) {
              // Remove vote (toggle same)
              if (voteType === 'up') upvoteChange = -1;
              else downvoteChange = -1;
              nextVoteState = null;
            } else {
              // Switching vote
              if (voteType === 'up') {
                upvoteChange = 1;
                downvoteChange = -1;
              } else {
                upvoteChange = -1;
                downvoteChange = 1;
              }
            }

            // Update both upvote and downvote fields
            const updates: Record<string, any> = {};
            if (upvoteChange !== 0) updates.votes = supabase.rpc('update_post_vote', {
                post_id_to_update: postId,
                vote_value: upvoteChange,
            });
            if (downvoteChange !== 0) updates.downvotes = supabase
                .from('posts')
                .update({ downvotes: upvoteChange !== 0 ? null : supabase.literal(`downvotes + ${downvoteChange}`) })
                .eq('id', postId);

            // Use a PG function for upvotes (existing) and direct update for downvotes for compatibility
            if (upvoteChange !== 0) {
              const { error } = await supabase.rpc('update_post_vote', {
                post_id_to_update: postId,
                vote_value: upvoteChange,
              });
              if (error) throw new Error(error.message);
            }
            if (downvoteChange !== 0) {
              // Use a single "update ... set downvotes = downvotes + X" query.
              const { error } = await supabase
                .from('posts')
                .update({ downvotes: undefined })
                .eq('id', postId)
                .select()
                .single();
              // Patch: since supabase-js does not have a way to increment in one call, instead use RPC. But workaround below using direct update:
              const { error: updateError } = await supabase.rpc('increment_downvotes', {
                post_id_input: postId,
                change: downvoteChange,
              });
              if (updateError) throw new Error(updateError.message);
            }

            setVotedPost(postId, nextVoteState);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
        },
    });

    // Sorting: "top" uses upvotes - downvotes, trending uses a score as before, with net votes
    const sortPosts = (postsToSort: Post[], sortType: 'new' | 'top' | 'trending') => {
        if (!postsToSort) return [];
        switch (sortType) {
          case 'new':
            return [...postsToSort].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
          case 'top':
            // Sort by NET votes, then upvotes, then downvotes
            return [...postsToSort].sort(
              (a, b) =>
                (b.votes - b.downvotes) - (a.votes - a.downvotes) ||
                b.votes - a.votes ||
                a.downvotes - b.downvotes
            );
          case 'trending':
            // Trending = net votes / hours since post
            const now = Date.now();
            return [...postsToSort].sort((a, b) => {
              const aScore = ((a.votes - a.downvotes)) / ((now - new Date(a.created_at).getTime()) / 3600000 + 1);
              const bScore = ((b.votes - b.downvotes)) / ((now - new Date(b.created_at).getTime()) / 3600000 + 1);
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
