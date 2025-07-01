import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import { validateCode, clearRecoveryState } from '../slices/authSlice';
import type { ValidateCodeDTO } from '../dtos/validate-code.dto';
import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';

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
    <div className="flex min-h-full flex-1 flex-col lg:justify-center md:justify-start sm:justify-start px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-4 text-3xl font-regular tracking-tight text-black">Validar Codigo</h2>
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
                  bg-gray-200 text-sm font-regular text-gray-600 placeholder-gray-400
                  "
              />
              <p className="mt-1 text-sm text-black">Intentos restantes: {10 - attemps}</p>
            </div>

            {error && <div className="text-red-600 text-sm font-semibold py-2">{error}</div>}

            {loading && <Spinner />}
          </div>

          <div className="flex flex-wrap gap-2 justify-start">
            <Button type="submit" variant="primary" disabled={loading || attemps >= 10}>
              {loading ? 'Validando...' : 'Validar codigo'}
            </Button>

            <Button className='dark:bg-gray-400' type="button" onClick={cancel} variant="outline">
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
