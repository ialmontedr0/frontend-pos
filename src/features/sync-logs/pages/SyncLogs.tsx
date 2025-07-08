import { useNavigate } from 'react-router-dom';
import type { Column, Action } from '../../../components/Table/types';
import { Table } from '../../../components/Table/Table';
import type { SyncLog } from '../interfaces/SyncLogInterface';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Button from '../../../components/UI/Button/Button';
import { BiArrowBack } from 'react-icons/bi';

export const SyncLogs: React.FC = () => {
  const navigate = useNavigate();
  const loading: boolean = false;

  const syncLogs: SyncLog[] = [
    {
      _id: '1',
      acciones: {},
      clienteTempId: '1',
      resuelto: false,
      createdBy: { _id: '1', usuario: 'test' },
      createdAt: '01/01/2025',
      updatedAt: '01/01/2025',
      resolvedBy: { _id: '1', usuario: 'test' },
    },
  ];

  let syncLogsData: SyncLog[] = syncLogs;

  const syncLogsColumns: Column<SyncLog>[] = [
    { header: 'Cliente Temporal', accessor: 'clienteTempId' },
    {
      header: 'Estado',
      accessor: 'resuelto',
      render: (value: string) => `${value === 'true' ? 'Resuelto' : 'Pendiente'}`,
    },
    {
      header: 'Creado por',
      accessor: 'createdBy',
      render: (value: { _id: string; usuario: string }) => (value ? value.usuario : '-'),
    },
    {
      header: 'Resuelto por',
      accessor: 'resolvedBy',
      render: (value: { _id: string; usuario: string }) => (value ? value.usuario : '-'),
    },
  ];

  const syncLogsActions: Action<SyncLog>[] = [
    { label: 'Ver', onClick: (syncLog) => navigate(syncLog._id) },
  ];

  return (
    <div className="p-4 space-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl md:text-3xl font-regular text-black dark:text-gray-200">
          Sync Logs
        </h2>
        <Button
          size="sm"
          variant="primary"
          onClick={() => navigate(-1)}
          startIcon={<BiArrowBack size={20} />}
        >
          Volver
        </Button>
      </div>

      {loading && <Spinner />}

      {syncLogsData ? (
        <Table
          data={syncLogsData}
          columns={syncLogsColumns}
          actions={syncLogsActions}
          pageSizeOptions={[5, 10, 20]}
          defaultPageSize={10}
        />
      ) : (
        <div>
          <p>No existen Sync Logs en el sistema</p>
        </div>
      )}
    </div>
  );
};
