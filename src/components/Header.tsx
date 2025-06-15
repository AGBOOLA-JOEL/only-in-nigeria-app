import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import React from "react";

interface HeaderProps {
  onCreatePost?: () => void;
}

const NIGERIAN_FLAG_SRC =
  "data:image/jpeg;base64,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...

const Header = ({ onCreatePost }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 bg-white/60 dark:bg-gray-900/50 backdrop-blur-sm border-b border-green-100 shadow-sm transition-all duration-200">
      <div className="w-full max-w-[96rem] mx-auto px-2 sm:px-4 lg:pl-24 lg:pr-8">
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
          
          {/* Twitter Icon Button */}
          <a
            href="https://x.com/Juw_elle"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Connect with us on Twitter"
            className="ml-2"
          >
            <Button 
              variant="ghost"
              className="p-2 rounded-full hover:bg-green-50 text-green-600"
              type="button"
            >
              {/* Only allowed icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={22}
                height={22}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-twitter"
              >
                <path d="M22 4.01c-.75.35-1.54.59-2.36.7A4.1 4.1 0 0 0 21.5 2.1a8.18 8.18 0 0 1-2.63 1A4.09 4.09 0 0 0 12 7.57a11.6 11.6 0 0 1-8.4-4.26A4.11 4.11 0 0 0 3.1 8a4.07 4.07 0 0 1-1.85-.51v.05A4.1 4.1 0 0 0 4.08 11a4.07 4.07 0 0 1-1.84.07 4.1 4.1 0 0 0 3.81 2.83A8.23 8.23 0 0 1 2 17.51a11.61 11.61 0 0 0 6.29 1.84c7.54 0 11.67-6.25 11.67-11.67 0-.18 0-.37-.01-.55A8.36 8.36 0 0 0 22 4.01Z" />
              </svg>
              <span className="sr-only">Twitter</span>
            </Button>
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
