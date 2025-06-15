
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronUp, ChevronDown, MessageCircle, Share2 } from "lucide-react";
import { Post } from "@/types/post";

interface PostCardProps {
  post: Post;
  onVote: (postId: string, voteType: 'up' | 'down') => void;
  onComment: (postId: string) => void;
  showComments?: boolean;
}

const PostCard = ({ post, onVote, onComment, showComments = false }: PostCardProps) => {
  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (minutes < 60) {
      return `${minutes} minutes ago`;
    } else if (hours < 24) {
      return `About ${hours} hours ago`;
    } else {
      const days = Math.floor(hours / 24);
      return `${days} days ago`;
    }
  };

  return (
    <Card className="p-4 mb-4 hover:shadow-md transition-shadow">
      <div className="flex space-x-3">
        <div className="flex flex-col items-center space-y-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onVote(post.id, 'up')}
            className={`p-1 ${post.userVote === 'up' ? 'text-green-600' : 'text-gray-400'}`}
          >
            <ChevronUp className="w-6 h-6" />
          </Button>
          <span className="text-sm font-semibold text-gray-700">{post.votes}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onVote(post.id, 'down')}
            className={`p-1 ${post.userVote === 'down' ? 'text-red-600' : 'text-gray-400'}`}
          >
            <ChevronDown className="w-6 h-6" />
          </Button>
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{post.title}</h3>
          <p className="text-gray-700 mb-3">{post.content}</p>
          
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span>🇳🇬 Nigeria</span>
            <span>{formatTimeAgo(post.timestamp)}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onComment(post.id)}
              className="flex items-center space-x-1 text-gray-500 hover:text-gray-700"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{post.commentCount} comments</span>
            </Button>
            <Button variant="ghost" size="sm" className="flex items-center space-x-1 text-gray-500 hover:text-gray-700">
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </Button>
          </div>
          
          {showComments && post.comments && post.comments.length > 0 && (
            <div className="mt-4 pl-4 border-l-2 border-gray-200 space-y-3">
              {post.comments.map((comment) => (
                <div key={comment.id} className="bg-gray-50 p-3 rounded">
                  <p className="text-gray-700">{comment.content}</p>
                  <p className="text-xs text-gray-500 mt-1">{formatTimeAgo(comment.timestamp)}</p>
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
