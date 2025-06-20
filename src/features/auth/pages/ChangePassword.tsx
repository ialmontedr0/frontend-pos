import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import { changePassword, clearRecoveryState } from '../slices/authSlice';
import type { ChangePasswordDTO } from '../dtos/change-password.dto';

export const ChangePassword = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const myAlert = withReactContent(Swal);

  const recoveryUser = useAppSelector((state) => state.auth.recoveryUser || '');
  const { loading, error, isUserValidated, isCodeValidated } = useAppSelector(
    (state) => state.auth
  );

  const [nuevaContrasena, setNuevaContrasena] = useState<string>('');
  const [confirmarContrasena, setConfirmarContrasena] = useState<string>('');
  const [validations, setValidations] = useState({
    length: false,
    uppercase: false,
    digit: false,
    match: false,
  });

  useEffect(() => {
    if (!isUserValidated) {
      navigate('/recover-password');
    } else if (!isCodeValidated && isUserValidated) {
      navigate('/validate-code');
    }
  }, [isUserValidated, isCodeValidated, navigate]);

  useEffect(() => {
    setValidations({
      length: nuevaContrasena.length >= 8,
      uppercase: /[A-Z]/.test(nuevaContrasena),
      digit: /[0-9]/.test(nuevaContrasena),
      match: nuevaContrasena === confirmarContrasena && nuevaContrasena.length > 0,
    });
  }, [nuevaContrasena, confirmarContrasena]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.values(validations).includes(false)) return;

    const payload: ChangePasswordDTO = {
      usuario: recoveryUser,
      nuevaContrasena,
      confirmarContrasena,
    };

    const result = await dispatch(changePassword(payload));
    if (changePassword.fulfilled.match(result)) {
      dispatch(clearRecoveryState());
      navigate('/login');
    }
  };

  const cancel = () => {
    myAlert
      .fire({
        title: `Cancelar`,
        text: `Estas seguro que deseas cancelar el cambio de tu contraseña?`,
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
    <div className="flex min-h-full flex-1 flex-col justify-center p-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-2 text-3xl text-center font-semibold tracking-tight text-black">
          Cambiar contrasena
        </h2>
      </div>

      <div className="my-8 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col gap-1">
            <label htmlFor="nuevaContrasena" className="text-black text-sm">
              Nueva contraseña
            </label>

            <input
              type="password"
              value={nuevaContrasena}
              placeholder="Nueva contrasena"
              onChange={(e) => setNuevaContrasena(e.target.value)}
              className="block w-full px-3 py-1.5 border border-gray-300 rounded-full
                  bg-gray-200 text-sm font-semibold text-gray-600 placeholder-gray-400
                  "
            />
          </div>

          <div>
            <label htmlFor="" className="text-black text-sm">
              Confirmar contrasena
            </label>
            <input
              type="password"
              value={confirmarContrasena}
              placeholder="Confirmar contrasena"
              onChange={(e) => setConfirmarContrasena(e.target.value)}
              className="block w-full px-3 py-1.5 border border-gray-300 rounded-full
                  bg-gray-200 text-sm font-semibold text-gray-600 placeholder-gray-400
                  "
            />
          </div>

          {error && <div className="mb-4 text-red-600 bg-red-100 p-2 rounded">{error}</div>}

          <div className="mb-2 space-y-1 text-sm text-white">
            <p className={validations.length ? 'text-green-600' : 'text-red-600'}>
              • Minimo 8 caracteres
            </p>
            <p className={validations.uppercase ? 'text-green-600' : 'text-red-600'}>
              • Al menos una mayuscula
            </p>
            <p className={validations.digit ? 'text-green-600' : 'text-red-600'}>
              • Al menos un digito numerico
            </p>
            <p className={validations.match ? 'text-green-600' : 'text-red-600'}>
              • Contrasenas no coinciden
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 my-8">
            <button
              type="submit"
              disabled={loading || Object.values(validations).includes(false)}
              className="cursor-pointer flex w-fit justify-center rounded-full bg-indigo-600 px-5 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {loading ? 'Guardando...' : 'Cambiar'}
            </button>

            <button
              type="button"
              onClick={cancel}
              className="cursor-pointer flex-w-fit justify-center rounded-full bg-black px-5 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-black-200 focus-visible:outline-20 focus:visible:otuline-offset focus:visible:otuline-black-400"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
