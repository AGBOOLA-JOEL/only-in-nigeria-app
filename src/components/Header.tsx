
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import React from "react";

interface HeaderProps {
  onCreatePost?: () => void;
}

const NIGERIAN_FLAG_SRC =
  "data:image/jpeg;base64,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";

const Header = ({ onCreatePost }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 bg-white/60 dark:bg-gray-900/50 backdrop-blur-sm border-b border-green-100 shadow-sm transition-all duration-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:pl-20 lg:pr-6 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo and Flag */}
          <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
            <span className="flex items-center">
              {/* Nigerian flag image on the left of the title */}
              <img
                src={NIGERIAN_FLAG_SRC}
                alt="Nigerian flag"
                className="w-7 h-5 sm:w-9 sm:h-6 object-cover rounded-sm mr-2"
                style={{ boxShadow: "0 0 2px rgba(0,0,0,0.06)" }}
              />
              <span className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600 whitespace-nowrap">
                Only in Nigeria
              </span>
            </span>
          </div>

          {/* Create Post Button */}
          {onCreatePost && (
            <Button 
              onClick={onCreatePost} 
              className="bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 text-xs sm:text-sm px-2 sm:px-4 py-2 whitespace-nowrap"
            >
              <Plus className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
              <span className="hidden sm:inline">Post Story</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

