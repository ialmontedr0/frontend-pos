import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import { getCustomerById, deleteCustomer, clearSelectedCustomer } from '../slices/customerSlice';
import type { RootState } from '../../../store/store';
import type { User } from '../../users/interfaces/UserInterface';
import { usersService } from '../../users/services/usersService';
import type { Column, Action } from '../../../components/Table/types';
import { Table } from '../../../components/Table/Table';
import type { Sale } from '../../sales/interfaces/SaleInterface';
import  Button  from '../../../components/UI/Button/Button';
import { BiArrowBack, BiEdit, BiTrash } from 'react-icons/bi';

export const Customer: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const myAlert = withReactContent(Swal);
  const { customerId } = useParams<{ customerId: string }>();

  const { customer, loading, error } = useAppSelector((state: RootState) => state.customers);

  /*   const [customerPurchases, setCustomerPurchases] = useState<any[]>([]);*/ const [
    creator,
    setCreator,
  ] = useState<User | null>(null);
  const [updater, setUpdater] = useState<User | null>(null);
  const [fetchError, setFectchError] = useState<string | null>(null);

  const purchaseColumns: Column<Sale>[] = [
    { header: 'Codigo', accessor: 'codigo' },
    {
      header: 'Fecha',
      accessor: 'fecha',
      render: (value: string) => `${new Date(value).toLocaleString()}`,
    },
    { header: 'Estado', accessor: 'estado' },
    { header: 'Total', accessor: 'totalVenta' },
  ];

  const purcahseActions: Action<Sale>[] = [
    {
      label: 'Ver',
      onClick: (s) => navigate(`/sales/${s._id}`),
    },
  ];

  useEffect(() => {
    if (!customerId) {
      navigate('/customers');
      return;
    }
    dispatch(getCustomerById(customerId));
    return () => {
      dispatch(clearSelectedCustomer());
      setCreator(null);
      setUpdater(null);
      setFectchError(null);
    };
  }, [dispatch, customerId, navigate]);

  useEffect(() => {
    if (!customer) return;

    setFectchError(null);
    const loadById = async (userId: string, setter: (u: User | null) => void) => {
      try {
        const userResponse = await usersService.getById(userId);
        setter(userResponse.data);
      } catch (error: any) {
        setter(null);
        setFectchError(
          `No se pudo obtener el usuario con el ID: ${userId}: ${error.response?.data?.message || error.message}`
        );
      }
    };

    if (customer.createdBy) {
      loadById(customer.createdBy, setCreator);
    }

    if (customer.updatedBy) {
      loadById(customer.updatedBy, setUpdater);
    }
  }, [customer]);

  const handleDeleteCustomer = useCallback(
    (customerId: string) => {
      myAlert
        .fire({
          title: `Eliminar cliente`,
          text: `Estas seguro que deseas eliminar el cliente?`,
          icon: 'question',
          showConfirmButton: true,
          confirmButtonText: 'Si, eliminar',
          showCancelButton: true,
          cancelButtonText: 'Cancelar',
        })
        .then((result) => {
          if (result.isConfirmed) {
            dispatch(deleteCustomer(customerId))
              .unwrap()
              .then(() => {
                myAlert.fire({
                  title: 'Eliminacion de cliente',
                  text: `Se ha eliminado el cliente con exito`,
                  icon: 'success',
                  timer: 5000,
                  timerProgressBar: true,
                });
                navigate('/customers');
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
    [dispatch, navigate, myAlert]
  );

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="border border-black m-5 ml-5 mr-5 p-4 max-2-2xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-lg">
      <div className="flex-1 space-y-4">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
          {customer?.nombre} {customer?.apellido || ''}
        </h2>

        <div className="grid grid-cols sm:grid-cols-2 gap-x-6 gap-y-2">
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Telefono</p>
            <p className="text-gray-800 dark:text-gray-200">{customer?.telefono}</p>
          </div>

          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Correo</p>
            <p className="text-gray-800 dark:text-gray-200">
              {customer?.correo || 'Sin correo registrado'}
            </p>
          </div>

          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Direccion</p>
            <p className="text-gray-800 dark:text-gray-200">{customer?.direccion || ''}</p>
          </div>

          {customer?.createdBy && (
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Creado por</p>
              <p className="text-gray-700 dark:text-gray-200">
                {creator ? `${creator.usuario}` : 'Cargando...'}
              </p>
            </div>
          )}

            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Actualizado por</p>
              <p className="text-gray-700 dark:text-gray-200">
                {updater ? `${updater.usuario}` : 'Cargando...'}
              </p>
            </div>
        

          {fetchError && (
            <div className="mt-4 p-2 bg-red-100 text-red-700 rounded">{fetchError}</div>
          )}

          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Fecha creacion</p>
            <p className="text-gray-800 dark:text-gray-200">
              {moment(customer?.createdAt).format('MMMM Do YYYY, h:mm:ss a')}
            </p>
          </div>

          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Fecha Actualizacion</p>
            <p className="text-gray-800 dark:text-gray-200">
              {moment(customer?.updatedAt).format('MMMM Do YYYY, h:mm:ss a')}
            </p>
          </div>

          {customer?.historialCompras?.length ? (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Historial de compras</h3>
              <Table
                columns={purchaseColumns}
                data={customer.historialCompras}
                defaultPageSize={5}
                pageSizeOptions={[5, 10]}
                actions={purcahseActions}
              />
            </div>
          ) : (
            <p className="mt-6 text-gray-500">Este cliente aun no tiene compras.</p>
          )}
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-end space-y-2 sm:space-y-0 sm:space-x-2">
          <Button
            onClick={() => navigate('/customers')}
            className=""
            startIcon={<BiArrowBack size={20} />}
          >
            Atras
          </Button>
          <Button
            onClick={() => navigate(`/customers/edit/${customer?._id}`)}
            className="bg-green-600 text-white dark:bg-green-500 hover:bg-green-800 dark:hover:bg-green-700"
            startIcon={<BiEdit size={20} />}
          >
            Editar
          </Button>
          <Button
            onClick={() => handleDeleteCustomer(customer!._id)}
            className="bg-red-600 text-white dark:bg-red-500 hover:bg-red-800 dark:hover:bg-red-700"
            startIcon={<BiTrash size={20} />}
          >
            Eliminar
          </Button>
        </div>
      </div>
    </div>
  );
};
