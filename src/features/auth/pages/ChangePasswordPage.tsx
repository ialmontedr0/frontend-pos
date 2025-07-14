import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import { changePassword, clearRecoveryState } from '../slices/authSlice';
import type { ChangePasswordDTO } from '../dtos/change-password.dto';
import Button from '../../../components/UI/Button/Button';
import Input from '../../../components/UI/Input/Input';
import { CheckLineIcon, EyeCloseIcon, EyeIcon } from '../../../assets/icons';
import { Label } from '../../../components/UI/Label/Label';
import { BiX } from 'react-icons/bi';

export const ChangePassword = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const myAlert = withReactContent(Swal);

  const recoveryUser = useAppSelector((state) => state.auth.recoveryUser || '');
  const { loading, error, isUserValidated, isCodeValidated } = useAppSelector(
    (state) => state.auth
  );

  const [showPassword, setShowPassword] = useState<boolean>(false);
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
    <>
      <div className="flex items-center justify-center min-h-screen px-4 items-start md:items-center my-4 md:my-auto">
        <div className="border border-gray-200 rounded-lg shadow-theme-md px-6 py-8 w-full max-w-lg">
          <div>
            <div className="my-4 sm:mb-8">
              <h1 className="font-outfit mb-2 text-3xl font-medium text-gray-800 dark:text-black sm:text-title-md">
                Cambiar Contrasena
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Ingresa tu nueva contraseña!
              </p>
            </div>
            <div>
              <div className="relative py-3">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
                </div>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div>
                    <Label>
                      Nueva Contraseña
                      <span className="text-error-500"> *</span>
                    </Label>
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        name="nuevaContrasena"
                        id="nuevaContrasena"
                        value={nuevaContrasena}
                        onChange={(e) => setNuevaContrasena(e.target.value)}
                        placeholder="Ingresa tu nueva contrasena"
                        className="dark:bg-white placeholder:text-gray-500"
                        required
                      />
                      <span
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                      >
                        {showPassword ? (
                          <EyeIcon className="fill-gray-400 dark:fill-gray-400 size-5" />
                        ) : (
                          <EyeCloseIcon className="fill-gray-400 dark:fill-gray-400 size-5" />
                        )}
                      </span>
                    </div>
                  </div>
                  <div>
                    <Label>
                      Confirmar Contrasena
                      <span className="text-error-500"> *</span>
                    </Label>
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        name="confirmarContrasena"
                        id="confirmarContrasena"
                        value={confirmarContrasena}
                        onChange={(e) => setConfirmarContrasena(e.target.value)}
                        placeholder="Confirma tu contrasena"
                        className="dark:bg-white placeholder:text-gray-500"
                        required
                      />
                      <span
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                      >
                        {showPassword ? (
                          <EyeIcon className="fill-gray-400 dark:fill-gray-400 size-5" />
                        ) : (
                          <EyeCloseIcon className="fill-gray-400 dark:fill-gray-400 size-5" />
                        )}
                      </span>
                    </div>
                  </div>

                  {error && (
                    <div className="mb-4 text-red-600 text-sm">
                      Error al cambiar la contrasena: {error}
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
                    {loading ? 'Cambiando' : 'Cambiar Contraseñaf'}
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
