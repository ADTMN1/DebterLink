import { useCallback, KeyboardEvent } from 'react';

export function useTableKeyboard() {
  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLTableCellElement>) => {
    const cell = e.currentTarget;
    const row = cell.parentElement;
    const table = row?.closest('table');
    
    if (!row || !table) return;

    const cells = Array.from(row.children) as HTMLTableCellElement[];
    const rows = Array.from(table.querySelectorAll('tbody tr')) as HTMLTableRowElement[];
    
    const cellIndex = cells.indexOf(cell);
    const rowIndex = rows.indexOf(row);

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
  }, []);

  return { handleKeyDown };
}
