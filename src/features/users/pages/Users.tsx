import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useAppDispath, useAppSelector } from '../../../hooks/hooks';
import type { RootState } from '../../../store/store';
import { getAllUsers, deleteUser } from '../slices/usersSlice';
import { resetPassword } from '../../auth/slices/authSlice';
import type { User } from '../interfaces/UserInterface';
import type { Column, Action } from '../../../components/Table/types';
import { Table } from '../../../components/Table/Table';
import { Button } from '../../../components/UI/Button/Button';

export function Users() {
  const dispatch = useAppDispath();
  const navigate = useNavigate();
  const myAlert = withReactContent(Swal);

  const { users, loading, error } = useAppSelector((state: RootState) => state.users);

  useEffect(() => {
    dispatch(getAllUsers());
    console.log(document.cookie)
  }, [dispatch]);

  const userColumns: Column<User>[] = [
    { header: 'Usuario', accessor: 'usuario' },
    { header: 'Nombre', accessor: 'nombre' },
    { header: 'Apellido', accessor: 'apellido' },
    { header: 'Correo', accessor: 'correo' },
    { header: 'Telefono', accessor: 'telefono' },
    { header: 'Rol', accessor: 'rol' },
    { header: 'Estado', accessor: 'estado' },
  ];

  const userActions: Action<User>[] = [
    { label: 'Ver', onClick: (u) => viewUser(u._id) },
    { label: 'Editar', onClick: (u) => editUser(u._id) },
    {
      label: 'Restablecer contrasena',
      onClick: (u) => handleResetPassword(u.usuario),
    },
    { label: 'Eliminar', onClick: (u) => handleDeleteUser(u._id) },
  ];

  const createUser = () => {
    navigate('/users/create');
  };

  const viewUser = useCallback(
    (userId: string) => {
      navigate(`${userId}`);
    },
    [navigate]
  );

  const editUser = useCallback(
    (userId: string) => {
      navigate(`/users/edit/${userId}`);
    },
    [navigate]
  );

  const handleResetPassword = useCallback(
    (usuario: string) => {
      myAlert
        .fire({
          title: 'Restablecer contrasena',
          text: `Estas seguro que deseas restablecer la contraseña del usuario?`,
          icon: 'warning',
          showConfirmButton: true,
          showCancelButton: true,
        })
        .then((result) => {
          if (result.isConfirmed) {
            dispatch(resetPassword({ usuario }))
              .unwrap()
              .then(() => {
                dispatch(getAllUsers());
              })
              .catch((error) => {
                myAlert.fire({
                  title: 'Error',
                  text: `Error al restablecer la contrasena ${error}`,
                  icon: 'error',
                  timer: 5000,
                  timerProgressBar: true,
                });
              });
          }
        });
    },
    [dispatch]
  );

  const handleDeleteUser = useCallback(
    (userId: string) => {
      myAlert
        .fire({
          title: 'Eliminar usuario!',
          text: `Estas seguro que deseas eliminar este usuario?`,
          icon: 'warning',
          showConfirmButton: true,
          showCancelButton: true,
        })
        .then((result) => {
          if (result.isConfirmed) {
            dispatch(deleteUser(userId))
              .unwrap()
              .then(() => {
                dispatch(getAllUsers());
              })
              .catch((error: any) => {
                myAlert.fire({
                  title: `Error`,
                  text: `Error eliminando el usuario ${error.response?.data?.message || error.message}!`,
                  icon: 'error',
                  showConfirmButton: true,
                  timer: 5000,
                  timerProgressBar: true,
                });
              });
          }
        });
    },
    [dispatch]
  );

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error {error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold text-black dark:text-white mb-4">Usuarios</h2>
      <Button type="button" onClick={createUser} variant="default">
        Nuevo Usuario +
      </Button>
      <Table
        columns={userColumns}
        data={users}
        defaultPageSize={10}
        pageSizeOptions={[5, 10, 20]}
        actions={userActions}
      />
    </div>
  );
}
