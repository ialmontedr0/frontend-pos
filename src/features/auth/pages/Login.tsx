import { useNavigate } from 'react-router-dom';
import { useAppDispath, useAppSelector } from '../../../hooks/hooks';
import { clearAuth, login } from '../slices/authSlice';
import type { LoginDTO } from '../types/auth';
import { useState } from 'react';

export const Login = () => {
  const dispatch = useAppDispath();
  const navigate = useNavigate();
  const [form, setForm] = useState<LoginDTO>({
    usuario: '',
    contrasena: '',
  });
  const { loading, error } = useAppSelector((state) => state.auth);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearAuth());

    const response = await dispatch(login(form));
    if (login.fulfilled.match(response)) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          className="mx-auto h-10 w-auto"
          src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
          alt="Logo"
        />
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">
          Inicio de Sesion
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="usuario" className="block text-sm/6 font-medium text-gray-900">
              Usuario
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="usuario"
                value={form.usuario}
                onChange={(e) => setForm({ ...form, usuario: e.target.value })}
                required
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="contrasena" className="block text-sm/6 font-medium text-gray-900">
                Contrasena
              </label>
              <div className="text-sm">
                <a
                  href="/recover-password"
                  className="font-semibold text-indigo-600 hover:text-indigo-500"
                >
                  Olvidaste tu contrasena?
                </a>
              </div>
            </div>
            <div className="mt-2">
              <input
                type="password"
                name="contrasena"
                id="contrasena"
                value={form.contrasena}
                autoComplete="current-password"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                onChange={(e) => setForm({ ...form, contrasena: e.target.value })}
              />
            </div>
          </div>

          {error && <div className="mb-4 text-red-600 bg-red-100 p-2 rounded">{error}</div>}

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              disabled={loading}
            >
              {loading ? 'Ingresando' : 'Ingresar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
