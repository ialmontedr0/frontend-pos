//src/components/Table/types.ts
export interface Column<T> {
  header: string;
  accessor: keyof T;
  render?: (value: any, row: T) => React.ReactNode;
}

export interface Action<T> {
  label: string;
  onClick: (row: T) => void;
  render?: (row: T) => React.ReactNode;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  pageSizeOptions?: number[];
  defaultPageSize?: number;
  actions?: Action<T>[];
}
