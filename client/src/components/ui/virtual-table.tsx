import { memo } from 'react';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import { Table, TableBody, TableHead, TableHeader, TableRow } from './table';

interface Column<T> {
  key: string;
  header: string;
  render: (item: T) => React.ReactNode;
  width?: string;
}

interface VirtualTableProps<T> {
  data: T[];
  columns: Column<T>[];
  height?: number;
  rowHeight?: number;
  className?: string;
}

export const VirtualTable = memo(function VirtualTable<T>({
  data,
  columns,
  height = 600,
  rowHeight = 60,
  className,
}: VirtualTableProps<T>) {
  const Row = ({ index, style }: ListChildComponentProps) => {
    const item = data[index];
    return (
      <TableRow style={style} className="flex">
        {columns.map((column) => (
          <td
            key={column.key}
            className="p-4 align-middle flex-1"
            style={{ width: column.width }}
          >
            {column.render(item)}
          </td>
        ))}
      </TableRow>
    );
  };

  return (
    <div className={className}>
      <Table>
        <TableHeader className="sticky top-0 z-10 bg-background">
          <TableRow className="flex">
            {columns.map((column) => (
              <TableHead
                key={column.key}
                className="flex-1"
                style={{ width: column.width }}
              >
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
      </Table>
      <FixedSizeList
        height={height}
        itemCount={data.length}
        itemSize={rowHeight}
        width="100%"
      >
        {Row}
      </FixedSizeList>
    </div>
  );
}) as <T>(props: VirtualTableProps<T>) => JSX.Element;
