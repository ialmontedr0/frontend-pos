import React, { useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment/min/moment-with-locales';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import { useAppSelector, useAppDispatch } from '../../../../hooks/hooks';
import { getCategoryById, deleteCategory, clearSelectedCategory } from '../slices/categoriesSlice';
import type { RootState } from '../../../../store/store';
import PageMeta from '../../../../components/common/PageMeta';
import PageBreadcrum from '../../../../components/common/PageBreadCrumb';
import { Label } from '../../../../components/UI/Label/Label';
import Button from '../../../../components/UI/Button/Button';
import { BiArrowBack, BiEdit, BiTrash } from 'react-icons/bi';
import Spinner from '../../../../components/UI/Spinner/Spinner';
import { NotFound } from '../../../../pages/NotFound';
import { toast } from '../../../../components/UI/Toast/hooks/useToast';

export const Category: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const myAlert = withReactContent(Swal);
  const { categoryId } = useParams<{ categoryId: string }>();
  moment.locale('es');

  const { category, loading, error } = useAppSelector((state: RootState) => state.categories);

  useEffect(() => {
    if (!categoryId) {
      navigate('/products/categories');
      return;
    }
    dispatch(getCategoryById(categoryId));
    return () => {
      dispatch(clearSelectedCategory());
    };
  }, [dispatch, categoryId, navigate]);

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
                toast({
                  title: 'Error',
                  description: `Error al eliminar la categoria: ${error}`,
                  variant: 'destructive',
                });
              });
          }
        });
    },
    [dispatch, navigate, myAlert]
  );

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  {
    /* <div className="p-6 max-2-2xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-lg">
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
    </div> */
  }

  if (!category) {
    return <NotFound node="Categoria" />;
  }

  return (
    <>
      <PageMeta title="Categoria - PoS v2" description="Detalles de la categoria" />
      <PageBreadcrum pageTitle="Categoria" />
      <div className="p-6 flex flex-col max-w-2xl  my-4 mx-2 md:mx-auto text-black dark:text-gray-200 bg-white dark:bg-gray-900 rounded-lg shadow">
        <div className="my-4">
          <h2 className="text-3xl font-regular">Detalles Categoria</h2>
        </div>

        <div className="grid grid-cols-2 md:flex-col sm:flex-col xs:flex-col space-y-4">
          <div>
            <Label htmlFor="nombre">Nombre</Label>
            <p>{category.nombre}</p>
          </div>

          <div>
            <Label htmlFor="createdBy">Creada por</Label>
            <p>{category.createdBy.usuario}</p>
          </div>

          <div>
            <Label htmlFor="createdAt">Fecha Creacion</Label>
            <p>{moment(category.createdAt).format('LLLL')}</p>
          </div>

          {category.updatedBy && (
            <div>
              <Label htmlFor="updatedBy">Actualizada por</Label>
              <p>{category.updatedBy.usuario}</p>
            </div>
          )}

          {category.updatedAt && (
            <div>
              <Label htmlFor="updatedAt">Fecha Actualizacion</Label>
              <p>{moment(category.updatedAt).format('LLLL')}</p>
            </div>
          )}
        </div>

        <div className="w-auto flex flex-wrap gap-2 my-5">
          <Button onClick={() => navigate(-1)} size="sm" startIcon={<BiArrowBack size={20} />}>
            Volver
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate(`/products/categories/edit/${category._id}`)}
            startIcon={<BiEdit size={20} />}
          >
            Editar
          </Button>
          <Button
            onClick={() => handleDeleteCategory(category._id)}
            size="sm"
            variant="destructive"
            startIcon={<BiTrash size={20} />}
          >
            Eliminar
          </Button>
        </div>
      </div>
    </>
  );
};
