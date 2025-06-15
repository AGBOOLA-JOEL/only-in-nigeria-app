
import { Button } from "@/components/ui/button";
import React from "react";

// Inline SVG component for the Nigerian flag
const NigerianFlag = () => (
  <svg
    viewBox="0 0 48 32"
    width="40"
    height="28"
    aria-label="Nigerian flag"
    className="block"
    style={{ display: "block" }}
  >
    <rect width="48" height="32" rx="3" fill="#fff" />
    <rect x="0" y="0" width="13" height="32" fill="#198754" />
    <rect x="35" y="0" width="13" height="32" fill="#198754" />
    {/* Optional border for some extra style */}
    <rect width="48" height="32" rx="3" fill="none" stroke="#198754" strokeWidth="1"/>
  </svg>
);

interface HeaderProps {
  onCreatePost?: () => void;
}

const Header = ({ onCreatePost }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 bg-white/60 dark:bg-gray-900/50 backdrop-blur-sm border-b border-green-100 shadow-sm transition-all duration-200 py-4">
      <div className="w-full max-w-[96rem] mx-auto px-2 sm:px-4 lg:pl-24 lg:pr-8">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo and Flag */}
          <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0" style={{ minHeight: "2.4rem" }}>
            <span className="flex items-center h-full">
              {/* Nigerian flag SVG, perfectly centered and always renders */}
              <span className="flex items-center justify-center h-[1.7rem] w-[2.5rem] overflow-hidden bg-white rounded-sm border border-green-100 shadow-sm">
                <NigerianFlag />
              </span>
              <span className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600 whitespace-nowrap ml-2">
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
