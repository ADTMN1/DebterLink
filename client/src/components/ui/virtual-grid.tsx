import { memo } from 'react';
import { FixedSizeGrid, GridChildComponentProps } from 'react-window';

interface VirtualGridProps<T> {
  items: T[];
  columnCount: number;
  height: number;
  rowHeight: number;
  columnWidth: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
}

export const VirtualGrid = memo(function VirtualGrid<T>({
  items,
  columnCount,
  height,
  rowHeight,
  columnWidth,
  renderItem,
  className,
}: VirtualGridProps<T>) {
  const rowCount = Math.ceil(items.length / columnCount);

  const Cell = ({ columnIndex, rowIndex, style }: GridChildComponentProps) => {
    const index = rowIndex * columnCount + columnIndex;
    if (index >= items.length) return null;
    
    return (
      <div style={style} className="p-2">
        {renderItem(items[index], index)}
      </div>
    );
  };

  return (
    <FixedSizeGrid
      columnCount={columnCount}
      columnWidth={columnWidth}
      height={height}
      rowCount={rowCount}
      rowHeight={rowHeight}
      width="100%"
      className={className}
    >
      {Cell}
    </FixedSizeGrid>
  );
}) as <T>(props: VirtualGridProps<T>) => JSX.Element;
