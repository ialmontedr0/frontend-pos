import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import { clearAuth, login } from '../slices/authSlice';
import type { LoginDTO } from '../types/auth';
import { useState } from 'react';
import logoFull from '../../../assets/logo_full.png';
import { Input } from '../../../components/UI/Input/Input';
import Spinner from '../../../components/UI/Spinner/Spinner';

export const Login = () => {
  const dispatch = useAppDispatch();
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
    <div className="flex h-screen m-2 max-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="justify-center p-4 bg-gray-100 rounded-md shadow-lg">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img className="mx-auto h-64 w-auto" src={logoFull} alt="Logo" />
          <h2 className="mt-2 text-center text-3xl font-semibold tracking-tight text-black">
            Iniciar Sesion
          </h2>
        </div>

        <div className="mt-1 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="usuario" className="block text-lg font-semibold text-blue-900">
                Usuario
              </label>
              <div className="mt-2">
                <Input
                  type="text"
                  name="usuario"
                  value={form.usuario}
                  onChange={(e) => setForm({ ...form, usuario: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="contrasena" className="block text-lg font-semibold text-blue-900">
                  Contrasena
                </label>
                <div className="text-sm">
                  <a
                    href="/auth/recover-password"
                    className="font-semibold text-indigo-600 hover:text-indigo-500"
                  >
                    Olvidaste tu contrasena?
                  </a>
                </div>
              </div>
              <div className="mt-2">
                <Input
                  type="password"
                  name="contrasena"
                  id="contrasena"
                  value={form.contrasena}
                  autoComplete="current-password"
                  onChange={(e) => setForm({ ...form, contrasena: e.target.value })}
                />
              </div>
            </div>

            {error && <div className="mb-4 text-red-600 bg-red-100 p-2 rounded">{error}</div>}

            <div className="flex justify-center">
              <button
                type="submit"
                className="cursor-pointer flex w-fit justify-center rounded-full bg-indigo-600 px-5 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                disabled={loading}
              >
                {loading ? <Spinner /> : 'Ingresar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
