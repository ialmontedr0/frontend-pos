import { useState, useMemo } from 'react';
import type { DataTableProps } from './types';

export function Table<T extends { [key: string]: any }>({
  columns,
  data,
  pageSizeOptions = [5, 10, 20],
  defaultPageSize = 5,
  actions = [],
}: DataTableProps<T>) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const pageCount = Math.ceil(data.length / pageSize);
  const pagedData = useMemo(
    () => data.slice((page - 1) * pageSize, page * pageSize),
    [data, page, pageSize]
  );

  const goToPage = (p: number) => {
    if (p < 1 || p > pageCount) return;
    setPage(p);
  };

  return (
    <div className="overflow-x-auto bg-white dark:bg-slate-800 shadow-lg rounded-lg">
      <table className="min-w-full table-fixed divide-y divide-slate-200 dark:divide-slate-700">
        <thead className="bg-slate-100 dark:bg-slate-900 sicky top-0 z-10">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.accessor)}
                scope="col"
                className="
                  px-4 py-2 text-left text-xs font-semibold 
                  text-slate-600 dark:text-slate-400 
                  uppercase tracking-wider"
              >
                {col.header}
              </th>
            ))}
            {actions.length > 0 && (
              <th
                scope="col"
                className="px-4 py-2 text-xs font-semibold text-gray-600 dark:text-slate-400 uppercase tracking-wider"
              >
                Acciones
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
          {pagedData.map((row, index) => (
            <tr
              key={index}
              className={`
                transition-shadow
                ${
                  index % 2 === 0 ? 'bg-white dark:bg-slate-800' : 'bg-slate-50 dark:bg-slate-700'
                } hover:bg-slate-100 dark:hover:bg-slate-600`}
            >
              {columns.map((col) => (
                <td
                  key={String(col.accessor)}
                  className="px-4 py-3 whitespace-nowrap text-sm text-slate-800 dark:text-slate-200"
                >
                  {col.render ? col.render(row[col.accessor], row) : String(row[col.accessor])}
                </td>
              ))}
              {actions.length > 0 && (
                <td className="px-4 py-3 whitespace-nowrap flex space-x-2">
                  {actions.map((act, i) => (
                    <button
                      key={i}
                      onClick={() => act.onClick(row)}
                      className="
                        px-2 py-1 rounded-full text-xs font-medium 
                        bg-indigo-500 hover:bg-indigo-600 text-white 
                        focus:ouline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-400"
                    >
                      {act.render ? act.render(row) : act.label}
                    </button>
                  ))}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700">
        <div>
          <button
            onClick={() => goToPage(page - 1)}
            disabled={page === pageCount}
            className="px-3 py-1 mx-1 bg-white dark:bg-slate-800 border rounded disabled:opacity-50"
          >
            « Anterior
          </button>
          <span className="text-sm text-slate-700 dark:text-slate-300">
            Pagina {page} de {pageCount}
          </span>
          <button
            onClick={() => goToPage(page + 1)}
            disabled={page === pageCount}
            className="px-3 py-1 mx-1 bg-white dark:bg-slate-800 border rounded disabled:opacity-50"
          >
            Siguiente »
          </button>
        </div>
        <div>
          <label className="text-sm text-slate-700 dark:text-slate-300">
            Filas por pagina:{' '}
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              className="ml-2 bg-white dark:bg-slate-800 border text-sm rounded"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
    </div>
  );
}
