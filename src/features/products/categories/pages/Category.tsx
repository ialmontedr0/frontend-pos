import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useAppSelector, useAppDispath } from '../../../../hooks/hooks';
import { getCategoryById, deleteCategory, clearSelectedCategory } from '../slices/categoriesSlice';
import type { RootState } from '../../../../store/store';
import type { User } from '../../../users/interfaces/UserInterface';
import { usersService } from '../../../users/services/usersService';

export const Category: React.FC = () => {
  const dispatch = useAppDispath();
  const navigate = useNavigate();
  const myAlert = withReactContent(Swal);
  const { categoryId } = useParams<{ categoryId: string }>();

  const { category, loading, error } = useAppSelector((state: RootState) => state.categories);

  const [creator, setCreator] = useState<User | null>(null);
  const [updater, setUpdater] = useState<User | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    if (!categoryId) {
      navigate('/products/categories');
      return;
    }
    dispatch(getCategoryById(categoryId));
    return () => {
      dispatch(clearSelectedCategory());
      setCreator(null);
      setUpdater(null);
      setFetchError(null);
    };
  }, [dispatch, categoryId, navigate]);

  useEffect(() => {
    if (!category) return;

    setFetchError(null);
    const loadById = async (userId: string, setter: (u: User | null) => void) => {
      try {
        const userResponse = await usersService.getById(userId);
        setter(userResponse.data);
      } catch (error: any) {
        setter(null);
        setFetchError(`No se pudo obtener el usuario con el ID: ${userId}`);
      }
    };

    if (category.createdBy) {
      loadById(category.createdBy, setCreator);
    }

    if (category.updatedBy) {
      loadById(category.updatedBy, setUpdater);
    }
  }, [category]);

  const handleDeleteCategory = useCallback(
    (categoryId: string) => {
      myAlert
        .fire({
          title: 'Eliminar Categoria',
          text: `Estas seguro que deseas eliminar esta categoria?`,
          icon: 'question',
          showConfirmButton: true,
          confirmButtonText: 'Si, eliminar!',
          showCancelButton: true,
          cancelButtonText: 'Cancelar',
        })
        .then((result) => {
          if (result.isConfirmed) {
            dispatch(deleteCategory(categoryId))
              .unwrap()
              .then(() => {
                myAlert.fire({
                  title: 'Categoria eliminada',
                  text: `Se ha eliminado el cliente con exito!`,
                  icon: 'success',
                  timer: 5000,
                  timerProgressBar: true,
                });
                navigate('/products/categories');
              })
              .catch((error: any) => {
                myAlert.fire({
                  title: 'Error',
                  text: `Error: ${error.response?.data?.message || error.message}`,
                  icon: 'error',
                  timer: 5000,
                  timerProgressBar: true,
                });
              });
          }
        });
    },
    [dispatch, navigate, myAlert]
  );

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-6 max-2-2xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-lg">
      <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
        <h2 className="text-2xl text-black dark:text-white">Categoria</h2>

        <div className="flex-1 space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
            {category?.nombre}
          </h2>

          <div className="grid grid-cols sm:grid-cols-2 gap-x-6 gap-y-2">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Creada por</p>
              <p className="text-gray-800 dark:text-gray-200">
                {creator ? `${creator.usuario}` : 'Cargando...'}
              </p>
            </div>

            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Actualizada por</p>
              <p className="text-gray-800 dark:text-gray-200">
                {updater ? `${updater.usuario}` : 'Cargando...'}
              </p>
            </div>

            {fetchError && (
              <div className="mt-4 p-2 bg-red-100 text-red-700 rounded">{fetchError}</div>
            )}

            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Fecha creacion</p>
              <p className="text-gray-800 dark:text-gray-200">
                {moment(category?.createdAt).format('MMMM Do YYYY, h:mm:ss a')}
              </p>
            </div>

            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Fecha actualizacion</p>
              <p className="text-gray-800 dark:text-gray-200">
                {moment(category?.updatedAt).format('MMMM Do YYYY, h:mm:ss a')}
              </p>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-end space-y-2 sm:space-y-0 sm:space-x-4">
              <button
                onClick={() => navigate('/products/categories')}
                className="w-full sm:w-auto py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              >
                ← Volver
              </button>
              <button
                onClick={() => navigate(`/products/categories/edit/${category?._id}`)}
                className="w-full sm:w-auto py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
              >
                Editar
              </button>
              <button
                onClick={() => handleDeleteCategory(category!._id)}
                className="w-full sm:w-auto py-2 bg-red-200 dark:bg-red-700 text-white dark:text-white rounded"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
