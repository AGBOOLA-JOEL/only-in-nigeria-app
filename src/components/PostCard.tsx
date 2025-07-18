
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowUp, MessageCircle, Share2 } from "lucide-react";
import { Post } from "@/types/post";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface PostCardProps {
  post: Post;
  onVote: (postId: string, voteType: 'up') => void;
  onComment: (postId: string) => void;
  showComments?: boolean;
  isLink?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
  onOpenModal?: (post: Post) => void;
}

const PostCard = ({
  post,
  onVote,
  onComment,
  showComments = false,
  isLink = true,
  isFirst = false,
  isLast = false,
  onOpenModal,
}: PostCardProps) => {
  const formatTimeAgo = (timestampStr: string) => {
    const now = Date.now();
    const timestamp = new Date(timestampStr).getTime();
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

  const renderPosterName = () => {
    if (post.name && post.name.trim() !== "") {
      return (
        <span className="ml-2 text-xs font-semibold text-green-700 inline-flex items-center">
          <span className="bg-green-50 px-2 py-0.5 rounded border border-green-100 mr-1">&#128100;</span>
          {post.name}
        </span>
      );
    }
    return (
      <span className="ml-2 text-xs font-medium text-gray-400">(Anonymous)</span>
    );
  };

  const handleRootClick = (e: React.MouseEvent) => {
    if (onOpenModal) {
      const target = e.target as HTMLElement;
      if (
        target.closest("button") || 
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.tagName === "A"
      ) {
        return;
      }
      onOpenModal(post);
    }
  };

  return (
    <Card
      className={cn(
        // Revert to previous height and style values
        "flex justify-between items-stretch border border-gray-200 bg-white shadow-xs p-0 min-h-[110px] group transition-all duration-300 cursor-pointer select-none",
        "!rounded-none mx-0",
        "sm:rounded-none sm:mx-0",
        "md:mx-0 md:rounded-none",
        "lg:mx-auto",
        isFirst && "sm:rounded-t-xl",
        isLast && "sm:rounded-b-xl",
        "border-b-0",
        isLast && "border-b"
      )}
      style={{
        marginBottom: 0,
        borderBottomWidth: isLast ? undefined : 0,
      }}
      onClick={handleRootClick}
    >
      {/* Main Content */}
      <div className="flex-1 flex flex-col px-5 py-4 min-w-0">
        <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-tight mb-1 break-words line-clamp-2">
          {post.title}
          {renderPosterName()}
        </h3>
        <p className="text-sm sm:text-base text-gray-800 opacity-90 leading-relaxed break-words line-clamp-3 mb-2">
          {post.content}
        </p>
        <div className="flex gap-3 items-center text-xs">
          <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-400 font-semibold border border-gray-200">
            🇳🇬 Nigeria
          </span>
          <span className="text-gray-400/90">{formatTimeAgo(post.created_at)}</span>
        </div>
        <div className="flex gap-4 mt-3 pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onComment(post.id)}
            className="flex items-center gap-1 text-gray-500 hover:text-green-600 hover:bg-green-50 transition-colors text-xs px-2 py-1"
          >
            <MessageCircle className="w-3 h-3" />
            <span>{post.commentCount} {post.commentCount === 1 ? 'comment' : 'comments'}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="flex items-center gap-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors text-xs px-2 py-1"
          >
            <Share2 className="w-3 h-3" />
            <span className="hidden sm:inline">Share</span>
          </Button>
        </div>
        {/* Comments Section */}
        {showComments && post.comments && post.comments.length > 0 && (
          <div className="mt-4 space-y-3">
            {post.comments.map((comment) => (
              <div
                key={comment.id}
                className="bg-gray-50 p-3 rounded-lg border-l-2 border-green-200"
              >
                <p className="text-sm text-gray-700 break-words">
                  {comment.content}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  {formatTimeAgo(comment.created_at)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Upvote Section on Right */}
      <div className="flex flex-col items-center justify-center w-12 sm:w-14 px-2 sm:px-3 bg-white border-l border-gray-100">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onVote(post.id, 'up')}
          className={`mb-1 p-1 rounded-full ${
            post.userVote === 'up'
              ? 'text-green-700 bg-green-50'
              : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
          }`}
          aria-label="Upvote"
        >
          <ArrowUp className="w-5 h-5" />
        </Button>
        <span
          className={`block text-sm font-semibold text-center min-w-[24px] px-2 py-0.5 rounded ${
            post.votes > 0 ? 'text-green-700' : 'text-gray-400'
          }`}
        >
          {post.votes}
        </span>
      </div>
    </Card>
  );
};

export default PostCard;
