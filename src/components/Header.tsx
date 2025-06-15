
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
    <header className="sticky top-0 z-50 bg-white/60 dark:bg-gray-900/50 backdrop-blur-sm border-b border-green-100 shadow-sm transition-all duration-200 py-4">
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
          
          {/* Twitter Icon Button + user name */}
          <div className="flex items-center space-x-2 ml-2">
            <a
              href="https://x.com/Juw_elle"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Connect with us on Twitter"
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
            {/* Username */}
            <span className="text-green-800 font-semibold text-[16px] sm:text-base">@Juw_elle</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

