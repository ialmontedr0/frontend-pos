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
import { Button } from '../../../components/UI/Button/Button';
import { BiPlusCircle } from 'react-icons/bi';

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
    { header: 'Telefono', accessor: 'telefono' },
    { header: 'Correo', accessor: 'correo', render: (value: string) => `${value || 'Sin correo'}` },
    { header: 'Direccion', accessor: 'direccion', render: (value: string) => `${value || '--'}` },
    { header: 'Tipo', accessor: 'tipo' }
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
    <div className="p-4 py-2">
      <h2 className="text-2xl font-semibold text-black dark:text-white mb-2">Clientes</h2>
      <div className="py-2 flex flex-row gap-2 my-2">
        <Button
          icon={<BiPlusCircle size={24} />}
          className="border border-gray-900 px-4 py-1 rounded-md text-white bg-blue-900 dark:bg-blue-400 cursor-pointer hover:bg-blue-800 transition-colors"
          iconPosition="right"
          type="button"
          onClick={createCustomer}
        >
          Nuevo Cliente
        </Button>
      </div>

      {loading && <div>Cargando...</div>}

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
