import { useParams, useNavigate } from "react-router-dom";
import { usePosts } from "@/hooks/usePosts";
import PostCard from "@/components/PostCard";
import Header from "@/components/Header";
import CommentModal from "@/components/CommentModal";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const PostPage = () => {
  const { postId } = useParams<{ postId: string }>();
  const { posts, isLoading, voteOnPost, addComment } = usePosts();
  const navigate = useNavigate();
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  
  const post = posts.find((p) => p.id === postId);
  
  const [currentPost, setCurrentPost] = useState(post);

  useEffect(() => {
    setCurrentPost(posts.find((p) => p.id === postId));
  }, [posts, postId]);

  const handleVote = (postId: string, voteType: "up" | "down") => {
    voteOnPost({ postId, voteType });
  };

  const handleSubmitComment = (postId: string, content: string) => {
    addComment({ postId, content });
  };

  if (isLoading && !post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl sm:text-7xl mb-4 animate-pulse">🇳🇬</div>
          <h2 className="text-xl sm:text-2xl font-bold text-green-600 mb-2">
            Loading Nigeria Story...
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            Just a moment, fetching this amazing tale...
          </p>
        </div>
      </div>
    );
  }

  if (!post && !isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="flex flex-col items-center justify-center text-center px-4 py-16 h-[calc(100vh-80px)]">
          <div className="text-6xl mb-4">😢</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Post not found</h2>
          <p className="text-gray-600 mb-6">
            The story you're looking for doesn't exist or may have been removed.
          </p>
          <Button
            onClick={() => navigate("/")}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Back to Home
          </Button>
        </main>
      </div>
    );
  }

  if (!currentPost) {
    return null; // Or a loading/not found state, though the above should catch it.
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/20 to-gray-50">
      <Header />
      <main className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-green-600 hover:text-green-800 mb-4 font-semibold px-0 hover:bg-transparent"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <PostCard
          post={currentPost}
          onVote={handleVote}
          onComment={() => setIsCommentModalOpen(true)}
          showComments={true}
          isLink={false}
        />
      </main>
      <CommentModal
        isOpen={isCommentModalOpen}
        onClose={() => setIsCommentModalOpen(false)}
        post={currentPost}
        onSubmitComment={handleSubmitComment}
      />
    </div>
  );
};

export default PostPage;
