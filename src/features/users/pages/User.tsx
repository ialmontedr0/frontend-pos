import { useCallback, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment/min/moment-with-locales';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import type { RootState } from '../../../store/store';

import {
  clearSelectedUser,
  deleteUser,
  getUserByUsername,
  clearUserError,
  updateUser,
} from '../slices/usersSlice';
import {
  myAlertError,
  myAlertSuccess,
  parseTextSizeName,
  parseUserRole,
} from '../../../utils/commonFunctions';

import { Modal } from '../../../components/UI/Modal/Modal';

import { Select } from '../../../components/UI/Select/Select';
import { ToggleSwitch } from '../../../components/UI/ToggleSwitch/ToggleSwitch';
import type { Estado } from '../interfaces/UserInterface';
import Button from '../../../components/UI/Button/Button';
import { BiArrowBack, BiCog, BiEdit, BiSave, BiTrash, BiX } from 'react-icons/bi';
import Badge from '../../../components/UI/Badge/Badge';
import Spinner from '../../../components/UI/Spinner/Spinner';
import { AiFillSetting } from 'react-icons/ai';
import { NotFound } from '../../../pages/NotFound';
import { Error } from '../../../components/Error/components/Error';
import { useModal } from '../../../hooks/useModal';
import Input from '../../../components/UI/Input/Input';
import { Label } from '../../../components/UI/Label/Label';
import type { UpdateUserDTO } from '../dtos/update-user.dto';

export const User: React.FC = () => {
  const { usuario } = useParams<{ usuario: string }>();
  const { isOpen, openModal, closeModal } = useModal();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const myAlert = withReactContent(Swal);
  moment.locale('es');

  const { user, loading, error } = useAppSelector((state: RootState) => state.users);

  useEffect(() => {
    if (!usuario) {
      navigate('/users');
      return;
    }
    dispatch(getUserByUsername(usuario));
    return () => {
      dispatch(clearSelectedUser());
    };
  }, [dispatch, usuario, navigate]);

  const sanitizedUserForForm = (user: any): UpdateUserDTO => {
    const {
      nombre,
      apellido,
      usuario: useername,
      correo,
      telefono,
      direccion,
      rol,
      estado,
      foto,
      configuracion,
    } = user;
    return {
      nombre,
      apellido,
      usuario: useername,
      correo,
      telefono,
      direccion,
      rol,
      estado,
      foto,
      configuracion,
    };
  };

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<UpdateUserDTO>({
    defaultValues: {
      nombre: '',
      apellido: '',
      usuario: '',
      correo: '',
      telefono: '',
      direccion: '',
      rol: 'cajero',
      estado: 'activo',
      foto: '',
      configuracion: undefined,
    },
  });

  useEffect(() => {
    if (user) {
      reset(sanitizedUserForForm(user));
    }
  }, [user, reset]);

  const onSubmit = useCallback((updateUserDTO: UpdateUserDTO) => {
    myAlert
      .fire({
        title: 'Guardar Cambios!',
        text: `Estas seguro que deseas guardar estos cambios?`,
        iconHtml: <BiSave />,
        customClass: {
          icon: 'no-default-icon-border',
          container: 'swal2-container z-[999999]',
          popup: 'z-[1000000]',
        },
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        cancelButtonText: 'Cancelar',
      })
      .then((result) => {
        if (result.isConfirmed) {
          dispatch(
            updateUser({
              userId: user!._id,
              updateUserDTO,
            })
          )
            .unwrap()
            .then(() => {
              dispatch(clearUserError());
              myAlertSuccess(`Cambios Guardados`, 'Se ha actualizado el usuario con exito.');
              closeModal();
            })
            .catch((error: any) => {
              myAlertError(`Error: ${error}`);
            });
        }
      });
  }, []);

  const onDelUser = useCallback(
    (userId: string) => {
      myAlert
        .fire({
          title: `Eliminar Usuario`,
          text: `Estas seguro que deseas eliminar este usuario?`,
          iconHtml: <BiTrash color="red" />,
          customClass: {
            icon: 'no-default-icon-border',
            container: 'swal2-container z-[999999]',
            popup: 'z-[1000000]',
          },
          showConfirmButton: true,
          showCancelButton: true,
          confirmButtonText: 'Eliminar',
          cancelButtonText: 'Cancelar',
          confirmButtonColor: '#ff0000',
        })
        .then((result) => {
          if (result.isConfirmed) {
            dispatch(deleteUser(userId))
              .unwrap()
              .then(() => {
                dispatch(clearSelectedUser());
                myAlertSuccess(`Usuario eliminado!`, `Se ha eliminado el usuario con exito.`);
              })
              .catch((error: any) => {
                myAlertError(`Error: ${error}`);
              });
          }
        });
    },
    [dispatch]
  );

  const showSettings = () => {
    if (user && user.configuracion) {
      myAlert.fire({
        title: `Configuracion`,
        iconHtml: <AiFillSetting />,
        customClass: {
          icon: 'no-default-icon-border',
        },
        html: `
         <div className='flex flex-row'>
          <strong>Tema: </strong> <label>${user.configuracion.tema.charAt(0).toUpperCase() + user.configuracion.tema.slice(1)}</label>
         </div>

         <div>
          <strong>Idioma: </strong><label>${user.configuracion.idioma}</label>
         </div>

        <div>
          <strong>Moneda: </strong><label>${user.configuracion.moneda}</label>
        </div>

        <div>
          <strong>Zona Horaria: </strong><label>${user.configuracion.zonaHoraria}</label>
        </div>

        <div>
          <strong>Tamano Texto: </strong><label>${parseTextSizeName(user.configuracion.tamanoTexto)}</label>
        </div>

        <div>
          <strong>Notificaciones: </strong><label>${user.configuracion.notificaciones ? 'Si' : 'No'}</label>
        </div>
        `,
      });
    }
  };

  if (!error && loading) {
    return <Spinner />;
  }

  if (error && !loading) {
    return <Error message={error} />;
  }

  if (!user) {
    return <NotFound node="Usuario" />;
  }

  return (
    <>
      <div className="p-6 max-w-2xl m-2 lg:mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-theme-md">
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8 my-4">
          <h2 className="text-2xl md:text-3xl font-regular text-black dark:text-gray-200">
            {user.nombre} {user.apellido}
          </h2>
          <div className="flex-shrink-0 my-2">
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
              <p className="text-gray-800 dark:text-gray-200">{parseUserRole(user.rol)}</p>
            </div>

            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Direccion</p>
              <p className="text-gray-800 dark:text-gray-200">{user.direccion}</p>
              <p></p>
            </div>

            {user.createdBy && (
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Creado por</p>
                <p className="text-gray-700 dark:text-gray-200">{user.createdBy.usuario}</p>
              </div>
            )}
            {user.updatedBy && (
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Actualizado por</p>
                <p className="text-gray-700 dark:text-gray-200">{user.updatedBy.usuario}</p>
              </div>
            )}

            {/** Fecha creacion y ultima actualizacion */}
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Fecha creacion</p>
              <p className="text-gray-800 dark:text-gray-200">
                {moment(user.createdAt).format('LLLL')}
              </p>
            </div>

            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Ultima actualizacion</p>
              <p className="text-gray-800 dark:text-gray-200">
                {moment(user.updatedAt).format('LLLL')}
              </p>
            </div>

            <div>
              <p className="text-gray-500 dar:text-gray-400 text-sm">Estado</p>
              {user.estado === 'activo' ? (
                <Badge color="success">Activo</Badge>
              ) : (
                <Badge color="error">Inactivo</Badge>
              )}
            </div>
          </div>
          <div className="flex flex-wrap justify-end gap-2 my-6">
            <Button
              size="sm"
              startIcon={<BiArrowBack size={20} />}
              onClick={() => navigate('/users')}
            >
              Volver
            </Button>

            <Button
              size="sm"
              variant="success"
              type="button"
              onClick={showSettings}
              startIcon={<BiCog size={20} />}
            >
              Configuracion
            </Button>

            <Button
              size="sm"
              variant="outline"
              startIcon={<BiEdit size={20} />}
              onClick={openModal}
            >
              Editar
            </Button>
          </div>
        </div>

        <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px]">
          <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
            <div className="px-2 pr-14">
              <h4 className="mb-2 text-2xl font-semibold text-black dark:text-gray-200">
                Editar Usuario
              </h4>
              <p className="mb-6 text-sm text-gray-500 dark:text-gray-200 lg:mb-7">
                Actualiza los datos del usuario
              </p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
              <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
                <div className="mt-7">
                  <h5 className="mb-5 text-lg font-medium text-black dark:text-gray-200 lg:mb-6">
                    {user.nombre} {user.apellido}
                  </h5>
                  <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                    <div className="col-span-2 lg:col-span-1">
                      <Label>Nombre</Label>
                      <Input
                        id="nombre"
                        {...register('nombre', { required: 'El campo nombre es obligatorio.' })}
                        placeholder={user.nombre}
                      />
                      {errors.nombre && (
                        <div className="text-sm text-red-500">{errors.nombre.message}</div>
                      )}
                    </div>
                    <div>
                      <Label>Apellido</Label>
                      <Input
                        id="apellido"
                        {...register('apellido', { required: 'El campo apellido es obligatorio.' })}
                        placeholder={user.apellido}
                      />
                      {errors.apellido && (
                        <div className="text-sm text-red-500">{errors.apellido.message}</div>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="usuario">Usuario</Label>
                      <Input
                        id="usuario"
                        {...register('usuario', { required: 'El campo usuario es obligatorio' })}
                        placeholder={user.usuario}
                      />
                      {errors.usuario && (
                        <div className="text-sm text-red-500">{errors.usuario.message}</div>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="correo">Correo Electronico</Label>
                      <Input
                        id="correo"
                        {...register('correo', { required: 'El campo correo es obgligatorio' })}
                        placeholder={user.correo}
                      />
                      {errors.correo && (
                        <div className="text-sm text-red-500">{errors.correo.message}</div>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="telefono">Telefono</Label>
                      <Input
                        id="telefono"
                        {...register('telefono', { required: 'El campo telefono es obligatorio' })}
                        placeholder={user.telefono}
                      />
                      {errors.telefono && (
                        <div className="text-sm text-red-500">{errors.telefono.message}</div>
                      )}
                    </div>
                    <div>
                      <Label>Rol</Label>
                      <Select
                        id="rol"
                        {...register('rol', { required: true })}
                        defaultValue={user.rol}
                      >
                        <option value="admin">Administrador</option>
                        <option value="cajero">Cajero</option>
                        <option value="inventarista">Inventarista</option>
                      </Select>
                      {errors.rol && (
                        <div className="text-sm text-red-500">{errors.rol.message}</div>
                      )}
                    </div>

                    <div>
                      <Label>Estado</Label>
                      <Controller<UpdateUserDTO, 'estado'>
                        name="estado"
                        control={control}
                        defaultValue="activo"
                        render={({ field }) => (
                          <ToggleSwitch<Estado>
                            value={field.value!}
                            offValue="inactivo"
                            onValue="activo"
                            offLabel="Inactivo"
                            onLabel="Activo"
                            className="mt-1"
                            onToggle={field.onChange}
                          />
                        )}
                      />
                      {errors.estado && (
                        <div className="text-sm text-red-500">{errors.estado.message}</div>
                      )}
                    </div>

                    <div>
                      <Label>Direccion</Label>
                      <Input
                        id="direccion"
                        {...register('direccion')}
                        placeholder={user.direccion}
                      />
                      {errors.direccion && (
                        <div className="text-sm text-red-500">{errors.direccion.message}</div>
                      )}
                    </div>

                    <div>
                      <Label>Foto (URL)</Label>
                      <Input id="foto" {...register('foto')} placeholder={user.foto} />
                      {errors.foto && (
                        <div className="text-sm text-red-500">{errors.foto.message}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {error && <div className="text-sm text-red-500">Error: {error}</div>}
              <div className="flex items-center gap-3 px-2 mt-6 justify-center lg:justify-end">
                <Button type="submit" size="sm" variant="primary" startIcon={<BiSave />}>
                  Guardar
                </Button>
                <Button size="sm" variant="outline" startIcon={<BiX />} onClick={closeModal}>
                  Cancelar
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  startIcon={<BiTrash />}
                  onClick={() => onDelUser(user._id)}
                >
                  Eliminar
                </Button>
              </div>
            </form>
          </div>
        </Modal>
      </div>
    </>
  );
};
