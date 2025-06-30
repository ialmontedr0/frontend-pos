import { useEffect, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import type { RootState } from '../../../store/store';
import { getAllUsers, deleteUser } from '../slices/usersSlice';
import { resetPassword } from '../../auth/slices/authSlice';

import type { User } from '../interfaces/UserInterface';
import type { Column, Action } from '../../../components/Table/types';

import {
  myAlertError,
  myAlertSuccess,
  parseUserRole,
  parseUserStatus,
} from '../../../utils/commonFunctions';

import { Table } from '../../../components/Table/Table';
import Button from '../../../components/UI/Button/Button';
import { BiEdit, BiPencil, BiPlusCircle, BiShow } from 'react-icons/bi';
import { BiGrid } from 'react-icons/bi';
import { BiListUl } from 'react-icons/bi';
import { Card, type CardItem } from '../../../components/UI/Card/Card';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Badge from '../../../components/UI/Badge/Badge';
import PageMeta from '../../../components/common/PageMeta';
import PageBreadcrum from '../../../components/common/PageBreadCrumb';

export function Users() {
  const dispatch = useAppDispatch();
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
    { header: 'Rol', accessor: 'rol', render: (value: string) => parseUserRole(value) },
    {
      header: 'Estado',
      accessor: 'estado',
      render: (value: string) => `${parseUserStatus(value)}`,
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

  const tableData: User[] = users;

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
                myAlertSuccess(
                  'Contraseña restablecida',
                  `Se ha restablecido la contrasena del usuario con exito!`
                );
                dispatch(getAllUsers());
              })
              .catch((error: any) => {
                myAlertError(`Error`, `Error: ${error.response?.data?.message || error.message}`);
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
                myAlertSuccess(`Usuario eliminado`, `Se ha eliminado el usuario con exito!`);
                dispatch(getAllUsers());
              })
              .catch((error: any) => {
                myAlertError(`Error`, `Error: ${error.response?.data?.message || error.message}`);
              });
          }
        });
    },
    [dispatch]
  );

  if (error) return <div>Error {error}</div>;

  return (
    <>
      <PageMeta title="Usuarios - Pos v2" description="Usuarios" />
      <div className="overflow-x-auto space-y-6 p-4 bg-white dark:bg-[#1d2939]">
        <div className="space-y-4">
          <h2 className="text-3xl font-regular text-black dark:text-gray-200">Usuarios</h2>
          <Button
            startIcon={<BiPlusCircle size={24} />}
            type="button"
            className="rounded-full"
            onClick={() => navigate('/users/create')}
          >
            Nuevo usuario
          </Button>
        </div>

        <div className="flex items-center justify-end gap-2 mb-4">
          <button onClick={() => setMode('list')} className={mode === 'list' ? 'font-bold' : ''}>
            <BiListUl className="dark:text-white" size={28} />
          </button>
          <button onClick={() => setMode('grid')} className={mode === 'grid' ? 'font-bold' : ''}>
            <BiGrid className="dark:text-white" size={28} />
          </button>
        </div>

        {loading && <Spinner />}

        {mode === 'list' ? (
          <Table
            data={tableData}
            columns={userColumns}
            actions={userActions}
            pageSizeOptions={[10, 20]}
            defaultPageSize={10}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {cardItems.map((item) => (
              <Card key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
