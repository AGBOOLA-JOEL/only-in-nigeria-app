
import { Button } from "@/components/ui/button";
import React from "react";

// Perfectly centered Nigerian flag SVG
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
          <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0 lg:ml-16" style={{ minHeight: "2.4rem" }}>
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
          {/* Desktop only: Powered by Supabase button */}
          <div className="hidden lg:flex flex-1 justify-end">
            <a
              href="https://supabase.com"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-8"
            >
              <Button
                variant="outline"
                size="sm"
                className="border-green-600 text-green-700 hover:bg-green-50"
                type="button"
              >
                Powered by
                <svg width="20" height="20" viewBox="0 0 48 48" className="ml-1" aria-label="Supabase logo">
                  <g>
                    <path d="M17.507 29.613c-.757 1.13-2.47.597-2.47-.762V6.79c0-1.246 1.52-1.917 2.36-.952L38.295 26.17c.779.893.14 2.288-1.03 2.288h-6.76c-.393 0-.762.197-.972.525l-2.2 3.402-9.826 15.18c-.758 1.172-2.53.593-2.53-.804v-7.687c0-.378.111-.747.32-1.063z" fill="#3FCF8E"/>
                  </g>
                </svg>
              </Button>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
