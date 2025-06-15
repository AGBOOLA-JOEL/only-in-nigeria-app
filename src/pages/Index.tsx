
import { useState } from 'react';
import Header from '@/components/Header';
import PostCard from '@/components/PostCard';
import CreatePostModal from '@/components/CreatePostModal';
import CommentModal from '@/components/CommentModal';
import SortTabs from '@/components/SortTabs';
import { usePosts } from '@/hooks/usePosts';
import { Post } from '@/types/post';

const Index = () => {
  const { posts, isLoading, addPost, voteOnPost, addComment, sortPosts } = usePosts();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSort, setActiveSort] = useState<'new' | 'top' | 'trending'>('new');

  const handleCreatePost = (title: string, content: string) => {
    addPost(title, content);
  };

  const handleVote = (postId: string, voteType: 'up' | 'down') => {
    voteOnPost(postId, voteType);
  };

  const handleComment = (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (post) {
      setSelectedPost(post);
      setIsCommentModalOpen(true);
    }
  };

  const handleSubmitComment = (postId: string, content: string) => {
    addComment(postId, content);
  };

  // Filter and sort posts
  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const sortedPosts = sortPosts(filteredPosts, activeSort);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">🇳🇬</div>
          <h2 className="text-2xl font-bold text-green-600 mb-2">Loading Nigeria Stories...</h2>
          <p className="text-gray-600">Gathering the most interesting stories from across Nigeria</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onCreatePost={() => setIsCreateModalOpen(true)}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />
      
      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Only in Nigeria! 🇳🇬</h2>
          <p className="text-gray-600">Share your uniquely Nigerian experiences, stories, and observations. No authentication needed - just dive in and start sharing!</p>
        </div>

        <SortTabs activeSort={activeSort} onSortChange={setActiveSort} />
        
        <div className="space-y-4">
          {sortedPosts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🇳🇬</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                {searchTerm ? 'No stories found' : 'No stories yet'}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm 
                  ? 'Try adjusting your search terms' 
                  : 'Be the first to share a uniquely Nigerian experience!'
                }
              </p>
              {!searchTerm && (
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Share Your Story
                </button>
              )}
            </div>
          ) : (
            sortedPosts.map(post => (
              <PostCard
                key={post.id}
                post={post}
                onVote={handleVote}
                onComment={handleComment}
              />
            ))
          )}
        </div>
      </main>

      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreatePost}
      />

      <CommentModal
        isOpen={isCommentModalOpen}
        onClose={() => setIsCommentModalOpen(false)}
        post={selectedPost}
        onSubmitComment={handleSubmitComment}
      />
    </div>
  );
};

export default Index;
