import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import type { RootState } from '../../../store/store';
import { useAppSelector, useAppDispatch } from '../../../hooks/hooks';
import { createCashRegister, clearCashRegisterError } from '../slices/cashRegisterSlice';

import type { CreateRegisterDTO } from '../dtos/create-register.dto';
import { Label } from '../../../components/UI/Label/Label';
import { Select } from '../../../components/UI/Select/Select';
import Input from '../../../components/UI/Input/Input';
import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';

export const CreateRegister: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const myAlert = withReactContent(Swal);

  const [registerCurrentAmount, setRegisterCurrentAmount] = useState<number>(0);

  const {
    cashRegister: createdCashRegister,
    loading,
    error,
  } = useAppSelector((state: RootState) => state.cashRegisters);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateRegisterDTO>({
    defaultValues: {
      estado: 'abierta',
      montoActual: registerCurrentAmount ?? 0,
    },
  });

  useEffect(() => {
    setRegisterCurrentAmount(0);
  }, []);

  useEffect(() => {
    if (createdCashRegister) {
      navigate('/cash-registers');
    }
  }, [createdCashRegister, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearCashRegisterError());
    };
  }, [dispatch]);

  const onSubmit = (createRegisterDTO: CreateRegisterDTO) => {
    console.log(createRegisterDTO);
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
          dispatch(createCashRegister(createRegisterDTO))
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
                text: `Error: ${error.reponse?.data?.message || error.message}`,
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

  return (
    <div className="p-6">
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
              id="estado"
              {...register('estado')}
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
              {...register('montoActual', {
                valueAsNumber: true,
                setValueAs: (v) => (v === '' ? 0 : Number(v)),
              })}
            />
            {errors.montoActual && (
              <p className="text-sm text-red-500">{errors.montoActual.message}</p>
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
    </div>
  );
};
