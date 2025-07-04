import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import { recoverPassword, clearRecoveryState } from '../slices/authSlice';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Button from '../../../components/UI/Button/Button';
import Input from '../../../components/UI/Input/Input';
import { UserIcon } from '../../../assets/icons';

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
    <div className="flex min-h-full flex-1 flex-col justify-start px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-4 text-3xl font-regular tracking-tight text-black">
          Recuperacion de contraseña
        </h2>
      </div>
      <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleRecoverPass} className="space-y-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="usuario" className="text-black">
              Nombre de usuario
            </label>
            <p className='text-sm text-gray-600'>Ingresa tu nombre de usuario para validar.</p>
            <div className="relative">
              <Input
                type="text"
                name="usuario"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                placeholder="Ingresa tu nombre de usuario"
                className="dark:bg-white placeholder:text-gray-500"
                required
              />
              <span className="absolute z-30 -translate-y-1/2 right-4 top-1/2">
                <UserIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
              </span>
            </div>
          </div>

          {loading && <Spinner />}

          {error && <div className="mb-4 text-red-600 bg-red-100 p-2 rounded-lg text-sm">Error: {error}</div>}

          <div className="w-full flex flex-wrap gap-2">
            <Button size="sm" type="submit" variant="primary" disabled={loading}>
              {loading ? `Validando` : 'Validar'}
            </Button>

            <Button size="sm" type="button" onClick={cancel} variant="outline">
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
