import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import { validateCode, clearRecoveryState } from '../slices/authSlice';
import type { ValidateCodeDTO } from '../dtos/validate-code.dto';

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

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-4 text-2xl/9 font-bold tracking-tight text-black">Validar Codigo</h2>
      </div>
      <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <p className="text-blac">
            Ingresa el codigo enviado al correo electronico del usuario{' '}
            <strong>{recoveryUser}</strong>.
          </p>
          <div>
            <label htmlFor="codigo" className="text-black">
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
                className="block w-full px-3 py-1.5 border border-gray-300 rounded-full
                  bg-gray-200 text-sm font-semibold text-gray-600 placeholder-gray-400
                  "
              />
              <p className="mt-1 text-sm text-black">Intentos restantes: {10 - attemps}</p>
            </div>

            {error && <div className="text-red-600 text-sm font-semibold py-2">{error}</div>}
          </div>

          <div className="flex flex-wrap gap-2 justify-start">
            <button
              type="submit"
              className="cursor-pointer flex w-fit justify-center rounded-full bg-indigo-600 px-5 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              disabled={loading || attemps >= 10}
            >
              {loading ? 'Validando...' : 'Validar codigo'}
            </button>

            <button
              type="button"
              onClick={cancel}
              className="cursor-pointer flex-w-full justify-center rounded-full bg-black px-5 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-black-200 focus-visible:outline-20 focus:visible:otuline-offset focus:visible:otuline-black-400"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
