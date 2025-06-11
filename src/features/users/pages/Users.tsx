import { useEffect, useCallback, useState } from 'react';
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
import { BiPencil, BiPlus, BiShow } from 'react-icons/bi';
import { BiGrid } from 'react-icons/bi';
import { BiListUl } from 'react-icons/bi';
import { Card, type CardItem } from '../../../components/UI/Card/Card';

export function Users() {
  const dispatch = useAppDispath();
  const navigate = useNavigate();
  const myAlert = withReactContent(Swal);
  const [mode, setMode] = useState<'list' | 'grid'>('list');

  const { users, loading, error } = useAppSelector((state: RootState) => state.users);

  useEffect(() => {
    dispatch(getAllUsers());
    console.log(document.cookie);
  }, [dispatch]);

  const userColumns: Column<User>[] = [
    { header: 'Usuario', accessor: 'usuario' },
    { header: 'Nombre', accessor: 'nombre' },
    { header: 'Apellido', accessor: 'apellido' },
    { header: 'Correo', accessor: 'correo' },
    { header: 'Telefono', accessor: 'telefono' },
    { header: 'Rol', accessor: 'rol', render: (value: string) => parseRoleString(value) },
    {
      header: 'Estado',
      accessor: 'estado',
      render: (value: string) => parseStatusString(value),
    },
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

  const cardItems: CardItem[] = users.map((u) => ({
    id: u._id,
    imageUrl: u.foto || '',
    title: `${u.nombre} ${u.apellido}`,
    subtitle: u.usuario,
    fields: [
      { label: 'Rol', value: u.rol },
      { label: 'Estado', value: u.estado ? 'Activo' : 'Inactivo' },
    ],
    actions: [
      {
        icon: <BiShow size={20} />,
        onClick: () => navigate(`/users/${u._id}`),
        toolTip: 'Ver usuario',
      },
      {
        icon: <BiPencil size={20} />,
        onClick: () => navigate(`/users/edit/${u._id}`),
        toolTip: 'Editar usuario',
      },
    ],
  }));

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

  const parseRoleString = (role: string): string => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'cajero':
        return 'Cajero';
      case 'inventarista':
        return 'Inventarista';
      default:
        return 'Desconocido';
    }
  };

  const parseStatusString = (status: string): string => {
    switch (status) {
      case 'activo':
        return 'Activo';
      case 'inactivo':
        return 'Inactivo';
      default:
        return 'Desconocido';
    }
  };

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
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-semibold text-black dark:text-white mb-4">Usuarios</h2>
      <Button
        icon={<BiPlus />}
        type="button"
        variant="default"
        size="sm"
        onClick={() => navigate('/users/create')}
      >
        Nuevo usuario
      </Button>
      <div className="flex items-center justify-end gap-2 mb-4">
        <button onClick={() => setMode('list')} className={mode === 'list' ? 'font-bold' : ''}>
          <BiListUl className="dark:text-white" size={28} />
        </button>
        <button onClick={() => setMode('grid')} className={mode === 'grid' ? 'font-bold' : ''}>
          <BiGrid className="dark:text-white" size={28} />
        </button>
      </div>

      {mode === 'list' ? (
        <Table
          columns={userColumns}
          data={users}
          defaultPageSize={10}
          pageSizeOptions={[5, 10, 20]}
          actions={userActions}
        />
      ) : (
        <div className="grid grid-cols-1 sm: grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {cardItems.map((item) => (
            <Card key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
