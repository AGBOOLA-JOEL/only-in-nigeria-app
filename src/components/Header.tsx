
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import { useState } from "react";

interface HeaderProps {
  onCreatePost?: () => void;
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
}

const Header = ({ onCreatePost, searchTerm, onSearchChange }: HeaderProps) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-green-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo and Search */}
          <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600 whitespace-nowrap">
              🇳🇬 Only in Nigeria
            </h1>
            
            {/* Desktop Search */}
            {onSearchChange && (
              <div className="relative hidden md:flex flex-1 max-w-md lg:max-w-lg">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search Nigeria stories..."
                  value={searchTerm || ''}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-10 w-full bg-gray-50/50 border-gray-200 focus:border-green-300 focus:ring-green-200"
                />
              </div>
            )}

            {/* Mobile Search Toggle */}
            {onSearchChange && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="md:hidden p-2"
              >
                <Search className="w-4 h-4" />
              </Button>
            )}
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

        {/* Mobile Search */}
        {isSearchOpen && onSearchChange && (
          <div className="mt-3 md:hidden animate-fade-in">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search Nigeria stories..."
                value={searchTerm || ''}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 w-full bg-gray-50/50 border-gray-200 focus:border-green-300 focus:ring-green-200"
                autoFocus
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
