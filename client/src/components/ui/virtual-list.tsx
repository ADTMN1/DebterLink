import * as ReactWindow from 'react-window';

type ListChildComponentProps = {
  index: number;
  style: React.CSSProperties;
};

// react-window uses CommonJS exports, access via namespace
const FixedSizeList = (ReactWindow as any).FixedSizeList;
import { cn } from '@/lib/utils';

interface VirtualListProps<T> {
  items: T[];
  height: number;
  itemHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
}

export function VirtualList<T>({ 
  items, 
  height, 
  itemHeight, 
  renderItem,
  className 
}: VirtualListProps<T>) {
  const Row = ({ index, style }: ListChildComponentProps) => (
    <div style={style} className={cn("border-b", className)}>
      {renderItem(items[index], index)}
    </div>
  );

  return (
    <FixedSizeList
      height={height}
      itemCount={items.length}
      itemSize={itemHeight}
      width="100%"
    >
      {Row}
    </FixedSizeList>
  );
}
