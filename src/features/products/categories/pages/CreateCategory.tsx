import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useAppSelector, useAppDispatch } from '../../../../hooks/hooks';
import type { RootState } from '../../../../store/store';
import { clearCategoryError, createCategory } from '../slices/categoriesSlice';
import type { CreateCategoryDTO } from '../dtos/create-category.dto';
import Button from '../../../../components/UI/Button/Button';
import { Label } from '../../../../components/UI/Label/Label';
import Input from '../../../../components/UI/Input/Input';
import { BiSave, BiX } from 'react-icons/bi';

export const CreateCategory: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const myAlert = withReactContent(Swal);

  const {
    loading,
    error,
    category: createdCategory,
  } = useAppSelector((state: RootState) => state.categories);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateCategoryDTO>({
    defaultValues: {
      nombre: '',
    },
  });

  useEffect(() => {
    if (createdCategory) {
      navigate('/products/categories');
    }
  }, [createdCategory, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearCategoryError());
    };
  }, [dispatch]);

  const onSubmit = (createCategoryDTO: CreateCategoryDTO) => {
    myAlert
      .fire({
        title: 'Crear categoria!',
        text: `Estas seguro que deseas crear la nueva categoria?`,
        icon: 'question',
        showConfirmButton: true,
        confirmButtonText: 'Si, crear',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
      })
      .then((result) => {
        if (result.isConfirmed) {
          dispatch(createCategory(createCategoryDTO))
            .unwrap()
            .then(() => {
              myAlert.fire({
                title: `Creacion categoria!`,
                text: `Se ha creado la categoria exitosamente`,
                icon: 'success',
                timer: 5000,
                timerProgressBar: true,
              });
              navigate('/products/categories');
            })
            .catch((error: any) => {
              myAlert.fire({
                title: 'Error',
                text: `Error: ${error}`,
                icon: 'error',
                timer: 5000,
                timerProgressBar: true,
              });
            });
        }
      });
  };

  return (
    <div className="p-4 space-y-6">
      <div className="space-y-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md space-y-6"
        >
          <h2 className="text-3xl font-regular text-black dark:text-gray-200 mb-4">
            Crear Categoria
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="nombre">Nombre</Label>
              <Input
                id="nombre"
                placeholder="Nombre categoria"
                {...register('nombre', { required: 'El campo nombre es obligatorio' })}
              />
              {errors.nombre && <p className="text-red-600 text-sm">{errors.nombre.message}</p>}
            </div>
          </div>

          {error && (
            <p className="text-center text-red-600 bg-red-100 rounded-md p-2">Error: {error}</p>
          )}

          <div className="flex justify-end pt-4 border-t gap-2 dark:border-gray-700">
            <Button type="submit" size="sm" variant="primary" startIcon={<BiSave size={20} />}>
              {loading ? 'Creando...' : 'Crear'}
            </Button>
            <Button
              size="sm"
              type="button"
              variant="outline"
              startIcon={<BiX size={20} />}
              onClick={() => navigate('/products/categories')}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
