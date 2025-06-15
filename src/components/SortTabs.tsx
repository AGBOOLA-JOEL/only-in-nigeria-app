
import { Button } from "@/components/ui/button";
import { Clock, TrendingUp, Flame } from "lucide-react";
import React from "react";

interface SortTabsProps {
  activeSort: 'new' | 'top' | 'trending';
  onSortChange: (sort: 'new' | 'top' | 'trending') => void;
}

const tabData = [
  {
    key: 'new' as const,
    label: 'New',
    icon: <Clock size={18} className="mr-1" />
  },
  {
    key: 'top' as const,
    label: 'Top',
    icon: <TrendingUp size={18} className="mr-1" />
  },
  {
    key: 'trending' as const,
    label: 'Trending',
    icon: <Flame size={18} className="mr-1" />
  }
];

const SortTabs: React.FC<SortTabsProps> = ({ activeSort, onSortChange }) => {
  return (
    <div className="flex gap-2">
      {tabData.map((tab) => (
        <Button
          key={tab.key}
          variant={activeSort === tab.key ? "secondary" : "outline"}
          size="sm"
          className={`font-medium px-4 py-2 flex items-center rounded-md ${
            activeSort === tab.key
              ? "bg-gray-100 text-gray-800"
              : "bg-white text-gray-600 border border-gray-300"
          }`}
          onClick={() => onSortChange(tab.key)}
          type="button"
        >
          {tab.icon}
          {tab.label}
        </Button>
      ))}
    </div>
  );
};

export default SortTabs;
