import { useCallback } from 'react';

import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import type { RootState } from '../../../store/store';
import { createBranche, clearBrancheError } from '../slices/branchesSlice';

import type { CreateBrancheDTO } from '../dtos/create-branche.dto';

import { BiArrowBack, BiSave, BiSolidSave } from 'react-icons/bi';
import PageMeta from '../../../components/common/PageMeta';
import Button from '../../../components/UI/Button/Button';
import { myAlertError, myAlertSuccess } from '../../../utils/commonFunctions';
import { Label } from '../../../components/UI/Label/Label';
import Input from '../../../components/UI/Input/Input';
import Spinner from '../../../components/UI/Spinner/Spinner';

export const CreateBranche: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const myAlert = withReactContent(Swal);

  const { loading, error } = useAppSelector((state: RootState) => state.branches);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateBrancheDTO>({
    defaultValues: {
      nombre: '',
      direccion: {
        calle: '',
        ciudad: '',
      },
      telefono: '',
    },
  });

  const onSubmit = useCallback(
    (createBrancheDTO: CreateBrancheDTO) => {
      myAlert
        .fire({
          title: `Crear Sucursal`,
          text: `Estas seguro que deseas crear esta nueva sucursal?`,
          iconHtml: <BiSolidSave />,
          customClass: {
            icon: 'no-default-icon-border',
          },
          showConfirmButton: true,
          showCancelButton: true,
          confirmButtonText: 'Guardar',
          cancelButtonText: 'Cancelar',
        })
        .then((result) => {
          if (result.isConfirmed) {
            dispatch(createBranche(createBrancheDTO))
              .unwrap()
              .then(() => {
                myAlertSuccess(`Sucursal Creada`, `Se ha creado la sucursal con exito`);
                navigate('/branches');
                reset();
              })
              .catch((error: any) => {
                myAlertError(error);
              });
          }
        });
    },
    [dispatch, myAlert, myAlertSuccess, myAlertError]
  );

  const cancel = () => {
    myAlert
      .fire({
        title: `Cancelar Creacion!`,
        text: `Estas seguro que deseas cancelar la creacion de la nueva sucursal?`,
        icon: 'question',
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: 'Cancelar',
        cancelButtonText: 'Continuar',
      })
      .then((result) => {
        if (result.isConfirmed) {
          reset();
          clearBrancheError();
          navigate('/branches');
        }
      });
  };

  return (
    <>
      <PageMeta title="Crear Sucursal - PoS v2" description="Nueva Sucursal" />
      <div className="p-4 space-y-6">
        <div className="space-y-4">
          <div className="my-2">
            <h2 className="text-2xl md:text-3xl font-medium">Nueva Sucursal</h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-3 md:grid md:grid-cols-2 md:space-x-3">
              <div>
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  type="text"
                  placeholder="Nombre de la Sucursal"
                  {...register('nombre', { required: 'El campo nombre es obligatorio' })}
                />
                {errors.nombre && (
                  <div className="text-sm text-red-500">{errors.nombre.message}</div>
                )}
              </div>

              <div>
                <Label htmlFor="direccion">Direccion</Label>
                <div>
                  <Label htmlFor="direccion.calle">Calle</Label>
                  <Input
                    id="calle"
                    placeholder="Ingresa la calle de la sucursal"
                    {...register('direccion.calle', { required: 'El campo calle es obligatorio' })}
                  />
                  {errors.direccion?.calle && (
                    <div className="text-sm text-red-500">{errors.direccion?.calle.message}</div>
                  )}
                </div>
                <div>
                  <Label htmlFor="direccion.ciudad">Ciudad</Label>
                  <Input
                    id="ciudad"
                    type="text"
                    placeholder="Ingresa la ciudad de la sucursal"
                    {...register('direccion.ciudad', {
                      required: 'El campo ciudad es obligatorio',
                    })}
                  />
                  {errors.direccion?.ciudad && (
                    <div className="text-sm text-red-500">{errors.direccion.ciudad.message}</div>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="telefono">Telefono</Label>
                <Input
                  id="telefono"
                  type="text"
                  placeholder="+1 809-000-0000"
                  {...register('telefono', {
                    required: 'El campo telefono es obligatorio',
                    pattern: {
                      value: /^\+1\s\d{3}-\d{3}-\d{4}$/,
                      message: 'Formato invalido, ej: +1 000-000-0000',
                    },
                  })}
                />
                {errors.telefono && (
                  <div className="text-red-500 text-sm">{errors.telefono.message}</div>
                )}
              </div>

              {error && <div className="text-red-500 text-sm">Error: {error}</div>}
              {loading && <Spinner />}
            </div>
            <div className="flex flex-wrap gap-2 justify-center md:justify-end my-4">
              <Button type="submit" size="sm" variant="primary" startIcon={<BiSave size={24} />}>
                Guardar
              </Button>
              <Button
                size="sm"
                variant="outline"
                startIcon={<BiArrowBack size={24} />}
                onClick={cancel}
              >
                Volver
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
