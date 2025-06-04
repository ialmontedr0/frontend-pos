import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';

import { useAppDispath, useAppSelector } from '../../../hooks/hooks';
import type { RootState } from '../../../store/store';

import { getUserById, clearSelectedUser } from '../slices/usersSlice';
import { usersService } from '../services/usersService';

import type { User } from '../interfaces/UserInterface';

export function User() {
  const { userId } = useParams<{ userId: string }>();
  const dispatch = useAppDispath();
  const navigate = useNavigate();

  const { user, loading, error } = useAppSelector((state: RootState) => state.users);

  // Estados locales para creator y updater
  const [creator, setCreator] = useState<User | null>(null);
  const [updater, setUpdater] = useState<User | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      navigate('/users');
      return;
    }
    dispatch(getUserById(userId));
    return () => {
      dispatch(clearSelectedUser());
      setCreator(null);
      setUpdater(null);
      setFetchError(null);
    };
  }, [dispatch, userId, navigate]);

  useEffect(() => {
    if (!user) return;

    setFetchError(null);

    const loadById = async (userId: string, setter: (u: User | null) => void) => {
      try {
        const userResponse = await usersService.getById(userId);
        setter(userResponse.data);
      } catch (error: any) {
        setter(null);
        setFetchError(
          `No se pudo obtener el usuario con el ID: ${userId}: ${error.response?.data?.message || error.message}`
        );
      }
    };

    if (user.createdBy) {
      loadById(user.createdBy, setCreator);
    }

    if (user.updatedBy) {
      loadById(user.updatedBy, setUpdater);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500 dark:text-gray-400">Cargando usuario...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-lg mx-auto bg-white dark:bg-gray-800 rounded-lg shadow">
        <p className="text-red-600 dark:text-red-400">Error: {error}</p>
        <button
          onClick={() => navigate('/users')}
          className="mt-4 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          Volver
        </button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6 max-w-lg mx-auto bg-white dark:bg-gray-800 rounded-lg shadow">
        <p className="text-gray-500 dark:text-gray-400">Usuario no encontrado</p>
        <button
          onClick={() => navigate('/users')}
          className="mt-4 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          Volver
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-lg">
      <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
        <div className="flex-shrink-0">
          <img
            src={
              user.foto ||
              'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Blank_portrait%2C_male_%28rectangular%29.png/1200px-Blank_portrait%2C_male_%28rectangular%29.png'
            }
            alt={`Foto de ${user.usuario}`}
            className="w-32 h-32 md:w-40 md:h-40 rounded-full border-2 border-gray-200 dark:border-gray-700 object-cover"
          />
        </div>
      </div>

      <div className="flex-1 space-y-4">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
          {user.nombre} {user.apellido}
        </h2>
        <div className="grid grid-cols sm:grid-cols-2 gap-x-6 gap-y-2">
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Usuario</p>
            <p className="text-gray-800 dark:text-gray-200">{user.usuario}</p>
          </div>

          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Correo</p>
            <p className="text-gray-800 dark:text-gray-200">{user.correo}</p>
          </div>

          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Telefono</p>
            <p className="text-gray-800 dark:text-gray-200">{user.telefono}</p>
          </div>

          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Rol</p>
            <p className="text-gray-800 dark:text-gray-200">
              {user.rol.charAt(0).toUpperCase() + user.rol.slice(1)}
            </p>
          </div>

          {user.createdBy && (
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Creado por</p>
              <p className="text-gray-700 dark:text-gray-200">
                {creator ? `${creator.usuario}` : 'Cargando...'}
              </p>
            </div>
          )}
          {user.updatedBy && (
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Actualizado por</p>
              <p className="text-gray-700 dark:text-gray-200">
                {updater ? `${updater.usuario}` : 'Cargando...'}
              </p>
            </div>
          )}

          {fetchError && (
            <div className="mt-4 p-2 bg-red-100 text-red-700 rounded">{fetchError}</div>
          )}

          {/** Fecha creacion y ultima actualizacion */}
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Fecha creacion</p>
            <p className="text-gray-800 dark:text-gray-200">
              {moment(user.createdAt).format('MMMM Do YYYY, h:mm:ss a')}
            </p>
          </div>

          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Ultima actualizacion</p>
            <p className="text-gray-800 dark:text-gray-200">
              {moment(user.updatedAt).format('MMMM Do YYYY, h:mm:ss a')}
            </p>
          </div>

          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Estado</p>
            <p
              className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                user.estado === 'activo'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
              }`}
            >
              {user.estado.charAt(0).toUpperCase() + user.estado.slice(1)}
            </p>
          </div>
        </div>
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-end space-y-2 sm:space-y-0 sm:space-x-4">
          <button
            onClick={() => navigate('/users')}
            className="w-full sm:w-auto px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            ← Volver
          </button>

          <button
            onClick={() => navigate(`/users/edit/${user._id}`)}
            className="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white rounded hover:indigo-700 transition"
          >
            Editar usuario
          </button>
        </div>
      </div>
    </div>
  );
}
