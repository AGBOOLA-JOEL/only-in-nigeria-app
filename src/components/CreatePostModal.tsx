
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, content: string) => void;
}

const CreatePostModal = ({ isOpen, onClose, onSubmit }: CreatePostModalProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && content.trim()) {
      onSubmit(title.trim(), content.trim());
      setTitle("");
      setContent("");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl mx-auto m-4 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-green-600 text-lg sm:text-xl flex items-center gap-2">
            🇳🇬 Share your Nigeria story
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              placeholder="What's happening in Nigeria?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-base sm:text-lg border-gray-200 focus:border-green-300 focus:ring-green-200"
            />
          </div>
          
          <div>
            <Textarea
              placeholder="Tell us more about this story... Share your experiences, observations, or anything uniquely Nigerian! 🇳🇬"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              className="resize-none border-gray-200 focus:border-green-300 focus:ring-green-200 text-sm sm:text-base"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
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
              disabled={!title.trim() || !content.trim()}
            >
              Post Story
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostModal;
