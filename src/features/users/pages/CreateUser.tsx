import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import { createUser, clearUserError } from '../slices/usersSlice';
import type { CreateUserDTO } from '../dtos/create-user.dto';

// Componentes reutilizables
import Button from '../../../components/UI/Button/Button';
import Input from '../../../components/UI/Input/Input';
import { Label } from '../../../components/UI/Label/Label';
import { Select } from '../../../components/UI/Select/Select';
import { BiSave, BiX } from 'react-icons/bi';
import { myAlertSuccess } from '../../../utils/commonFunctions';
import PageMeta from '../../../components/common/PageMeta';
import { Toaster } from '../../../components/UI/Toaster/Toaster';
import { toast } from '../../../components/UI/Toast/hooks/useToast';

export const CreateUser: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const myAlert = withReactContent(Swal);

  const { loading, error } = useAppSelector((state) => state.users);

  // Inicializar React Hook form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUserDTO>({
    defaultValues: {
      nombre: '',
      apellido: '',
      usuario: '',
      correo: '',
      telefono: '',
      direccion: {
        calle: '',
        casa: '',
        ciudad: '',
      },
      rol: 'cajero',
      estado: 'activo',
      foto: '',
      configuracion: undefined,
      roles: [],
    },
  });

  useEffect(() => {
    return () => {
      dispatch(clearUserError());
    };
  }, [dispatch]);

  const onSubmit = (createUserDto: CreateUserDTO) => {
    myAlert
      .fire({
        title: `Crear usuario!`,
        text: `Estas seguro que deseas crear este usuario?`,
        icon: 'question',
        showConfirmButton: true,
        showCancelButton: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          dispatch(createUser(createUserDto))
            .unwrap()
            .then(() => {
              myAlertSuccess(`Usuario creado`, `Se ha creado el usuario con exito`);
            })
            .catch((error: any) => {
              toast({
                title: `Error`,
                description: `Error creando el usuario: ${error}`,
                variant: 'destructive',
              });
            });
        }
      });
  };

  const cancel = () => {
    myAlert
      .fire({
        title: 'Cancelar creacion',
        text: `Estas seguro que deseas cancelar la creacion del usuario?`,
        icon: 'question',
        showConfirmButton: true,
        confirmButtonText: 'Si, cancelar',
        showCancelButton: true,
        cancelButtonText: 'No',
      })
      .then((result) => {
        if (result.isConfirmed) {
          navigate('/users');
        }
      });
  };

  return (
    <>
      <PageMeta title="Crear Usuario - PoS v2" description="Crear nuevo Usuario" />
      <div className="py-6 px-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md space-y-6"
        >
          <h2 className="text-2xl font-medium text-gray-800 dark:text-gray-200 mb-4">
            Crear Usuario
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="nombre">Nombre</Label>
              <Input
                id="nombre"
                placeholder="Nombre"
                {...register('nombre', { required: 'El nombre es obligatorio' })}
              />
              {errors.nombre && (
                <p className="mt-1 text-sm text-red-500">{errors.nombre.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="apellido">Apellido</Label>
              <Input
                id="apellido"
                placeholder="Apellido"
                {...register('apellido', { required: 'El apellido es obligatorio' })}
              />
              {errors.apellido && (
                <p className="mt-1 text-sm text-red-500">{errors.apellido.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="usuario">Usuario</Label>
              <Input
                id="usuario"
                placeholder="usuario123"
                {...register('usuario', { required: 'El usuario es obligatorio' })}
              />
              {errors.usuario && (
                <p className="mt-1 text-sm text-red-500">{errors.usuario.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="correo">Correo electronico</Label>
              <Input
                id="correo"
                type="email"
                placeholder="correo@ejemplo.com"
                {...register('correo', {
                  required: 'El correo es obligatorio',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Formato de correo invalido',
                  },
                })}
              />
              {errors.correo && (
                <p className="mt-1 text-sm text-red-500">{errors.correo.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="telefono">Telefono</Label>
              <Input
                id="telefono"
                placeholder="+1 000-000-0000"
                {...register('telefono', {
                  required: 'El telefono es obligatorio',
                  pattern: {
                    value: /^\+1\s\d{3}-\d{3}-\d{4}$/,
                    message: 'Formato invalido, ej: +1 000-000-0000',
                  },
                })}
              />
              {errors.telefono && (
                <p className="mt-1 text-sm text-red-500">{errors.telefono.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="rol">Rol</Label>
              <Select id="rol" {...register('rol')}>
                <option value="admin">Administrador</option>
                <option value="cajero">Cajero</option>
                <option value="inventarista">Inventarista</option>
              </Select>
              {errors.rol && <p className="mt-1 text-sm text-red-500">{errors.rol.message}</p>}
            </div>

            <div>
              <Label htmlFor="estado">Estado</Label>
              <Select id="estado" {...register('estado')}>
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </Select>
            </div>

            <div className="col-span-full md:col-span-2">
              <Label htmlFor="foto">Foto (URL)</Label>
              <Input
                id="foto"
                placeholder="https://ejemplo.com/imagen.jpg"
                {...register('foto', {
                  pattern: {
                    value: /^(https?:\/\/)?([\w\d-]+\.)+\w{2,}(\/.+)?$/i,
                    message: 'URL no valida.',
                  },
                })}
              />
              {errors.foto && <p className="mt-1 text-sm text-red-500">{errors.foto.message}</p>}
            </div>

            <div className="col-span-full">
              <Label htmlFor="direccion">Direccion</Label>
              <div className="grid grid-cols-2 space-x-2 space-y-2">
                <div>
                  <Label htmlFor="calle">Calle</Label>
                  <Input
                    id="calle"
                    type="text"
                    placeholder="Ingresa la calle de residencia del usuario"
                    {...register('direccion.calle', { required: 'El campo calle es obligatorio' })}
                  />
                  {errors.direccion?.calle && <div>{errors.direccion.calle.message}</div>}
                </div>
                <div>
                  <Label htmlFor="casa">Casa</Label>
                  <Input
                    id="casa"
                    type="text"
                    placeholder="Numero de la casa #"
                    {...register('direccion.casa', {
                      required: 'El campo casa es obligatorio',
                    })}
                  />
                  {errors.direccion?.casa && <div>{errors.direccion.casa.message}</div>}
                </div>
                <div>
                  <Label htmlFor="ciudad">Ciudad</Label>
                  <Input
                    id="ciudad"
                    type="text"
                    placeholder="Ciudad"
                    {...register('direccion.ciudad', {
                      required: 'El campo ciudad es obligatorio',
                    })}
                  />
                  {errors.direccion?.ciudad && <div>{errors.direccion.ciudad.message}</div>}
                </div>
              </div>
            </div>
          </div>

          {error && <p className="text-center text-red-600 bg-red-100 p-2 rounded-md">{error}</p>}

          <div className="flex justify-end pt-4 gap-2 dark:border-gray-700">
            <Button startIcon={<BiSave size={20} />} type="submit" variant="primary">
              {loading ? 'Creando...' : 'Guardar usuario'}
            </Button>
            <Button startIcon={<BiX size={20} />} type="button" variant="outline" onClick={cancel}>
              Cancelar
            </Button>
          </div>
        </form>
        <Toaster />
      </div>
    </>
  );
};
