import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import { recoverPassword, clearRecoveryState } from '../slices/authSlice';
import Spinner from '../../../components/UI/Spinner/Spinner';

export const RecoverPassword = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const myAlert = withReactContent(Swal);

  const { loading, error, isUserValidated } = useAppSelector((state) => state.auth);
  const [usuario, setUsuario] = useState<string>('');

  useEffect(() => {
    if (isUserValidated) {
      navigate('/validate-code');
    }
  }, [isUserValidated, navigate]);

  const handleRecoverPass = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(recoverPassword({ usuario }));
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
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-black">
          Recuperacion de contraseña
        </h2>
      </div>
      <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleRecoverPass} className="space-y-6">
          <div>
            <label htmlFor="usuario" className="text-black">
              Nombre de usuario
            </label>
            <div className="mt-2">
              <input
                id="usuario"
                name="usuario"
                type="text"
                placeholder="Ingresa nombre de usuario Ej. user"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                required
                autoComplete="usuario"
                className="block w-full px-3 py-1.5 border border-gray-300 rounded-full
                  bg-gray-200 text-sm font-semibold text-gray-600 placeholder-gray-400
                  "
              />
            </div>
          </div>

          {error && <div className="mb-4 text-red-600 bg-red-100 p-2 rounded">{error}</div>}

          <div className="w-full flex flex-wrap gap-2">
            <button
              type="submit"
              className="flex w-fit justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              disabled={loading}
            >
              {loading ? <Spinner /> : 'Validar'}
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
