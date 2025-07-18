//src/features/auth/pages/LoginPage
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import type { RootState } from '../../../store/store';
import { login, clearAuth } from '../slices/authSlice';

import type { LoginDTO } from '../types/auth';

import Checkbox from '../../../components/UI/Checkbox/Checkbox';
import { Label } from '../../../components/UI/Label/Label';
import Input from '../../../components/UI/Input/Input';
import Button from '../../../components/UI/Button/Button';
import { EyeCloseIcon, EyeIcon, UserIcon } from '../../../assets/icons';

export const LogInPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [form, setForm] = useState<LoginDTO>({
    usuario: '',
    contrasena: '',
  });

  const { loading, error } = useAppSelector((state: RootState) => state.auth);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    dispatch(clearAuth());
    const response = await dispatch(login(form));
    if (login.fulfilled.match(response)) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 items-start md:items-center my-4 md:my-auto">
      <div className="border border-gray-200 rounded-lg shadow-theme-md px-6 py-8 w-full max-w-lg">
        <div>
          <div className="my-4 sm:mb-8">
            <h1 className="font-outfit mb-2 text-3xl font-medium text-gray-800 dark:text-black sm:text-title-md">
              Iniciar sesion
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Ingresa tu nombre de usuario y contrasena para iniciar sesion!
            </p>
          </div>
          <div>
            <div className="relative py-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
              </div>
            </div>
            <form onSubmit={handleLogin}>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="usuario">
                    Usuario <span className="text-error-500">*</span>{' '}
                  </Label>
                  <div className="relative">
                    <Input
                      type="text"
                      name="usuario"
                      value={form.usuario}
                      onChange={(e) => {
                        setForm({ ...form, usuario: e.target.value });
                      }}
                      placeholder="Ingresa tu nombre de usuario"
                      className="dark:bg-white placeholder:text-gray-500"
                      required
                    />
                    <span className="absolute z-30 -translate-y-1/2 right-4 top-1/2">
                      <UserIcon className="text-gray-400 dark:text-gray-200 size-5" />
                    </span>
                  </div>
                </div>
                <div>
                  <Label htmlFor="contrasena">
                    Contrasena <span className="text-error-500">*</span>{' '}
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      name="contrasena"
                      id="contrasena"
                      value={form.contrasena}
                      onChange={(e) => setForm({ ...form, contrasena: e.target.value })}
                      placeholder="Ingresa tu contrasena"
                      className="dark:bg-white placeholder:text-gray-500"
                      required
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox checked={isChecked} onChange={setIsChecked} />
                    <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                      Mantener la sesion abierta.
                    </span>
                  </div>

                  <Link
                    to="/auth/recover-password"
                    className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    Olvidaste tu contrasena?
                  </Link>
                </div>

                {error && (
                  <div className="mb-4 text-red-600 text-sm">Error al iniciar sesion: {error}</div>
                )}
              </div>
              <div className="my-4 flex justify-center">
                <Button type="submit" size="sm">
                  {loading ? 'Iniciando' : 'Iniciar Sesion'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
