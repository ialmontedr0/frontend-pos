import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment/min/moment-with-locales';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import type { RootState } from '../../../store/store';

import { clearSelectedUser, clearUserError, getUserByUsername } from '../slices/usersSlice';
import { parseTextSizeName, parseUserRole } from '../../../utils/commonFunctions';

import Button from '../../../components/UI/Button/Button';
import { BiArrowBack, BiCog, BiEdit } from 'react-icons/bi';
import Badge from '../../../components/UI/Badge/Badge';
import Spinner from '../../../components/UI/Spinner/Spinner';
import { AiFillSetting } from 'react-icons/ai';
import { NotFound } from '../../../pages/NotFound';
import { Error } from '../../../components/Error/components/Error';
import { useModal } from '../../../hooks/useModal';
import { EditUser } from '../components/EditUser';

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
    dispatch(clearUserError());
    dispatch(getUserByUsername(usuario));
    return () => {
      dispatch(clearSelectedUser());
    };
  }, [dispatch, usuario, navigate]);

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

        <div className="flex-1 space-y-4 text-black dark:text-gray-200">
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

            {user.rol !== 'admin' && user.sucursal && (
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Sucursal</p>
                <p className="text-gray-800 dark:text-gray-200">{user?.sucursal.nombre}</p>
              </div>
            )}

            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Direccion</p>
              <p className="text-gray-800 dark:text-gray-200">
                <strong>Calle: </strong>
                {user.direccion?.calle}
              </p>
              <p>
                <strong>Numero: </strong>
                {user.direccion?.casa}
              </p>
              <p>
                <strong>Ciudad: </strong>
                {user.direccion?.ciudad}
              </p>
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
              variant="outline"
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
              variant="primary"
              startIcon={<BiEdit size={20} />}
              onClick={openModal}
            >
              Editar
            </Button>
          </div>
        </div>
        <EditUser user={user} isOpen={isOpen} closeModal={closeModal} error={error!} />
      </div>
    </>
  );
};
