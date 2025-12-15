import * as React from "react"
import { memo } from "react"

import { cn } from "@/lib/utils"

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement> & { 'aria-label'?: string }
>(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table
      ref={ref}
      className={cn("w-full caption-bottom text-sm", className)}
      role="table"
      {...props}
    />
  </div>
))
Table.displayName = "Table"

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
))
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
))
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
      className
    )}
    {...props}
  />
))
TableFooter.displayName = "TableFooter"

const TableRow = memo(React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b transition-colors hover:bg-accent/50 data-[state=selected]:bg-muted even:bg-muted/30",
      className
    )}
    {...props}
  />
)))
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-10 px-4 text-left align-middle text-sm font-medium uppercase tracking-wider text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className
    )}
    {...props}
  />
))
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, onKeyDown, ...props }, ref) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTableCellElement>) => {
    const cell = e.currentTarget;
    const row = cell.parentElement;
    if (!row) return;

    const cells = Array.from(row.children) as HTMLTableCellElement[];
    const table = row.closest('table');
    const rows = table ? Array.from(table.querySelectorAll('tbody tr')) as HTMLTableRowElement[] : [];
    
    const cellIndex = cells.indexOf(cell);
    const rowIndex = rows.indexOf(row as HTMLTableRowElement);

    let targetCell: HTMLTableCellElement | null = null;

    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault();
        targetCell = cells[cellIndex + 1] as HTMLTableCellElement;
        break;
      case 'ArrowLeft':
        e.preventDefault();
        targetCell = cells[cellIndex - 1] as HTMLTableCellElement;
        break;
      case 'ArrowDown':
        e.preventDefault();
        targetCell = rows[rowIndex + 1]?.children[cellIndex] as HTMLTableCellElement;
        break;
      case 'ArrowUp':
        e.preventDefault();
        targetCell = rows[rowIndex - 1]?.children[cellIndex] as HTMLTableCellElement;
        break;
      case 'Home':
        e.preventDefault();
        targetCell = cells[0] as HTMLTableCellElement;
        break;
      case 'End':
        e.preventDefault();
        targetCell = cells[cells.length - 1] as HTMLTableCellElement;
        break;
    }

    targetCell?.focus();
    onKeyDown?.(e);
  };

  return (
    <td
      ref={ref}
      tabIndex={0}
      className={cn(
        "p-4 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1",
        className
      )}
      onKeyDown={handleKeyDown}
      {...props}
    />
  );
})
TableCell.displayName = "TableCell"

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
))
TableCaption.displayName = "TableCaption"

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
