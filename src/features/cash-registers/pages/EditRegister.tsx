import React, { useEffect, useCallback, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import { useAppSelector, useAppDispatch } from '../../../hooks/hooks';
import type { RootState } from '../../../store/store';
import {
  getCashRegisterByCode,
  updateCashRegister,
  clearSelectedCashRegister,
  deleteCashRegister,
} from '../slices/cashRegisterSlice';

import type { UpdateRegisterDTO } from '../dtos/update-register.dto';

import { Label } from '../../../components/UI/Label/Label';

import Spinner from '../../../components/UI/Spinner/Spinner';
import { Select } from '../../../components/UI/Select/Select';
import Input from '../../../components/UI/Input/Input';
import Button from '../../../components/UI/Button/Button';
import { BiSave, BiTrash, BiX } from 'react-icons/bi';
import type { User } from '../../users/interfaces/UserInterface';
import { getAllUsers } from '../../users/slices/usersSlice';

export const EditRegister: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const myAlert = withReactContent(Swal);

  const [userQuery, setUserQuery] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const { codigo } = useParams<{ codigo: string }>();

  const { users } = useAppSelector((state: RootState) => state.users);

  const { cashRegister, loading, error } = useAppSelector(
    (state: RootState) => state.cashRegisters
  );

  const filteredUsers = users.filter((u) =>
    u.usuario.toLowerCase().includes(userQuery.toLowerCase())
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateRegisterDTO>({
    defaultValues: {
      estado: 'abierta',
      montoActual: 0,
    },
  });

  useEffect(() => {
    if (cashRegister) {
      dispatch(getAllUsers());
      reset({
        estado: cashRegister.estado,
        montoActual: cashRegister.montoActual,
        assignedTo: cashRegister.assignedTo?._id,
      });
    }
  }, [cashRegister, reset]);

  useEffect(() => {
    if (!codigo) {
      navigate('/cash-registers');
      return;
    }
    dispatch(getCashRegisterByCode(codigo));
    return () => {
      dispatch(clearSelectedCashRegister());
    };
  }, [dispatch, codigo, navigate]);

  const onSubmit = (updateRegisterDTO: UpdateRegisterDTO) => {
    myAlert
      .fire({
        title: `Actualizar caja`,
        text: `Estas seguro que deseas actualizar esta caja?`,
        icon: 'question',
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: 'Si, guardar',
        cancelButtonText: 'Cancelar',
      })
      .then((result) => {
        if (result.isConfirmed) {
          dispatch(
            updateCashRegister({
              cashRegisterId: cashRegister!._id,
              updateRegisterDTO,
            })
          )
            .unwrap()
            .then(() => {
              myAlert.fire({
                title: 'Cambios guardados!',
                text: 'Se ha actualizado la caja con exito',
                icon: 'success',
                timer: 5000,
                timerProgressBar: true,
              });
              navigate('/cash-registers');
            })
            .catch((error: any) => {
              myAlert.fire({
                title: `Error`,
                text: `Error: ${error.response?.data?.message || error.message}`,
                icon: 'error',
                timer: 5000,
                timerProgressBar: true,
              });
            });
        }
      });
  };

  const onDelRegister = useCallback(
    (registerId: string) => {
      myAlert
        .fire({
          title: `Eliminar caja`,
          text: `Estas seguro que deseas eliminar esta caja?`,
          icon: 'question',
          showConfirmButton: true,
          showCancelButton: true,
          confirmButtonText: 'Si, eliminar',
          cancelButtonText: 'Cancelar',
        })
        .then((result) => {
          if (result.isConfirmed) {
            dispatch(deleteCashRegister(registerId))
              .unwrap()
              .then(() => {
                myAlert.fire({
                  title: 'Caja eliminada',
                  text: `Caja eliminada exitosamente`,
                  icon: 'success',
                  timer: 5000,
                  timerProgressBar: true,
                });
                navigate('/cash-registers');
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

  const cancel = () => {
    myAlert
      .fire({
        title: 'Cancelar edicion!',
        text: `Estas seguro que deseas cancelar la edicion de la caja?`,
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

  if (!loading && error) {
    return (
      <div className="p-6">
        <p className="text-sm text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (loading) {
    return <Spinner />;
  }

  if (!cashRegister) {
    return (
      <div className="p-6">
        <p className="text-gray-600">No existe la caja</p>
        <button>Volver</button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div>
        <h2 className="text-2xl font-semibold">Editar Caja</h2>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md space-y-6"
      >
        <div className="flex flex-col md:flex-col gap-6 items-start">
          <div>
            <Label htmlFor="estado">Estado</Label>
            <Select
              id="estado"
              defaultValue={cashRegister.estado}
              {...register('estado', { required: 'true' })}
            >
              <option value="abierta">Abierta</option>
              <option value="cerrada">Cerrada</option>
            </Select>
          </div>

          <div>
            <Label htmlFor="montoActual">Monto Actual</Label>
            <Input
              id="montoActual"
              placeholder="Monto actual RD$"
              {...register('montoActual', { required: 'El campo monto actual es obligatorio.' })}
            />
            {errors.montoActual && (
              <p className="text-sm text-red-500">{errors.montoActual.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="assignedTo">Usuario asignado</Label>
            <p>{cashRegister.assignedTo?.usuario}</p>
          </div>

          <div>
            <Label htmlFor="assign">Asignar a</Label>
            <Input
              type="text"
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              placeholder="Buscar usuario..."
            />
            {userQuery && (
              <ul className="overflow-auto max-h-40 border rounded-mt-1 bg-white">
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
        </div>

        {error && <div>Error: {error}</div>}

        <div className="flex flex-wrap justify-end gap-3 pt-4 border-t">
          <Button startIcon={<BiSave />} type="submit">
            Guardar
          </Button>
          <Button
            startIcon={<BiTrash />}
            type="button"
            onClick={() => onDelRegister(cashRegister._id)}
          >
            Eliminar
          </Button>
          <Button startIcon={<BiX />} type="button" onClick={cancel}>
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
};
