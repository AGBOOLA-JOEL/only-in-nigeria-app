
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
      return `${minutes} minutes ago`;
    } else if (hours < 24) {
      return `About ${hours} hours ago`;
    } else {
      const days = Math.floor(hours / 24);
      return `${days} days ago`;
    }
  };

  if (!post) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-green-600">Comments</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Original Post */}
          <div className="bg-gray-50 p-4 rounded">
            <h3 className="font-semibold text-gray-900 mb-2">{post.title}</h3>
            <p className="text-gray-700 mb-2">{post.content}</p>
            <p className="text-sm text-gray-500">🇳🇬 Nigeria • {formatTimeAgo(post.timestamp)}</p>
          </div>
          
          {/* Comments */}
          <div className="space-y-3">
            {post.comments && post.comments.length > 0 ? (
              post.comments.map((comment) => (
                <div key={comment.id} className="border-l-2 border-green-200 pl-4 py-2">
                  <p className="text-gray-700">{comment.content}</p>
                  <p className="text-xs text-gray-500 mt-1">{formatTimeAgo(comment.timestamp)}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No comments yet. Be the first to comment!</p>
            )}
          </div>
          
          {/* Add Comment Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <Textarea
              placeholder="Add your comment..."
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              rows={3}
              className="resize-none"
            />
            <div className="flex justify-end space-x-3">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-green-600 hover:bg-green-700"
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
