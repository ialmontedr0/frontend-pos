import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import type { RootState } from '../../../store/store';

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '../../../components/Table/TableNew/Table';
import Badge from '../../../components/UI/Badge/Badge';

import type { Sale } from '../interfaces/SaleInterface';
import { parsePaymentMethod } from '../../../utils/commonFunctions';
import { getAllSales } from '../slices/salesSlice';

export const RecentSales: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { sales } = useAppSelector((state: RootState) => state.sales);
  const tableData: Sale[] = sales;

  useEffect(() => {
    dispatch(getAllSales());
  }, []);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Ventas recientes
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            <svg
              className="stroke-current fill-white dark:fill-gray-800"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.29004 5.90393H17.7067"
                stroke=""
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M17.7075 14.0961H2.29085"
                stroke=""
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12.0826 3.33331C13.5024 3.33331 14.6534 4.48431 14.6534 5.90414C14.6534 7.32398 13.5024 8.47498 12.0826 8.47498C10.6627 8.47498 9.51172 7.32398 9.51172 5.90415C9.51172 4.48432 10.6627 3.33331 12.0826 3.33331Z"
                fill=""
                stroke=""
                strokeWidth="1.5"
              />
              <path
                d="M7.91745 11.525C6.49762 11.525 5.34662 12.676 5.34662 14.0959C5.34661 15.5157 6.49762 16.6667 7.91745 16.6667C9.33728 16.6667 10.4883 15.5157 10.4883 14.0959C10.4883 12.676 9.33728 11.525 7.91745 11.525Z"
                fill=""
                stroke=""
                strokeWidth="1.5"
              />
            </svg>
            Filtros
          </button>
          <button
            onClick={() => navigate('/sales')}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
          >
            Ver mas
          </button>
        </div>
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
              <TableRow>
                <TableCell
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  isHeader
                >
                  Venta
                </TableCell>
                <TableCell
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  isHeader
                >
                  Usuario
                </TableCell>
                <TableCell
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  isHeader
                >
                  Cliente
                </TableCell>
                <TableCell
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  isHeader
                >
                  Estado
                </TableCell>
                <TableCell
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  isHeader
                >
                  Metodo Pago
                </TableCell>
                <TableCell
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  isHeader
                >
                  Total
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
              {tableData.map((sale) => (
                <TableRow key={sale._id}>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {sale.codigo}
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {sale.usuario.usuario}
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {sale.cliente.nombre}
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {sale.estado === 'completada' ? (
                      <Badge color="success">Completada</Badge>
                    ) : (
                      <Badge color="error">Pendiente</Badge>
                    )}
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {parsePaymentMethod(sale.metodoPago)}
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    RD$ {sale.totalVenta.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};
