
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Post } from "@/types/post";
import { Button } from "@/components/ui/button";
import { ArrowUp, MessageCircle, Share2 } from "lucide-react";
import { toast } from "sonner";
import * as React from "react";

interface PostModalProps {
  open: boolean;
  onClose: () => void;
  post: Post | null;
  onVote: (postId: string, voteType: "up") => void;
  onComment: (postId: string) => void;
}

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

export default function PostModal({
  open,
  onClose,
  post,
  onVote,
  onComment,
}: PostModalProps) {
  if (!post) return null;

  const handleShare = () => {
    const postUrl = `${window.location.origin}/post/${post.id}`;
    navigator.clipboard.writeText(postUrl).then(
      () => toast.success("Link copied to clipboard!"),
      (err) => {
        console.error("Could not copy text: ", err);
        toast.error("Failed to copy link.");
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent
        className="w-full max-w-2xl rounded-2xl px-0 py-0 shadow-2xl border-none overflow-hidden bg-white"
        style={{ maxHeight: "95vh" }}
      >
        <div className="flex flex-col sm:flex-row w-full h-full">
          {/* Main Content */}
          <div className="flex-1 flex flex-col p-6 min-w-0">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {post.title}
              {post.name 
                ? <span className="ml-2 text-xs font-semibold text-green-700 inline-flex items-center">
                    <span className="bg-green-50 px-2 py-0.5 rounded border border-green-100 mr-1">&#128100;</span>
                    {post.name}
                  </span>
                : <span className="ml-2 text-xs font-medium text-gray-400">(Anonymous)</span>
              }
            </h3>
            <p className="text-base text-gray-800 opacity-95 leading-relaxed mb-3 whitespace-pre-line break-words">
              {post.content}
            </p>
            <div className="flex gap-3 items-center text-xs mb-3">
              <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-400 font-semibold border border-gray-200">
                🇳🇬 Nigeria
              </span>
              <span className="text-gray-400/90">{formatTimeAgo(post.created_at)}</span>
            </div>
            <div className="flex gap-4 pt-2">
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
            {/* Comments Preview Section */}
            {post.comments && post.comments.length > 0 && (
              <div className="mt-6 space-y-3 max-h-[200px] overflow-y-auto pr-2">
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
          {/* Upvote/Sidebar (always to right even mobile for modal) */}
          <div className="flex flex-row sm:flex-col items-center sm:items-center justify-end sm:justify-center w-full sm:w-20 px-3 py-4 sm:py-0 border-t sm:border-t-0 sm:border-l border-gray-100 gap-4 bg-white">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onVote(post.id, "up")}
              className={`p-1 rounded-full ${
                post.userVote === "up"
                  ? "text-green-700 bg-green-50"
                  : "text-gray-400 hover:text-green-600 hover:bg-green-50"
              }`}
              aria-label="Upvote"
            >
              <ArrowUp className="w-5 h-5" />
            </Button>
            <span
              className={`text-sm font-semibold text-center min-w-[24px] px-2 py-0.5 rounded ${
                post.votes > 0 ? "text-green-700" : "text-gray-400"
              }`}
            >
              {post.votes}
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
