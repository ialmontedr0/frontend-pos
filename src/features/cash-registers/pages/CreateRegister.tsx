import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import type { RootState } from '../../../store/store';
import { useAppSelector, useAppDispatch } from '../../../hooks/hooks';
import { createCashRegister, clearCashRegisterError } from '../slices/cashRegisterSlice';
import type { User } from '../../users/interfaces/UserInterface';
import { getAllUsers } from '../../users/slices/usersSlice';

import type { CreateRegisterDTO } from '../dtos/create-register.dto';
import { Label } from '../../../components/UI/Label/Label';
import { Select } from '../../../components/UI/Select/Select';
import Input from '../../../components/UI/Input/Input';
import Button from '../../../components/UI/Button/Button';
import { BiSave, BiSolidEraser, BiTrash, BiX } from 'react-icons/bi';
import type { Store } from '../../stores/interfaces/store.interface';
import { getAllStores } from '../../stores/slices/storesSlice';
import { myAlertError, myAlertSuccess } from '../../../utils/commonFunctions';

export const CreateRegister: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const myAlert = withReactContent(Swal);
  const [registerStatus, setRegisterStatus] = useState<'abierta' | 'cerrada'>('abierta');
  const [registerCurrentAmount, setRegisterCurrentAmount] = useState<number>(0);

  const { users } = useAppSelector((state: RootState) => state.users);
  const { stores } = useAppSelector((state: RootState) => state.stores);

  const [userQuery, setUserQuery] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [storeQuery, setStoreQuery] = useState<string>('');
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);

  const filteredUsers = users
    .filter((u) => u.rol === 'cajero')
    .filter((u) => u.usuario.toLowerCase().includes(userQuery.toLowerCase()));

  const {
    handleSubmit,
    formState: { errors },
  } = useForm<CreateRegisterDTO>({
    defaultValues: {
      estado: 'abierta',
      sucursal: '',
      montoActual: registerCurrentAmount ?? 0,
      assignedTo: '',
    },
  });

  useEffect(() => {
    dispatch(getAllUsers());
    dispatch(getAllStores());
    setRegisterCurrentAmount(0);
  }, [dispatch]);

  useEffect(() => {
    return () => {
      dispatch(clearCashRegisterError());
    };
  }, [dispatch]);

  const onSubmit = useCallback(() => {
    myAlert
      .fire({
        title: 'Crear Caja',
        text: `Estas seguro que deseas crear esta nueva caja?`,
        icon: 'question',
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: 'Si, crear',
        cancelButtonText: 'Cancelar',
      })
      .then((result) => {
        if (result.isConfirmed) {
          if (selectedUser && selectedUser.sucursal) {
            dispatch(
              createCashRegister({
                assignedTo: selectedUser._id,
                sucursal: selectedUser.sucursal._id,
                estado: registerStatus ?? 'abierta',
                montoActual: registerCurrentAmount ?? 0,
              })
            )
              .unwrap()
              .then(() => {
                myAlertSuccess(`Caja Creada`, `Se ha creado la caja exitosamente.`);
              })
              .catch((error: any) => {
                myAlertError(error);
              });
          } else if (!selectedUser && selectedStore) {
            console.log(`Sucursal seleccionada: ${selectedStore._id}`);
          }
        }
      });
  }, []);

  const clear = () => {
    setRegisterStatus('abierta');
    setRegisterCurrentAmount(0);
    setSelectedUser(null);
    setSelectedStore(null);
  };

  const cancel = () => {
    myAlert
      .fire({
        title: 'Cancelar creacion!',
        text: `Estas seguro que deseas cancelar la creacion de la caja?`,
        icon: 'question',
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: 'Cancelar',
        cancelButtonText: 'No',
      })
      .then((result) => {
        if (result.isConfirmed) {
          navigate('/cash-registers');
        }
      });
  };

  return (
    <div className="p-6 space-y-4 border-2 border-black h-screen">
      <div className="border border-green-600 py-4 rounded-lg shadow-theme-sm">
        <div className="space-y-6 px-4">
          <h2 className="text-2xl md:text-3xl font-medium my-2">Crear Caja</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="">
          <div className="grid grid-cols-1 md:grid-cols-2 space-y-4 space-x-4 px-4">
            <div>
              <Label>Estado Inicial</Label>
              <Select onChange={(e) => setRegisterStatus(e.target.value as any)}>
                <option value="abierta">Abierta</option>
                <option value="cerrada">Cerrada</option>
              </Select>
            </div>
            <div>
              <Label>Monto Apertura</Label>
              <Input
                type="number"
                id="montoActual"
                placeholder="Ingresa Monto inicial"
                min={0}
                onChange={(e) => {
                  let val = parseFloat(e.target.value) || 0;
                  setRegisterCurrentAmount(val);
                }}
              />
              {errors.montoActual && (
                <p className="text-sm text-red-500">{errors.montoActual.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="assignedTo">Asignar a Usuario (CAJERO)</Label>
              <Input
                type="text"
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                placeholder={selectedUser ? selectedUser.usuario : 'Buscar usuario'}
              />
              {userQuery && (
                <ul className="overflow-auto max-h-40 border rounded mt-1 bg-white">
                  {filteredUsers.map((u) => (
                    <li
                      className="px-3 py-2 hover:bg-blue-100 cursor-pointer"
                      key={u._id}
                      onClick={() => {
                        setSelectedUser(u);
                        setSelectedStore(null);
                        setUserQuery('');
                      }}
                    >
                      {u.usuario}
                    </li>
                  ))}
                </ul>
              )}
              {selectedUser && (
                <div className="flex flex-row gap-2 my-2">
                  <p className="mt-2 font-medium">
                    📌 {selectedUser.usuario} - {selectedUser.sucursal?.nombre || 'Administrador'}
                  </p>
                  <Button
                    className="bg-transparent hover:bg-gray-100 p-1"
                    onClick={() => {
                      setSelectedUser(null);
                    }}
                    startIcon={<BiTrash className="text-red-400" size={20} />}
                  ></Button>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="sucursal">Sucursal</Label>
              {selectedUser && (
                <p>
                  Se ha seleccionado un usuario: Su sucursal es: <br />
                  {selectedUser.sucursal!.nombre}
                </p>
              )}
              {!selectedUser && (
                <div>
                  <Input
                    type="text"
                    value={storeQuery}
                    onChange={(e) => setStoreQuery(e.target.value)}
                    placeholder={selectedStore ? selectedStore.nombre : 'Buscar sucursal'}
                  />
                  {storeQuery && (
                    <ul className="overflow-auto max-h-40 border rounded mt-1 bg-white">
                      {stores.map((s) => (
                        <li
                          key={s._id}
                          className="px-3 py-2 hover:bg-blue-100 cursor-pointer"
                          onClick={() => {
                            setSelectedStore(s);
                            setStoreQuery('');
                          }}
                        >
                          {s.nombre}
                        </li>
                      ))}
                    </ul>
                  )}
                  {selectedStore && (
                    <div className="flex flex-row gap-2 my-2">
                      <p className="mt-2 font-semibold">📌 {selectedStore.nombre}</p>
                      <Button
                        className="bg-transparent hover:bg-gray-100 p-1"
                        onClick={() => setSelectedStore(null)}
                        startIcon={<BiTrash className="text-red-400" size={20} />}
                      ></Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-row gap-2 my-4 px-4 justify-center md:justify-end lg:justify-end">
            <Button size="sm" variant="primary" type="submit" startIcon={<BiSave size={20} />}>
              Crear
            </Button>
            <Button
              size="sm"
              variant="success"
              type="button"
              startIcon={<BiSolidEraser />}
              onClick={clear}
            >
              Limpiar
            </Button>
            <Button
              size="sm"
              variant="outline"
              type="button"
              startIcon={<BiX size={20} />}
              onClick={cancel}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
