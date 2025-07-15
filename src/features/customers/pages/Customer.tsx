import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import moment from 'moment/min/moment-with-locales';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import {
  getCustomerById,
  clearCustomerError,
  updateCustomer,
  deleteCustomer,
  clearSelectedCustomer,
} from '../slices/customerSlice';
import type { RootState } from '../../../store/store';
import type { Column, Action } from '../../../components/Table/types';
import { Table } from '../../../components/Table/Table';
import Button from '../../../components/UI/Button/Button';
import { BiArrowBack, BiEdit, BiSave, BiTrash, BiX } from 'react-icons/bi';
import type { Customer as CustomerInterface } from '../interfaces/CustomerInterface';
import { Label } from '../../../components/UI/Label/Label';
import { myAlertError, myAlertSuccess, parseSaleStatus } from '../../../utils/commonFunctions';
import Spinner from '../../../components/UI/Spinner/Spinner';
import type { CustomerPurchase } from '../interfaces/CustomerPurchaseInterface';
import { NotFound } from '../../../pages/NotFound';
import PageMeta from '../../../components/common/PageMeta';
import { Modal } from '../../../components/UI/Modal/Modal';
import { useModal } from '../../../hooks/useModal';
import Input from '../../../components/UI/Input/Input';
import type { UpdateCustomerDTO } from '../dtos/update-customer.dto';

export const Customer: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isOpen, openModal, closeModal } = useModal();
  const myAlert = withReactContent(Swal);
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

  const sanitizedCustomerForForm = (customer: CustomerInterface): UpdateCustomerDTO => {
    const { nombre, apellido, telefono, correo, direccion } = customer;
    return {
      nombre,
      apellido,
      telefono,
      correo,
      direccion,
    };
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateCustomerDTO>({
    defaultValues: {
      nombre: '',
      apellido: '',
      telefono: '',
      correo: '',
      direccion: '',
    },
  });

  useEffect(() => {
    if (customer) {
      reset(sanitizedCustomerForForm(customer));
    }
  }, [customer, reset]);

  const onSubmit = useCallback(
    (updateCustomerDTO: UpdateCustomerDTO) => {
      myAlert
        .fire({
          title: `Guardar Cambios`,
          text: `Estas seguro que deseas guardar los cambios del cliente?`,
          iconHtml: <BiSave />,
          customClass: {
            icon: 'no-default-icon-border',
            container: 'swal2-container z-[999999]',
            popup: 'z-[1000000]',
          },
          showConfirmButton: true,
          showCancelButton: true,
          confirmButtonText: 'Guardar',
          cancelButtonText: 'Cancelar',
        })
        .then((result) => {
          if (result.isConfirmed) {
            dispatch(
              updateCustomer({
                customerId: customer!._id,
                updateCustomerDTO,
              })
            )
              .unwrap()
              .then(() => {
                closeModal();
                myAlertSuccess(`Cliente actualizado!`, `Se ha actualizado el cliente con exito.`);
                dispatch(getCustomerById(customerId!));
              })
              .catch((error: any) => {
                myAlertError(`Error: ${error}`);
              });
          }
        });
    },
    [dispatch]
  );

  const onDelCustomer = useCallback(
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
                dispatch(clearCustomerError());
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
              variant="primary"
              startIcon={<BiArrowBack />}
            >
              Volver
            </Button>
            <Button onClick={openModal} size="sm" variant="outline" startIcon={<BiEdit />}>
              Editar
            </Button>
          </div>
        </div>

        <Modal isOpen={isOpen} onClose={closeModal} className="mx-4 md:mx-auto max-w-[700px]">
          <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
            <div className="px-2 pr-14">
              <h4 className="mb-2 text-2xl font-semibold text-black dark:text-gray-200">
                Editar Cliente
              </h4>
              <p className="mb-6 text-sm text-gray-500 dark:text-gray-200 lg:mb-7">
                Actualiza los datos del cliente
              </p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
              <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
                <div className="mt-7">
                  <h5 className="text-lg mb-5 font-medium text-black dark:text-gray-200 lg:mb-6">
                    {customer.nombre} {customer.apellido || ''}
                  </h5>
                  <div className="flex flex-col md:grid md:grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                    <div className="col-span-2 lg:col-span-1">
                      <Label htmlFor="nombre">Nombre</Label>
                      <Input
                        id="nombre"
                        {...register('nombre', { required: 'El campo nombre es obligatorio.' })}
                        placeholder={customer.nombre}
                      />
                      {errors.nombre && (
                        <div className="text-sm text-red-500">{errors.nombre.message}</div>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="apellido">Apellido</Label>
                      <Input
                        id="apellido"
                        {...register('apellido')}
                        placeholder={customer.apellido}
                      />
                      {errors.apellido && (
                        <div className="text-sm text-red-500">{errors.apellido.message}</div>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="telefono">Telefono</Label>
                      <Input
                        id="telefono"
                        {...register('telefono', {
                          required: 'El campo telefono es obligatorio.',
                          pattern: /^\+1\s\d{3}-\d{3}-\d{4}$/,
                        })}
                        placeholder={customer.telefono}
                      />
                      {errors.telefono && (
                        <div className="text-sm text-red-500">{errors.telefono.message}</div>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="correo">Correo</Label>
                      <Input
                        id="correo"
                        type="email"
                        {...register('correo')}
                        placeholder={customer.correo}
                      />
                      {errors.correo && (
                        <div className="text-sm text-red-500">{errors.correo.message}</div>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="direccion">Direccion</Label>
                      <Input
                        id="direccion"
                        {...register('direccion')}
                        placeholder={customer.direccion}
                      />
                      {errors.direccion && (
                        <div className="text-sm text-red-500">{errors.direccion.message}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3 px-2 mt-6 justify-center md:justify-end">
                <Button type="submit" size="sm" variant="primary" startIcon={<BiSave />}>
                  Guardar Cambios
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  startIcon={<BiTrash />}
                  onClick={() => onDelCustomer(customer._id)}
                >
                  Eliminar
                </Button>
                <Button size="sm" variant="outline" startIcon={<BiX />} onClick={closeModal}>
                  Cancelar
                </Button>
              </div>
            </form>
          </div>
        </Modal>
      </div>
    </>
  );
};
