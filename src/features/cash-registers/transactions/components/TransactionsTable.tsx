import { useNavigate } from 'react-router-dom';
import moment from 'moment';

import type { Column, Action } from '../../../../components/Table/types';
import { Table } from '../../../../components/Table/Table';
import type { Transaction } from '../../interfaces/TransactionInterface';
import { parseTransactionType } from '../../../../utils/commonFunctions';
import Spinner from '../../../../components/UI/Spinner/Spinner';

interface TransactionsTableProps {
  data: Transaction[] | [];
  loading: boolean;
  error: string;
}

export const TransactionsTable: React.FC<TransactionsTableProps> = ({ data, loading, error }) => {
  const navigate = useNavigate();

  const transactionsColumns: Column<Transaction>[] = [
    {
      header: 'Tipo',
      accessor: 'tipo',
      render: (value: string) => `${parseTransactionType(value)}`,
    },
    {
      header: 'Usuario',
      accessor: 'usuario',
      render: (value: { _id: string; usuario: string }) => (value ? value.usuario : '-'),
    },
    { header: 'Monto', accessor: 'monto', render: (value: number) => `RD$ ${value.toFixed(2)}` },
    {
      header: 'Fecha',
      accessor: 'fecha',
      render: (value: string) => `${moment(value).format('DD/MM/YYYY')}`,
    },
  ];

  const transactionsActions: Action<Transaction>[] = [
    { label: 'Ver', onClick: (t) => navigate(`/transactions/${t._id}`) },
  ];

  return (
    <>
      <div className="p-6">
        <div className="flex flex-col gap-4">
          <h2 className="text-3xl font-semibold">Transacciones</h2>
        </div>

        {loading && <Spinner />}

        {error && <div className="text-red-500">Error: {error}</div>}

        {data ? (
          <Table
            data={data}
            columns={transactionsColumns}
            actions={transactionsActions}
            pageSizeOptions={[5, 10, 20]}
            defaultPageSize={10}
          />
        ) : (
          <div>No hay transacciones en el sistema</div>
        )}
      </div>
    </>
  );
};
