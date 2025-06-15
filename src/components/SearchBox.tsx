import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import React from "react";

interface SearchBoxProps {
  value: string;
  onChange: (v: string) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({ value, onChange }) => {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center bg-white border border-gray-300 rounded-md px-3 py-2">
        <Search className="text-gray-500 mr-2" size={18} />
        <input
          type="text"
          value={value}
          placeholder="Search"
          onChange={(e) => onChange(e.target.value)}
          className="bg-transparent outline-none text-sm w-24 sm:w-32 md:w-40"
        />
      </div>
    </div>
  );
};

export default SearchBox;
