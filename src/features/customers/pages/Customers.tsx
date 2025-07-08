import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import type { RootState } from '../../../store/store';
import { getAllCustomers, deleteCustomer } from '../slices/customerSlice';
import type { Customer } from '../interfaces/CustomerInterface';
import type { Column, Action } from '../../../components/Table/types';
import { Table } from '../../../components/Table/Table';
import Button from '../../../components/UI/Button/Button';
import {
  BiPlusCircle,
} from 'react-icons/bi';
import Spinner from '../../../components/UI/Spinner/Spinner';
import { parseCustomerType } from '../../../utils/commonFunctions';

export function Customers() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const myAlert = withReactContent(Swal);

  const { customers, loading, error } = useAppSelector((state: RootState) => state.customers);

  useEffect(() => {
    dispatch(getAllCustomers());
  }, [dispatch]);

  const customerColumns: Column<Customer>[] = [
    { header: 'Nombre', accessor: 'nombre' },
    { header: 'Telefono', accessor: 'telefono', render: (value: string) => `${value || '-'}` },
    { header: 'Correo', accessor: 'correo', render: (value: string) => `${value || 'Sin correo'}` },
    { header: 'Direccion', accessor: 'direccion', render: (value: string) => `${value || '--'}` },
    { header: 'Tipo', accessor: 'tipo', render: (value: string) => `${parseCustomerType(value)}` },
  ];

  const customerActions: Action<Customer>[] = [
    { label: 'Ver', onClick: (c) => viewCustomer(c._id) },
    { label: 'Editar', onClick: (c) => editCustomer(c._id) },
    { label: 'Eliminar', onClick: (c) => handleDeleteCustomer(c._id) },
  ];

  const createCustomer = () => {
    navigate('/customers/create');
  };

  const viewCustomer = useCallback(
    (customerId: string) => {
      navigate(`${customerId}`);
    },
    [navigate]
  );

  const editCustomer = useCallback(
    (customerId: string) => {
      navigate(`/customers/edit/${customerId}`);
    },
    [navigate]
  );

  const handleDeleteCustomer = useCallback(
    (customerId: string) => {
      myAlert
        .fire({
          title: 'Eliminar Cliente',
          text: `Estas seguro que deseas eliminar este cliente?`,
          icon: 'question',
          showConfirmButton: true,
          confirmButtonText: 'Si, eliminar!',
          showCancelButton: true,
          cancelButtonText: 'Cancelar',
        })
        .then((result) => {
          if (result.isConfirmed) {
            dispatch(deleteCustomer(customerId))
              .unwrap()
              .then(() => {
                myAlert.fire({
                  title: 'Cliente eliminado',
                  text: `Se ha eliminado el cliente con exito!`,
                  icon: 'success',
                  timer: 5000,
                  timerProgressBar: true,
                });
                dispatch(getAllCustomers());
              })
              .catch((error: any) => {
                myAlert.fire({
                  title: 'Error',
                  text: `Error: ${error.response?.data?.message || error.message}`,
                  icon: 'error',
                  timer: 5000,
                  timerProgressBar: true,
                });
              });
          }
        });
    },
    [dispatch]
  );

  return (
    <div className="p-4 space-y-6">
      <div className="space-y-4 space-x-4">
        <h2 className="text-3xl font-regular text-black dark:text-gray-200">Clientes</h2>
        <Button
          size="sm"
          onClick={createCustomer}
          className=""
          startIcon={<BiPlusCircle size={24} />}
        >
          Nuevo Cliente
        </Button>
      </div>

      {loading && <Spinner />}

      {!loading && customers.length === 0 && <div>No hay clientes</div>}

      {error && <div className="text-sm text-red-600">Error: {error}</div>}
      <Table
        columns={customerColumns}
        data={customers}
        defaultPageSize={10}
        pageSizeOptions={[5, 10, 20]}
        actions={customerActions}
      />
    </div>
  );
}
