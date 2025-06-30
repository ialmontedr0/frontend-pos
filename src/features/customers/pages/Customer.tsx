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
import Button from '../../../components/UI/Button/Button';
import { BiArrowBack, BiEdit, BiTrash } from 'react-icons/bi';
import type { Customer as CustomerInterface } from '../interfaces/CustomerInterface';
import { Label } from '../../../components/UI/Label/Label';
import { myAlertSuccess } from '../../../utils/commonFunctions';
import Spinner from '../../../components/UI/Spinner/Spinner';

export const Customer: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const myAlert = withReactContent(Swal);
  const { customerId } = useParams<{ customerId: string }>();

  const { customer, loading, error } = useAppSelector((state: RootState) => state.customers);

  const [customerPurchases, setCustomerPurchases] = useState<any[]>([]);
  const [creator, setCreator] = useState<User | null>(null);
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
    dispatch(getCustomerById(customerId))
      .unwrap()
      .then((customer: CustomerInterface) => {
        setCustomerPurchases(customer.historialCompras);
      });

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
                myAlertSuccess(`Cliente eliminado`, `Se ha eliminado el cliente con exito`);
                navigate('/customers');
              })
              .catch((error: any) => {
                myAlertSuccess(`Error`, `Error: ${error.response?.data?.message || error.message}`);
              });
          }
        });
    },
    [dispatch, navigate, myAlert]
  );

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <div className="p-6 max-w-lg mx-auto bg-white dark:bg-gray-800 rounded-lg shadow">
        <p className="text-red-600 dark:text-red-400">Error: {error}</p>
        <Button startIcon={<BiArrowBack size={20} />} onClick={() => navigate('/customers')}>
          Volver
        </Button>
      </div>
    );
  }

  return (
    <div className="m-5 ml-5 mr-5 p-4 max-2-2xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-lg">
      <div className="flex-1 space-y-4">
        <h2 className="text-2xl font-regular text-gray-800 dark:text-gray-100">
          {customer?.nombre} {customer?.apellido || ''}
        </h2>

        <div className="grid grid-cols sm:grid-cols-2 gap-x-6 gap-y-2">
          <div>
            <Label className="text-gray-500 dark:text-gray-400 text-sm">Telefono</Label>
            <p className="text-gray-800 dark:text-gray-200">{customer?.telefono || '-'}</p>
          </div>

          <div>
            <Label className="text-gray-500 dark:text-gray-400 text-sm">Correo</Label>
            <p className="text-gray-800 dark:text-gray-200">
              {customer?.correo || 'Sin correo registrado'}
            </p>
          </div>

          <div>
            <Label className="text-gray-500 dark:text-gray-400 text-sm">Direccion</Label>
            <p className="text-gray-800 dark:text-gray-200">{customer?.direccion || '-'}</p>
          </div>

          {customer?.createdBy && (
            <div>
              <Label className="text-gray-500 dark:text-gray-400 text-sm">Creado por</Label>
              <p className="text-gray-700 dark:text-gray-200">
                {creator ? `${creator.usuario}` : 'Cargando...'}
              </p>
            </div>
          )}

          <div>
            <Label className="text-gray-500 dark:text-gray-400 text-sm">Actualizado por</Label>
            <p className="text-gray-700 dark:text-gray-200">
              {updater ? `${updater.usuario}` : 'Cargando...'}
            </p>
          </div>

          {fetchError && (
            <div className="mt-4 p-2 bg-red-100 text-red-700 rounded">{fetchError}</div>
          )}

          <div>
            <Label className="text-gray-500 dark:text-gray-400 text-sm">Fecha creacion</Label>
            <p className="text-gray-800 dark:text-gray-200">
              {moment(customer?.createdAt).format('MMMM Do YYYY, h:mm:ss a')}
            </p>
          </div>

          <div>
            <Label className="text-gray-500 dark:text-gray-400 text-sm">Fecha Actualizacion</Label>
            <p className="text-gray-800 dark:text-gray-200">
              {moment(customer?.updatedAt).format('MMMM Do YYYY, h:mm:ss a')}
            </p>
          </div>

          <div></div>

          <div>
            <Label htmlFor="historialCompras">Compras</Label>
            {customer?.historialCompras.length ? (
              <Table
                data={customerPurchases}
                columns={purchaseColumns}
                actions={purcahseActions}
                pageSizeOptions={[5, 10, 20]}
                defaultPageSize={5}
              />
            ) : (
              <p className="text-white dark:text-gray-200">Este cliente aun no tiene compras</p>
            )}
          </div>
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
