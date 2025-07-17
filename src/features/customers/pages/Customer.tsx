import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import moment from 'moment/min/moment-with-locales';

import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import { getCustomerById, clearSelectedCustomer } from '../slices/customerSlice';
import type { RootState } from '../../../store/store';
import type { Column, Action } from '../../../components/Table/types';
import { Table } from '../../../components/Table/Table';
import Button from '../../../components/UI/Button/Button';
import { BiArrowBack, BiEdit } from 'react-icons/bi';
import type { Customer as CustomerInterface } from '../interfaces/CustomerInterface';
import { Label } from '../../../components/UI/Label/Label';
import { parseSaleStatus } from '../../../utils/commonFunctions';
import Spinner from '../../../components/UI/Spinner/Spinner';
import type { CustomerPurchase } from '../interfaces/CustomerPurchaseInterface';
import { NotFound } from '../../../pages/NotFound';
import PageMeta from '../../../components/common/PageMeta';
import { useModal } from '../../../hooks/useModal';
import { EditCustomer } from '../components/EditCustomer';

export const Customer: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isOpen, openModal, closeModal } = useModal();
  const { customerId } = useParams<{ customerId: string }>();
  moment.locale('es');

  const { customer, loading, error } = useAppSelector((state: RootState) => state.customers);

  const [customerPurchases, setCustomerPurchases] = useState<any[]>([]);

  const purchaseColumns: Column<CustomerPurchase>[] = [
    { header: 'Codigo', accessor: 'codigo' },
    {
      header: 'Fecha',
      accessor: 'fecha',
      render: (value: string) => `${new Date(value).toLocaleString()}`,
    },
    {
      header: 'Estado',
      accessor: 'estado',
      render: (value: string) => `${parseSaleStatus(value)}`,
    },
    { header: 'Total', accessor: 'total', render: (value: number) => `RD$ ${value.toFixed(2)}` },
  ];

  const purcahseActions: Action<CustomerPurchase>[] = [
    {
      label: 'Ver',
      onClick: (s) => navigate(`/sales/${s.codigo}`),
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
    };
  }, [dispatch, customerId, navigate]);

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

  if (!customer) {
    return <NotFound node="Cliente" />;
  }

  return (
    <>
      <PageMeta title="Cliente - PoS v2" description="Cliente" />
      <div className="m-2 mx-2 p-4 max-2-2xl bg-white dark:bg-gray-900 rounded-lg shadow-lg">
        <div className="flex-1 space-y-4">
          <h2 className="text-2xl font-regular text-gray-800 dark:text-gray-100">
            {customer.nombre} {customer.apellido || ''}
          </h2>

          <div className="grid grid-cols sm:grid-cols-2 gap-x-6 gap-y-2">
            <div>
              <Label className="text-gray-500 dark:text-gray-400 text-sm">Telefono</Label>
              <p className="text-gray-800 dark:text-gray-200">{customer.telefono || '-'}</p>
            </div>

            <div>
              <Label className="text-gray-500 dark:text-gray-400 text-sm">Correo</Label>
              <p className="text-gray-800 dark:text-gray-200">
                {customer?.correo || 'Sin correo registrado'}
              </p>
            </div>

            <div>
              <Label className="text-gray-500 dark:text-gray-400 text-sm">Direccion</Label>
              <p className="text-gray-800 dark:text-gray-200">{customer.direccion || '-'}</p>
            </div>

            {customer.createdBy && (
              <div>
                <Label className="text-gray-500 dark:text-gray-400 text-sm">Creado por</Label>
                <p className="text-gray-700 dark:text-gray-200">{customer.createdBy.usuario}</p>
              </div>
            )}

            {customer.updatedBy && (
              <div>
                <Label htmlFor="updatedBy">Actualizado por</Label>
                <p>{customer.updatedBy.usuario}</p>
              </div>
            )}

            <div>
              <Label className="text-gray-500 dark:text-gray-400 text-sm">Fecha creacion</Label>
              <p className="text-gray-800 dark:text-gray-200">
                {moment(customer.createdAt).format('LLLL')}
              </p>
            </div>

            <div>
              <Label className="text-gray-500 dark:text-gray-400 text-sm">
                Fecha Actualizacion
              </Label>
              <p className="text-gray-800 dark:text-gray-200">
                {moment(customer.updatedAt).format('LLLL')}
              </p>
            </div>
          </div>

          <div>
            <Label className="text-xl font-regular" htmlFor="historialCompras">
              Compras
            </Label>
            {customer.historialCompras.length ? (
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

          <div className="flex gap-2 justify-center md:justify-end mt-4">
            <Button
              onClick={() => navigate('/customers')}
              size="sm"
              variant="outline"
              startIcon={<BiArrowBack size={20} />}
            >
              Volver
            </Button>
            <Button
              onClick={openModal}
              size="sm"
              variant="primary"
              startIcon={<BiEdit size={20} />}
            >
              Editar
            </Button>
          </div>
        </div>
        <EditCustomer customer={customer} isOpen={isOpen} closeModal={closeModal} error={error!} />
      </div>
    </>
  );
};
