import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronUp, ChevronDown, MessageCircle, Share2 } from "lucide-react";
import { Post } from "@/types/post";
import { toast } from "sonner";
import { Link } from "react-router-dom";

interface PostCardProps {
  post: Post;
  onVote: (postId: string, voteType: 'up' | 'down') => void;
  onComment: (postId: string) => void;
  showComments?: boolean;
  isLink?: boolean;
}

const PostCard = ({ post, onVote, onComment, showComments = false, isLink = true }: PostCardProps) => {
  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      const days = Math.floor(hours / 24);
      return `${days}d ago`;
    }
  };

  const handleShare = () => {
    const postUrl = `${window.location.origin}/post/${post.id}`;
    navigator.clipboard.writeText(postUrl).then(
      () => {
        toast.success("Link copied to clipboard!");
      },
      (err) => {
        console.error("Could not copy text: ", err);
        toast.error("Failed to copy link.");
      }
    );
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-green-200 bg-white">
      <div className="flex gap-2 sm:gap-3 p-3 sm:p-4">
        {/* Vote Section */}
        <div className="flex flex-col items-center gap-1 flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onVote(post.id, 'up')}
            className={`p-1 hover:bg-green-50 transition-colors ${
              post.userVote === 'up' ? 'text-green-600 bg-green-50' : 'text-gray-400 hover:text-green-600'
            }`}
          >
            <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
          <span className={`text-xs sm:text-sm font-semibold px-1 py-0.5 rounded min-w-[24px] text-center ${
            post.votes > 0 ? 'text-green-600' : post.votes < 0 ? 'text-red-600' : 'text-gray-600'
          }`}>
            {post.votes}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onVote(post.id, 'down')}
            className={`p-1 hover:bg-red-50 transition-colors ${
              post.userVote === 'down' ? 'text-red-600 bg-red-50' : 'text-gray-400 hover:text-red-600'
            }`}
          >
            <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
        </div>
        
        {/* Content Section */}
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 leading-tight break-words">
            {isLink ? (
              <Link to={`/post/${post.id}`} className="hover:underline">
                {post.title}
              </Link>
            ) : (
              post.title
            )}
          </h3>
          <p className="text-sm sm:text-base text-gray-700 mb-3 leading-relaxed break-words line-clamp-3">
            {post.content}
          </p>
          
          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
            <span className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-full font-medium">
              🇳🇬 Nigeria
            </span>
            <span className="whitespace-nowrap">{formatTimeAgo(post.timestamp)}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1 sm:gap-3 mt-3 pt-3 border-t border-gray-100">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onComment(post.id)}
              className="flex items-center gap-1 sm:gap-2 text-gray-500 hover:text-green-600 hover:bg-green-50 transition-colors text-xs sm:text-sm px-2 sm:px-3 py-1"
            >
              <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>{post.commentCount} {post.commentCount === 1 ? 'comment' : 'comments'}</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleShare}
              className="flex items-center gap-1 sm:gap-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors text-xs sm:text-sm px-2 sm:px-3 py-1"
            >
              <Share2 className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Share</span>
            </Button>
          </div>
          
          {/* Comments Section */}
          {showComments && post.comments && post.comments.length > 0 && (
            <div className="mt-4 space-y-3">
              {post.comments.map((comment) => (
                <div key={comment.id} className="bg-gray-50 p-3 rounded-lg border-l-2 border-green-200">
                  <p className="text-sm text-gray-700 break-words">{comment.content}</p>
                  <p className="text-xs text-gray-500 mt-2">{formatTimeAgo(comment.timestamp)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default PostCard;
