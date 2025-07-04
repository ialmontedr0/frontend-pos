import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import { validateCode, clearRecoveryState } from '../slices/authSlice';
import type { ValidateCodeDTO } from '../dtos/validate-code.dto';
import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';
import { AiOutlineNumber } from 'react-icons/ai';

export const ValidateCode = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const myAlert = withReactContent(Swal);

  const { loading, error, isUserValidated, isCodeValidated, recoveryUser } = useAppSelector(
    (state) => state.auth
  );

  const [attemps, setAttemps] = useState<number>(0);
  const [codigo, setCodigo] = useState<string>('');

  useEffect(() => {
    if (!isUserValidated) {
      navigate('/recover-password');
    }
  }, [isUserValidated, navigate]); /* :contentReference[oacite:11]{index=11} */

  useEffect(() => {
    if (isCodeValidated) {
      navigate('/change-password'); /* :contentReference[oacite:12]{index=12} */
    }
  }, [isCodeValidated, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (attemps >= 50) return;
    setAttemps((prev) => prev + 1);

    const payload: ValidateCodeDTO = { usuario: recoveryUser || '', codigo };

    dispatch(validateCode(payload));
  };

  const cancel = () => {
    myAlert
      .fire({
        title: `Cancelar`,
        text: `Estas seguro que deseas cancelar la recuperacion de tu contraseña?`,
        icon: 'warning',
        showConfirmButton: true,
        showCancelButton: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          dispatch(clearRecoveryState());
          navigate('/login');
        }
      });
  };

  {
    /* <div className="flex min-h-full flex-1 h-screen border-2 border-black flex-col m-4 lg:justify-center md:justify-start sm:justify-start px-6 py-12 lg:px-8">
      <div className="border border-green-900 sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-4 text-3xl font-regular tracking-tight text-black">Validar Codigo</h2>
      </div>
      <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-sm">

      </div>
    </div> */
  }

  return (
    <div className="border-3 border-black m-4 h-screen flex flex-1 justify-center space-y-4">
      <div className="w-lg h-fit mt-12 pb-12 px-4 border-2 border-green-900 rounded-lg my-2 p-2">
        <div className="border-2 border-blue-900 h-auto py-2 my-2">
          <h2 className="text-3xl font-regular">Validar Codigo</h2>
        </div>
        <form onSubmit={handleSubmit} className="">
          <div>
            <label htmlFor="codigo" className="text-black">
              Codigo (6 caracteres A-Z, 0-9)
            </label>
            <div className="relative my-2">
              <Input
                type="text"
                name="usuario"
                value={codigo}
                onChange={(e) => {
                  const val = e.target.value.toUpperCase();
                  if (/^[A-Z0-9]{0,6}$/.test(val)) {
                    setCodigo(val);
                  }
                }}
                placeholder="Ingresa el codigo"
                className="dark:bg-white placeholder:text-gray-500"
                required
              />
              <span className="absolute z-30 -translate-y-1/2 right-4 top-1/2">
                <AiOutlineNumber className="fill-gray-500 dark:fill-gray-400 size-5" />
              </span>
            </div>
            <p className="mt-1 text-sm text-black">Intentos restantes: {10 - attemps}</p>

            {error && (
              <div className="my-4 text-red-600 bg-red-100 p-2 rounded-lg text-sm">
                Error: {error}
              </div>
            )}

            {loading && <Spinner />}
          </div>

          <div className="flex flex-wrap gap-2 my-2 justify-start">
            <Button size="sm" type="submit" variant="primary" disabled={loading || attemps >= 10}>
              {loading ? 'Validando...' : 'Validar codigo'}
            </Button>

            <Button size="sm" variant="outline" type="button" onClick={cancel}>
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
