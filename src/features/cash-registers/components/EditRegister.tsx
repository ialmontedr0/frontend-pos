import React, { useEffect, useCallback, useState } from 'react';

import Button from '../../../components/UI/Button/Button';
import Input from '../../../components/UI/Input/Input';
import { Label } from '../../../components/UI/Label/Label';
import { Modal } from '../../../components/UI/Modal/Modal';
import { myAlertSuccess, myAlertError } from '../../../utils/commonFunctions';
import type { CashRegister } from '../interfaces/CashRegisterInterface';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import { useNavigate } from 'react-router-dom';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import {
  deleteCashRegister,
  getCashRegisterByCode,
  updateCashRegister,
} from '../slices/cashRegisterSlice';
import type { UpdateRegisterDTO } from '../dtos/update-register.dto';

import { useForm } from 'react-hook-form';
import { BiSave, BiSolidSave, BiSolidTrash, BiTrash, BiX } from 'react-icons/bi';
import { Select } from '../../../components/UI/Select/Select';
import type { User } from '../../users/interfaces/UserInterface';
import type { RootState } from '../../../store/store';
import type { Store } from '../../stores/interfaces/store.interface';
import { getAllStores } from '../../stores/slices/storesSlice';

interface EditRegisterProps {
  cashRegister: CashRegister;
  isOpen: boolean;
  closeModal: () => void;
  error?: string;
}

