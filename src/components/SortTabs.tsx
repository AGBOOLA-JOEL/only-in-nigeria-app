
import { Button } from "@/components/ui/button";

interface SortTabsProps {
  activeSort: 'new' | 'top' | 'trending';
  onSortChange: (sort: 'new' | 'top' | 'trending') => void;
}

const SortTabs = ({ activeSort, onSortChange }: SortTabsProps) => {
  const tabs = [
    { key: 'new' as const, label: '🆕 New', shortLabel: 'New' },
    { key: 'top' as const, label: '⭐ Top', shortLabel: 'Top' },
    { key: 'trending' as const, label: '🔥 Trending', shortLabel: 'Hot' }
  ];

  return (
    <div className="flex gap-1 mb-4 sm:mb-6 overflow-x-auto pb-1">
      {tabs.map((tab) => (
        <Button
          key={tab.key}
          variant={activeSort === tab.key ? 'default' : 'ghost'}
          onClick={() => onSortChange(tab.key)}
          className={`whitespace-nowrap text-xs sm:text-sm px-3 sm:px-4 py-2 transition-all duration-200 ${
            activeSort === tab.key
              ? 'bg-green-600 hover:bg-green-700 text-white shadow-md'
              : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
          }`}
        >
          <span className="hidden sm:inline">{tab.label}</span>
          <span className="sm:hidden">{tab.shortLabel}</span>
        </Button>
      ))}
    </div>
  );
};

export default SortTabs;
