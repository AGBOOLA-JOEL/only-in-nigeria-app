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
