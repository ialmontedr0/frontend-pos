import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import { recoverPassword, clearRecoveryState } from '../slices/authSlice';
import Button from '../../../components/UI/Button/Button';
import Input from '../../../components/UI/Input/Input';
import { CheckLineIcon, UserIcon } from '../../../assets/icons';
import { Label } from '../../../components/UI/Label/Label';
import { BiSolidKey, BiX } from 'react-icons/bi';

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
        iconHtml: <BiSolidKey />,
        customClass: {
          icon: 'no-default-icon-border'
        },
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
    <>
      <div className="flex items-center justify-center min-h-screen px-4 items-start md:items-center my-4 md:my-auto">
        <div className="border border-gray-200 rounded-lg shadow-theme-md px-6 py-8 w-full max-w-lg">
          <div>
            <div className="my-4 sm:mb-8">
              <h1 className="font-outfit mb-2 text-3xl font-medium text-gray-800 dark:text-black sm:text-title-md">
                Recuperacion de Contraseña
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Ingresa tu nombre de usuario para validacion!
              </p>
            </div>
            <div>
              <div className="relative py-3">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
                </div>
              </div>
              <form onSubmit={handleRecoverPass}>
                <div className="space-y-6">
                  <div>
                    <Label>
                      Usuario <span className="text-error-500">*</span>{' '}
                    </Label>
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
                        <UserIcon className="text-gray-400 dark:text-gray-200 size-5" />
                      </span>
                    </div>
                  </div>

                  {error && (
                    <div className="mb-4 text-red-600 text-sm">
                      Error al validar el usuario: {error}
                    </div>
                  )}
                </div>
                <div className="my-4 flex justify-center gap-2">
                  <Button
                    variant="primary"
                    type="submit"
                    size="sm"
                    startIcon={<CheckLineIcon fontSize={20} />}
                  >
                    {loading ? 'Validando' : 'Validar'}
                  </Button>
                  <Button
                    variant="outline"
                    type="button"
                    size="sm"
                    startIcon={<BiX size={20} />}
                    onClick={cancel}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
