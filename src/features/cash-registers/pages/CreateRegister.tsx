import React, { useState, useEffect } from 'react';
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
import { BiSave, BiTrash, BiX } from 'react-icons/bi';

export const CreateRegister: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const myAlert = withReactContent(Swal);
  const [registerStatus, setRegisterStatus] = useState<'abierta' | 'cerrada'>('abierta');
  const [registerCurrentAmount, setRegisterCurrentAmount] = useState<number>(0);

  const { users } = useAppSelector((state: RootState) => state.users);
  const [userQuery, setUserQuery] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const filteredUsers = users.filter((u) =>
    u.usuario.toLowerCase().includes(userQuery.toLowerCase())
  );

  const {
    handleSubmit,
    formState: { errors },
  } = useForm<CreateRegisterDTO>({
    defaultValues: {
      estado: 'abierta',
      montoActual: registerCurrentAmount ?? 0,
      assignedTo: '',
    },
  });

  useEffect(() => {
    dispatch(getAllUsers());
    setRegisterCurrentAmount(0);
  }, [dispatch]);

  useEffect(() => {
    return () => {
      dispatch(clearCashRegisterError());
    };
  }, [dispatch]);

  const onSubmit = () => {
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
          dispatch(
            createCashRegister({
              assignedTo: selectedUser?._id,
              estado: registerStatus ?? 'abierta',
              montoActual: registerCurrentAmount ?? 0,
            })
          )
            .unwrap()
            .then(() => {
              myAlert.fire({
                title: `Caja creada`,
                text: `Se ha creado la caja con exito`,
                icon: 'success',
                timer: 5000,
                timerProgressBar: true,
              });
              navigate('/cash-registers');
            })
            .catch((error: any) => {
              myAlert.fire({
                title: `Error`,
                text: `Error: ${error}`,
                icon: 'error',
                timer: 5000,
                timerProgressBar: true,
              });
            });
        }
      });
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

  {
    /* <div className="p-6">
      <div className="">
        <h2 className="text-2xl font-semibold">Crear Caja</h2>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="estado">Estado</Label>

            <Select
              value={registerStatus}
              onChange={(e) => setRegisterStatus(e.target.value as any)}
              className="block w-40 md:w-48 rounded-md border border-gray-300 dark:border-gray-600 
                        bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200
                        focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="abierta">Abierta</option>
              <option value="cerrada">Cerrada</option>
            </Select>
          </div>

          <div>
            <Label htmlFor="montoActual">Monto Actual</Label>
            <Input
              type="number"
              id="montoActual"
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
            <Label htmlFor="assignedTo">Asignar a Usuario</Label>
            <Input
              type="text"
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              placeholder="Buscar usuario..."
            />
            {userQuery && (
              <ul className="overflow-auto max-h-40 border rounded mt-1 bg-white">
                {filteredUsers.map((u) => (
                  <li
                    className="px-3 py-2 hover:bg-blue-100 cursor-pointer"
                    key={u._id}
                    onClick={() => {
                      setSelectedUser(u);
                      setUserQuery('');
                    }}
                  >
                    {u.usuario}
                  </li>
                ))}
              </ul>
            )}
            {selectedUser && (
              <div>
                <p className="mt-2 font-semibold">📌 {selectedUser.usuario}</p>
                <Button
                  onClick={() => setSelectedUser(null)}
                  startIcon={<BiTrash size={16} />}
                ></Button>
              </div>
            )}
          </div>

          {error && <p className="text-red-500">Error: {error}</p>}
        </div>

        <div className="flex flex-wrap gap-2">
          <Button type="submit">{loading ? `${(<Spinner />)}` : 'Crear caja'}</Button>
          <Button
            className="px-3 py-2 rounded-lg bg-green-600 text-white"
            type="button"
            onClick={cancel}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div> */
  }

  return (
    <div className="p-6 space-y-4 border-2 border-black h-screen">
      <div className="border border-green-600 py-4 rounded-lg shadow-theme-sm">
        <div className="space-y-6 px-4">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-regular">Crear Caja</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="">
          <div className="grid grid-cols-1 md:grid-cols-2 space-x-4 px-4">
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
              <Label htmlFor="assignedTo">Asignar a Usuario</Label>
              <Input
                type="text"
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                placeholder={selectedUser ? selectedUser.usuario : 'Buscar usuario' }
              />
              {userQuery && (
                <ul className="overflow-auto max-h-40 border rounded mt-1 bg-white">
                  {filteredUsers.map((u) => (
                    <li
                      className="px-3 py-2 hover:bg-blue-100 cursor-pointer"
                      key={u._id}
                      onClick={() => {
                        setSelectedUser(u);
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
                  <p className="mt-2 font-semibold">📌 {selectedUser.usuario}</p>
                  <Button
                    className="bg-transparent hover:bg-gray-100 p-1"
                    onClick={() => setSelectedUser(null)}
                    startIcon={<BiTrash className="text-red-400" size={20} />}
                  ></Button>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-row gap-2 my-2 px-4 justify-center md:justify-end lg:justify-end">
            <Button size="sm" variant="primary" type="submit" startIcon={<BiSave size={20} />}>
              Crear
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
