import React, { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../hooks/hooks';
import { useNavigate, useParams } from 'react-router-dom';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import {
  clearSelectedProvider,
  deleteProvider,
  getProviderById,
  updateProvider,
} from '../slices/providersSlice';
import type { RootState } from '../../../../store/store';
import { useForm } from 'react-hook-form';
import type { UpdateProviderDTO } from '../dtos/update-provider.dto';
import { Label } from '../../../../components/UI/Label/Label';
import Input from '../../../../components/UI/Input/Input';
import Button from '../../../../components/UI/Button/Button';
import { BiArrowBack, BiSave, BiTrash } from 'react-icons/bi';
import { myAlertError, myAlertSuccess } from '../../../../utils/commonFunctions';
import Spinner from '../../../../components/UI/Spinner/Spinner';
import PageMeta from '../../../../components/common/PageMeta';

export const EditProvider: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const myAlert = withReactContent(Swal);
  const { providerId } = useParams<{ providerId: string }>();

  const { provider, loading, error } = useAppSelector((state: RootState) => state.providers);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateProviderDTO>({
    defaultValues: {
      nombre: '',
      RNC: '',
      telefono: '',
      procedencia: '',
    },
  });

  useEffect(() => {
    if (provider) {
      reset({
        nombre: provider.nombre,
        RNC: provider.RNC,
        telefono: provider.telefono,
        procedencia: provider.procedencia,
      });
    }
  }, [provider, reset]);

  useEffect(() => {
    dispatch(getProviderById(providerId!));
    return () => {
      dispatch(clearSelectedProvider());
    };
  }, [dispatch, providerId, navigate]);

  const onSubmit = (updateProviderDTO: UpdateProviderDTO) => {
    myAlert
      .fire({
        title: 'Actualizar proveedor!',
        text: `Estas seguro que deseas actualizar este proveedor?`,
        icon: 'question',
        showConfirmButton: true,
        confirmButtonText: 'Si, guardar',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
      })
      .then((result) => {
        if (result.isConfirmed) {
          dispatch(
            updateProvider({
              providerId: provider!._id,
              updateProviderDTO,
            })
          )
            .unwrap()
            .then(() => {
              myAlert.fire({
                title: `Cambios guardados`,
                text: `Se ha actualizado el proveedor con exito`,
                icon: 'success',
                timer: 5000,
                timerProgressBar: true,
              });
              navigate(`/products/providers/${provider?._id}`);
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
  };

  const handleDeleteProvider = useCallback(
    (providerId: string) => {
      myAlert
        .fire({
          title: 'Eliminar proveedor',
          text: 'Estas seguro que deseas eliminar este proveedor?',
          icon: 'question',
          showConfirmButton: true,
          confirmButtonText: 'Si, eliminar',
          confirmButtonColor: '#ff6467',
          showCancelButton: true,
          cancelButtonText: 'Cancelar',
        })
        .then((result) => {
          if (result.isConfirmed) {
            dispatch(deleteProvider(providerId))
              .unwrap()
              .then(() => {
                myAlertSuccess(`Proveedor creado!`, `Se ha creado el proveedor con exito!`);
                navigate('/products/providers');
              })
              .catch((error: any) => {
                myAlertError(`Error`, `Error: ${error.response?.data?.message || error.message}`);
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
        text: 'Estas seguro que deseas cancelar la edicion del proveedor?',
        icon: 'question',
        showConfirmButton: true,
        showCancelButton: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          navigate(-1);
        }
      });
  };

  if (loading) {
    return <Spinner />;
  }

  if (!provider) {
    return (
      <div>
        <p>Producto no encontrado.</p>
        <button onClick={() => navigate('/products/providers')}>Volver</button>
      </div>
    );
  }

  return (
    <>
      <PageMeta title="Editar proveedor - PoS v2" description="Editar proveedor" />
      <div className="h-screen h-auto max-h-auto p-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 p-6 max-h-full rounded-lg shadow"
        >
          <div>
            <h2 className="text-3xl/9 md:text-2xl xs:text-xl font-regular">Editar proveedor</h2>
          </div>

          <div className="h-auto lg:grid lg:grid-cols-2 gap-2">
            <div className="">
              <Label htmlFor="nombre">Nombre</Label>
              <Input
                id="nombre"
                {...register('nombre', { required: 'El campo nombre es obligatorio' })}
              />
              {errors.nombre && <p className="text-sm text-red-500">{errors.nombre.message}</p>}
            </div>

            <div className="">
              <Label htmlFor="RNC">RNC</Label>
              <Input id="RNC" {...register('RNC', { required: 'El campo RNC es obligatorio' })} />
              {errors.RNC && <p className="text-sm text-red-500">{errors.RNC.message}</p>}
            </div>

            <div className="">
              <Label htmlFor="telefono">Telefono</Label>
              <Input
                id="telefono"
                {...register('telefono', {
                  required: 'El campo telefono es obligatorio',
                  pattern: {
                    value: /^\+1\s\d{3}-\d{3}-\d{4}$/,
                    message: `El patron debe ser +1 000-000-0000`,
                  },
                })}
              />
              {errors.telefono && <p className="text-sm text-red-500">{errors.telefono.message}</p>}
            </div>

            <div className="">
              <Label htmlFor="procedencia">Procedencia</Label>
              <Input
                id="procedencia"
                {...register('procedencia', { required: 'El campo procedencia es obligatorio.' })}
              />
              {errors.procedencia && (
                <p className="text-sm text-red-500">{errors.procedencia.message}</p>
              )}
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">Error: {error}</p>}

          <div className="flex flex-wrap gap-2 justify-end">
            <Button
              type="submit"
              size="sm"
              startIcon={<BiSave size={20} />}
              onClick={() => navigate(`/products/providers/edit/${provider._id}`)}
              variant="primary"
            >
              Editar
            </Button>
            <Button
              size="sm"
              startIcon={<BiTrash size={20} />}
              onClick={() => handleDeleteProvider(provider._id)}
              className="bg-red-500 text-white dark:bg-red-400 hover:bg-red-700"
            >
              Eliminar
            </Button>
            <Button
              size="sm"
              startIcon={<BiArrowBack size={20} />}
              onClick={cancel}
              variant="outline"
            >
              Volver
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};
