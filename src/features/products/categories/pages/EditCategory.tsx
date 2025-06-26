import React, { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import type { RootState } from '../../../../store/store';
import { useAppSelector, useAppDispatch } from '../../../../hooks/hooks';
import {
  getCategoryById,
  clearSelectedCategory,
  updateCategory,
  deleteCategory,
} from '../slices/categoriesSlice';
import type { UpdateCategoryDTO } from '../dtos/update-category.dto';

import Button from '../../../../components/UI/Button/Button';
import Input from '../../../../components/UI/Input/Input';
import { Label } from '../../../../components/UI/Label/Label';

export const EditCategory: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const myAlert = withReactContent(Swal);
  const { categoryId } = useParams<{ categoryId: string }>();

  const { category, loading, error } = useAppSelector((state: RootState) => state.categories);

  const sanitizedCategoryForForm = (c: any): UpdateCategoryDTO => {
    const { nombre } = c;
    return {
      nombre,
    };
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateCategoryDTO>({
    defaultValues: {
      nombre: '',
    },
  });

  useEffect(() => {
    if (category) {
      reset(sanitizedCategoryForForm(category));
    }
  }, [category, reset]);

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

  const onSubmit = (updateCategoryDTO: UpdateCategoryDTO) => {
    myAlert
      .fire({
        title: 'Actualizar categoria',
        text: `Estas seguro que deseas guardar los cambios?`,
        icon: 'question',
        showConfirmButton: true,
        confirmButtonText: 'Si, guardar',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
      })
      .then((result) => {
        if (result.isConfirmed) {
          dispatch(updateCategory({ categoryId: category!._id, updateCategoryDTO }))
            .then(() => {
              myAlert.fire({
                title: 'Cambios guardados!',
                text: `Se guardaron los cambios con exito`,
                icon: 'success',
                timer: 5000,
                timerProgressBar: true,
              });
              navigate('/products/categories');
            })
            .catch((error: any) => {
              myAlert.fire({
                title: `Error`,
                text: `Error: ${error.response?.data?.message || error.message}`,
                icon: 'error',
                timer: 5000,
                timerProgressBar: true,
              });
              navigate('/products/categories');
            });
        }
      });
  };

  const onDelCategory = useCallback(
    (categoryId: string) => {
      myAlert
        .fire({
          title: 'Eliminar categoria',
          text: `Estas seguro que deseas eliminar esta categoria?`,
          icon: 'question',
          showConfirmButton: true,
          confirmButtonText: 'Si, guardar',
          showCancelButton: true,
          cancelButtonText: 'Cancelar',
        })
        .then((result) => {
          if (result.isConfirmed) {
            dispatch(deleteCategory(categoryId))
              .unwrap()
              .then(() => {
                myAlert.fire({
                  title: `Categoria Eliminada`,
                  text: 'Categoria eliminada con exito',
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

  const cancel = () => {
    myAlert
      .fire({
        title: 'Cancelar edicion!',
        text: `Estas seguro que deseas cancelar la edicion del usuario?`,
        icon: 'warning',
        showConfirmButton: true,
        showCancelButton: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          dispatch(clearSelectedCategory());
          navigate('/products/categories');
        }
      });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500 dark:text-gray-400">Cargando datos de la categoria...</p>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="p-6 max-w-lg mx-auto bg-white dark:bg-gray-800 rounded-lg shadow">
        <p className="text-gray-500 dark:text-gray-400">Categoria no encontrada</p>
      </div>
    );
  }

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md space-y-6"
      >
        <h2 className="text-2xl font-semibold text-black dark:text-white">Editar Categoria</h2>
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div>
            <Label htmlFor="nombre">Nombre</Label>
            <Input
              id="nombre"
              placeholder="Nombre categoria"
              {...register('nombre', { required: 'El campo nombre es obligatorio' })}
            />
            {errors.nombre && <p className="text-sm text-red-500">{errors.nombre.message}</p>}
          </div>
        </div>

        {error && <div>Error: {error}</div>}

        <div className="flex flex-wrap justify-end gap-3 pt-4 border-t dark:border-gray-700">
          <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white">
            Guardar
          </Button>
          <Button
            type="button"
            onClick={() => onDelCategory(category._id)}
            className="bg-red-600 hover:bg-red-700"
          >
            Eliminar
          </Button>
          <Button type="button" variant="outline" onClick={cancel}>
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
};
