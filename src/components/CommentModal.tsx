
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Post, Comment } from "@/types/post";

interface CommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post | null;
  onSubmitComment: (postId: string, content: string) => void;
}

const CommentModal = ({ isOpen, onClose, post, onSubmitComment }: CommentModalProps) => {
  const [commentContent, setCommentContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentContent.trim() && post) {
      onSubmitComment(post.id, commentContent.trim());
      setCommentContent("");
      onClose();
    }
  };

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

  if (!post) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl mx-auto m-4 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-green-600 flex items-center gap-2">
            💬 Comments
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Original Post */}
          <div className="bg-gradient-to-r from-green-50 to-green-50/50 p-4 rounded-lg border border-green-100">
            <h3 className="font-semibold text-gray-900 mb-2 text-base sm:text-lg break-words">
              {post.title}
            </h3>
            <p className="text-gray-700 mb-3 text-sm sm:text-base leading-relaxed break-words">
              {post.content}
            </p>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                🇳🇬 Nigeria
              </span>
              <span>{formatTimeAgo(post.timestamp)}</span>
            </div>
          </div>
          
          {/* Comments */}
          <div className="space-y-3 max-h-60 sm:max-h-80 overflow-y-auto">
            {post.comments && post.comments.length > 0 ? (
              post.comments.map((comment) => (
                <div key={comment.id} className="border-l-3 border-green-200 pl-4 py-2 bg-gray-50/50 rounded-r-lg">
                  <p className="text-gray-700 text-sm sm:text-base break-words leading-relaxed">
                    {comment.content}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">{formatTimeAgo(comment.timestamp)}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">💭</div>
                <p className="text-sm sm:text-base">No comments yet. Be the first to comment!</p>
              </div>
            )}
          </div>
          
          {/* Add Comment Form */}
          <form onSubmit={handleSubmit} className="space-y-3 pt-4 border-t border-gray-200">
            <Textarea
              placeholder="Share your thoughts on this Nigeria story..."
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              rows={3}
              className="resize-none border-gray-200 focus:border-green-300 focus:ring-green-200 text-sm sm:text-base"
            />
            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                className="border-gray-200 hover:bg-gray-50 order-2 sm:order-1"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 order-1 sm:order-2"
                disabled={!commentContent.trim()}
              >
                Add Comment
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentModal;