export const EditRegister: React.FC<EditRegisterProps> = ({
  isOpen,
  cashRegister,
  closeModal,
  error,
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const myAlert = withReactContent(Swal);

  const [userQuery, setUserQuery] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [storeQuery, setStoreQuery] = useState<string>('');
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);

  const { users } = useAppSelector((state: RootState) => state.users);
  const { stores } = useAppSelector((state: RootState) => state.stores);

  const filteredUsers = users.filter((user: User) =>
    user.usuario.toLowerCase().includes(userQuery.toLowerCase())
  );

  const filteredStores = stores.filter((store: Store) =>
    store.nombre.toLowerCase().includes(storeQuery.toLowerCase())
  );

  const sanitizedRegisterForForm = (cashRegister: CashRegister): UpdateRegisterDTO => {
    const { estado, montoActual, assignedTo } = cashRegister;
    return {
      estado,
      montoActual,
      assignedTo,
    };
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateRegisterDTO>({
    defaultValues: {
      estado: 'abierta',
      montoActual: 0,
      assignedTo: '',
    },
  });

  useEffect(() => {
    if (cashRegister) {
      dispatch(getAllStores());
      reset(sanitizedRegisterForForm(cashRegister));
    }
  }, [cashRegister, reset]);

  useEffect(() => {
    if (!cashRegister) {
      navigate('/cash-registers');
      return;
    }
    return () => {};
  }, [cashRegister, navigate]);

  const onSubmit = useCallback(
    (updateRegisterDTO: UpdateRegisterDTO) => {
      myAlert
        .fire({
          title: 'Actualizar Caja',
          text: `Estas seguro que deseas guardar los cambios?`,
          iconHtml: <BiSolidSave />,
          customClass: {
            icon: 'no-default-icon-border',
          },
          showConfirmButton: true,
          showCancelButton: true,
          confirmButtonText: 'Guardar',
          cancelButtonText: 'Cancelar',
        })
        .then((result) => {
          if (result.isConfirmed && cashRegister) {
            dispatch(
              updateCashRegister({
                cashRegisterId: cashRegister._id,
                updateRegisterDTO: {
                  ...updateRegisterDTO,
                  sucursal: updateRegisterDTO.sucursal ?? cashRegister.sucursal._id,
                  assignedTo: updateRegisterDTO.assignedTo._id ?? cashRegister.assignedTo?._id,
                },
              })
            )
              .unwrap()
              .then((cashRegister) => {
                closeModal();
                myAlertSuccess(
                  `Caja ${cashRegister.codigo} actualizada`,
                  `Se ha actualizado la caja con exito`
                );
                dispatch(getCashRegisterByCode(cashRegister.codigo));
              })
              .catch((error: any) => {
                myAlertError(error);
              });
          }
        });
    },
    [dispatch]
  );

  const onDelRegister = useCallback(
    (registerId: string) => {
      myAlert
        .fire({
          title: 'Eliminar Caja',
          text: `Estas seguro que deseas eliminar la caja?`,
          iconHtml: <BiSolidTrash color="red" />,
          customClass: {
            icon: 'no-default-icon-border',
          },
          showConfirmButton: true,
          showCancelButton: true,
          confirmButtonText: 'Eliminar',
          cancelButtonText: 'Cancelar',
          confirmButtonColor: 'red',
        })
        .then((result) => {
          if (result.isConfirmed) {
            dispatch(deleteCashRegister(registerId))
              .unwrap()
              .then(() => {
                myAlertSuccess(`Caja Eliminada`, `Se ha eliminado la caja con exito`);
                navigate(-1);
              })
              .catch((error: any) => {
                myAlertError(error);
              });
          }
        });
    },
    [dispatch, navigate, myAlert, myAlertSuccess, myAlertError]
  );

  const cancel = () => {
    myAlert
      .fire({
        title: 'Cancelar edicion!',
        text: `Estas seguro que deseas cancelar la edicion la caja?`,
        icon: 'warning',
        showConfirmButton: true,
        showCancelButton: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          closeModal();
        }
      });
  };

  if (!cashRegister) return;

  return (
    <>
      <Modal isOpen={isOpen} onClose={closeModal} className="mx-4 md:mx-auto max-w-[700px]">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-black dark:text-gray-200">
              Editar Caja
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-200 lg:mb-7">
              Actualiza los datos la caja
            </p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
            <div className="custom-scrollbar h-fit overflow-y-auto px-2">
              <div className="">
                <h5 className="text-lg font-medium text-black dark:text-gray-200">
                  Caja #{cashRegister.codigo}
                </h5>
                <div className="flex flex-col md:grid md:grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div className="col-span-2 lg:col-span-1">
                    <Label htmlFor="estado">Estado Caja</Label>
                    <Select
                      id="estado"
                      defaultValue={cashRegister.estado}
                      {...register('estado', { required: 'El campo estado es obligatorio' })}
                    >
                      <option value="abierta">Abierta</option>
                      <option value="cerrada">Cerrada</option>
                    </Select>
                    {errors.estado && (
                      <div className="text-sm text-red-500">{errors.estado.message}</div>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="montoActual">Monto Actual</Label>
                    <Input
                      id="montoActual"
                      type="number"
                      placeholder="Monto actual RD$"
                      min={0}
                      {...register('montoActual', {
                        required: 'El campo monto actual es obligatorio.',
                        valueAsNumber: true,
                      })}
                    />
                    {errors.montoActual && (
                      <div className="text-sm text-red-500">{errors.montoActual.message}</div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="sucursal">Sucursal</Label>
                    <Input
                      type="text"
                      value={storeQuery}
                      onChange={(e) => setStoreQuery(e.target.value)}
                      placeholder="Buscar sucursal..."
                    />
                    {storeQuery && (
                      <ul className="overflow-auto max-h-40 border rounded mt-1 bg-white">
                        {filteredStores.map((store: Store) => (
                          <li
                            key={store._id}
                            className="px-3 py-2 hover:bg-blue-100 cursor-pointer"
                            onClick={() => {
                              setSelectedStore(store);
                              setStoreQuery('');
                            }}
                          >
                            {store.nombre}
                          </li>
                        ))}
                      </ul>
                    )}
                    {selectedStore ? (
                      <div className="flex flex-row gap-2 my-2">
                        {selectedStore && <p className="">📌 {selectedStore.nombre}</p>}{' '}
                        <Button
                          size="icon"
                          variant="icon"
                          startIcon={<BiTrash />}
                          onClick={() => setSelectedUser(null)}
                        ></Button>
                      </div>
                    ) : (
                      <div className="flex flex-row gap-2 my-2">
                        📌 Sucursal: <p>{cashRegister.sucursal?.nombre}</p>
                      </div>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="assignedTo">Usuario Asignado</Label>
                    <Input
                      type="text"
                      value={userQuery}
                      onChange={(e) => setUserQuery(e.target.value)}
                      placeholder="Buscar Usuario..."
                    />
                    {userQuery && (
                      <ul className="overflow-auto max-h-40 border rounded mt-1 bg-white">
                        {filteredUsers.map((user: User) => (
                          <li
                            className="px-3 py-2 hover:bg-blue-100 cursor-pointer"
                            key={user._id}
                            onClick={() => {
                              setSelectedUser(user);
                              setUserQuery('');
                            }}
                          >
                            {user.usuario}
                          </li>
                        ))}
                      </ul>
                    )}
                    {selectedUser ? (
                      <div className="flex flex-row gap-2 my-2">
                        {selectedUser && <p className="">📌 {selectedUser.usuario}</p>}{' '}
                        <Button
                          size="icon"
                          variant="icon"
                          startIcon={<BiTrash />}
                          onClick={() => setSelectedUser(null)}
                        ></Button>
                      </div>
                    ) : (
                      <div className="flex flex-row gap-2 my-2">
                        📌 Usuario: <p>{cashRegister.assignedTo?.usuario}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {error && <div className="text-sm text-red-500">Error: {error}</div>}
            <div className="flex flex-wrap items-center gap-3 px-2 mt-4 justify-center md:justify-end">
              <Button type="submit" size="sm" variant="primary" startIcon={<BiSave size={20} />}>
                Guardar Cambios
              </Button>
              <Button
                size="sm"
                variant="destructive"
                startIcon={<BiTrash size={20} />}
                onClick={() => onDelRegister(cashRegister._id)}
              >
                Eliminar
              </Button>
              <Button size="sm" variant="outline" startIcon={<BiX size={20} />} onClick={cancel}>
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
};
