import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useAppDispath, useAppSelector } from '../../../hooks/hooks';
import { validateCode, clearRecoveryState } from '../slices/authSlice';
import type { ValidateCodeDTO } from '../dtos/validate-code.dto';

export const ValidateCode = () => {
  const dispatch = useAppDispath();
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

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">
          Validar Codigo
        </h2>
      </div>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <p className="text-white">
            Ingresa el codigo enviado al correo electronico del usuario{' '}
            <strong>{recoveryUser}</strong>.
          </p>
          <div>
            <label htmlFor="codigo" className="text-white">
              Codigo (6 caracteres A-Z, 0-9)
            </label>
            <div className="mt-2">
              <input
                type="text"
                value={codigo}
                onChange={(e) => {
                  const val = e.target.value.toUpperCase();
                  if (/^[A-Z0-9]{0,6}$/.test(val)) {
                    setCodigo(val);
                  }
                }}
                placeholder="ABC123"
                required
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-2 focus:outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
              <p className="mt-1 text-sm text-white">Intentos restantes: {10 - attemps}</p>
            </div>

            {error && <div className="mb-4 text-red-600 bg-red-100 p-2 rounded">{error}</div>}
          </div>

          <div className="flex justify-between">
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              disabled={loading || attemps >= 10}
            >
              {loading ? 'Validando...' : 'Validar codigo'}
            </button>

            <button
              type="button"
              onClick={cancel}
              className="flex-w-full justify-center rounded-md bg-black px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-black-200 focus-visible:outline-20 focus:visible:otuline-offset focus:visible:otuline-black-400"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
