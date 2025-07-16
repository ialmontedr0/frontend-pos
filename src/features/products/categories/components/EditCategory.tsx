import React, { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import { useAppDispatch } from '../../../../hooks/hooks';
import { updateCategory, deleteCategory } from '../slices/categoriesSlice';
import type { UpdateCategoryDTO } from '../dtos/update-category.dto';

import Button from '../../../../components/UI/Button/Button';
import Input from '../../../../components/UI/Input/Input';
import { Label } from '../../../../components/UI/Label/Label';
import { BiSave, BiSolidTrash, BiTrash, BiX } from 'react-icons/bi';
import { Modal } from '../../../../components/UI/Modal/Modal';
import type { Category } from '../interfaces/CategoryInterface';
import { myAlertError, myAlertSuccess } from '../../../../utils/commonFunctions';

interface EditCategoryProps {
  category: Category;
  isOpen: boolean;
  closeModal: () => void;
}

export const EditCategory: React.FC<EditCategoryProps> = ({ category, isOpen, closeModal }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const myAlert = withReactContent(Swal);

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
    if (!category) {
      navigate('/products/categories');
      return;
    }
    return () => {};
  }, [dispatch, category, navigate]);

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
              closeModal();
              myAlertSuccess(`Categoria Actualizada`, 'Categoria actualizada con exito');
            })
            .catch((error: any) => {
              myAlertError(error);
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
          iconHtml: <BiSolidTrash color="red" />,
          customClass: {
            icon: 'no-default-icon-border',
          },
          showConfirmButton: true,
          confirmButtonColor: 'red',
          confirmButtonText: 'Eliminar',
          showCancelButton: true,
          cancelButtonText: 'Cancelar',
        })
        .then((result) => {
          if (result.isConfirmed) {
            dispatch(deleteCategory(categoryId))
              .unwrap()
              .then(() => {
                myAlertSuccess(`Categoria Eliminada`, 'Categoria eliminada con exito');
                navigate(-1);
              })
              .catch((error: any) => {
                myAlertError(`Error: ${error}`);
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
        text: `Estas seguro que deseas cancelar la edicion de la categoria?`,
        icon: 'warning',
        showConfirmButton: true,
        showCancelButton: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          closeModal();
        }
      });
  };

  if (!category) {
    return;
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px]">
        <div className="no-scrollbar relative w-full h-full max-w-[700px] max-h-[500px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-black dark:text-gray-200">
              Editar Categoria
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-200">
              Actualiza los datos de la categoria
            </p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
            <div className="custom-scrollbar h-auto overflow-y-auto px-2 pb-3">
              <div className="">
                <h5 className="text-lg mb-3 font-medium text-black dark:text-gray-200 lg:mb-6">
                  {category.nombre}
                </h5>
                <div className="flex flex-col md:grid md:grid-cols-1 gap-x-6 lg:grid-cols-2">
                  <div className="col-span-2 lg:col-span-1 mb-4">
                    <Label htmlFor="nombre">Nombre</Label>
                    <Input
                      id="nombre"
                      {...register('nombre', { required: 'El campo nombre es obligatorio.' })}
                      placeholder={category.nombre}
                    />
                    {errors.nombre && (
                      <div className="text-sm text-red-500">{errors.nombre.message}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 px-2 my-4 justify-center md:justify-end">
              <Button type="submit" size="sm" variant="primary" startIcon={<BiSave />}>
                Guardar Cambios
              </Button>
              <Button
                size="sm"
                variant="destructive"
                startIcon={<BiTrash />}
                onClick={() => onDelCategory(category._id)}
              >
                Eliminar
              </Button>
              <Button size="sm" variant="outline" startIcon={<BiX />} onClick={cancel}>
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
};
