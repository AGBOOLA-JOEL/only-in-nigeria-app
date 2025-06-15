import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import PostCard from '@/components/PostCard';
import CreatePostModal from '@/components/CreatePostModal';
import CommentModal from '@/components/CommentModal';
import SortTabs from '@/components/SortTabs';
import SearchBox from '@/components/SearchBox';
import { usePosts } from '@/hooks/usePosts';
import { Post } from '@/types/post';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const Index = () => {
  const { posts, isLoading, addPost, voteOnPost, addComment, sortPosts } = usePosts();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSort, setActiveSort] = useState<'new' | 'top' | 'trending'>('new');

  useEffect(() => {
    if (selectedPost) {
      const updatedPost = posts.find(p => p.id === selectedPost.id);
      setSelectedPost(updatedPost || null);
    }
  }, [posts, selectedPost]);

  const handleCreatePost = (title: string, content: string, name?: string) => {
    addPost({ title, content, name });
  };

  const handleVote = (postId: string, voteType: 'up') => {
    voteOnPost({ postId, voteType });
  };

  const handleComment = (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (post) {
      setSelectedPost(post);
      setIsCommentModalOpen(true);
    }
  };

  const handleSubmitComment = (postId: string, content: string) => {
    addComment({ postId, content });
  };

  // Filter and sort posts
  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const sortedPosts = sortPosts(filteredPosts, activeSort);

  if (isLoading && posts.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl sm:text-7xl mb-4 animate-pulse">🇳🇬</div>
          <h2 className="text-xl sm:text-2xl font-bold text-green-600 mb-2">Loading Nigeria Stories...</h2>
          <p className="text-gray-600 text-sm sm:text-base">Gathering the most interesting stories from across Nigeria</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f7fa] flex flex-col">
      <Header onCreatePost={() => setIsCreateModalOpen(true)} />
      <main className="flex-1 flex flex-col items-start w-full">
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 lg:pl-20 lg:pr-6">
          <div className="w-full lg:max-w-2xl">
            {/* Welcome Section */}
            <div className="mb-6 sm:mb-8 p-5 sm:p-8 border border-green-200 bg-green-50/80 rounded-xl shadow-md">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">
                Share your Nigerian story 🇳🇬
              </h2>
              <div className="space-y-3 text-gray-700 text-sm sm:text-base leading-relaxed">
                <p>
                  We love Nigeria ❤️
                </p>
                <p>
                  But we also experience many crazy and frustrating things we've never experienced anywhere else in the world. Experiences that just make you pull your hair out, or laugh in how completely absurd service interactions can be in Nigeria, with businesses, government services, or even just restaurants.
                </p>
                <p>
                  This board is a way to collect our stories to show there's a distinct pattern of unique interactions in this country, which is unlike the rest of the world.
                </p>
                <p>
                  Hopefully by collecting these stories, we can all learn and appreciate the uniqueness of Nigeria.
                </p>
                <p className="italic text-gray-600 pt-2">
                  "A dead thing can go with the stream, but only a living thing can go against it."
                </p>
                <p className="font-bold uppercase text-green-700 pt-2">
                  Posts are fully anonymous. Your email and username are not shared, ever.
                </p>
              </div>
            </div>

            {/* Filter row: SortTabs + SearchBox + Post Story (right) */}
            <div className="flex items-center gap-2 mb-6">
              <SortTabs activeSort={activeSort} onSortChange={setActiveSort} />
              <SearchBox
                value={searchTerm}
                onChange={setSearchTerm}
                onFilterClick={() => {/* Add filter modal logic here if needed */}}
              />
              <div className="flex-1" />
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center px-4 py-2 rounded-md bg-green-600 hover:bg-green-700 text-white text-sm shadow transition-all"
                type="button"
              >
                <Plus size={18} className="mr-2" />
                Post your Nigeria story
              </Button>
            </div>

            {/* Posts Container */}
            <div>
              {sortedPosts.length === 0 ? (
                <div className="text-center py-12 sm:py-16">
                  <div className="text-6xl sm:text-7xl mb-4">🇳🇬</div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
                    {searchTerm ? 'No stories found' : 'No stories yet'}
                  </h3>
                  <p className="text-gray-500 mb-6 text-sm sm:text-base max-w-md mx-auto">
                    {searchTerm 
                      ? 'Try adjusting your search terms or explore different topics' 
                      : 'Be the first to share a uniquely Nigerian experience! From Lagos traffic to Jollof rice debates - we want to hear it all!'
                    }
                  </p>
                  {!searchTerm && (
                    <button
                      onClick={() => setIsCreateModalOpen(true)}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base"
                    >
                      Share Your Story
                    </button>
                  )}
                </div>
              ) : (
                sortedPosts.map((post, idx) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onVote={handleVote}
                    onComment={handleComment}
                    isFirst={idx === 0}
                    isLast={idx === sortedPosts.length - 1}
                  />
                ))
              )}
            </div>
          </div>
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
