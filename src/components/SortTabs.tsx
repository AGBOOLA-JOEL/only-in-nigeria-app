
import { Button } from "@/components/ui/button";

interface SortTabsProps {
  activeSort: 'new' | 'top' | 'trending';
  onSortChange: (sort: 'new' | 'top' | 'trending') => void;
}

const SortTabs = ({ activeSort, onSortChange }: SortTabsProps) => {
  return (
    <div className="flex space-x-1 mb-6">
      <Button
        variant={activeSort === 'new' ? 'default' : 'ghost'}
        onClick={() => onSortChange('new')}
        className={activeSort === 'new' ? 'bg-green-600 hover:bg-green-700' : ''}
      >
        🆕 New
      </Button>
      <Button
        variant={activeSort === 'top' ? 'default' : 'ghost'}
        onClick={() => onSortChange('top')}
        className={activeSort === 'top' ? 'bg-green-600 hover:bg-green-700' : ''}
      >
        ⭐ Top
      </Button>
      <Button
        variant={activeSort === 'trending' ? 'default' : 'ghost'}
        onClick={() => onSortChange('trending')}
        className={activeSort === 'trending' ? 'bg-green-600 hover:bg-green-700' : ''}
      >
        🔥 Trending
      </Button>
    </div>
  );
};

export default SortTabs;
