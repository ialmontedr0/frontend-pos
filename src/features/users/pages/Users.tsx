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

import { parseUserRole, parseUserStatus } from '../../../utils/commonFunctions';

/* import { Table } from '../../../components/Table/Table';
 */ import Button from '../../../components/UI/Button/Button';
import { BiEdit, BiPencil, BiPlusCircle, BiShow } from 'react-icons/bi';
import { BiGrid } from 'react-icons/bi';
import { BiListUl } from 'react-icons/bi';
import { Card, type CardItem } from '../../../components/UI/Card/Card';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Badge from '../../../components/UI/Badge/Badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '../../../components/Table/TableNew/Table';
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

  if (error) return <div>Error {error}</div>;

  return (
    <>
      <PageMeta title="Usuarios - Pos v2" description="Usuarios" />
      <PageBreadcrum pageTitle="Usuarios" />
      <div className="p-4 space-y-4">
        <Button
          startIcon={<BiPlusCircle size={24} />}
          type="button"
          className="border border-gray-900 px-4 py-1 rounded-md text-white bg-blue-900 dark:bg-blue-400 cursor-pointer hover:bg-blue-800 transition-colors"
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

        {loading && <Spinner />}

        {mode === 'list' ? (
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  {''}
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Usuario
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Nombre
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Correo
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Telefono
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Rol
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Estado
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Acciones
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {tableData.map((user) => (
                <TableRow key={user._id}>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 overflow-hidden rounded-full">
                        <img
                          src={
                            user.foto ||
                            'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Blank_portrait%2C_male_%28rectangular%29.png/1200px-Blank_portrait%2C_male_%28rectangular%29.png'
                          }
                          width={40}
                          height={40}
                          alt=""
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-theme-xs dark:text-gray-400">
                    {user.usuario}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-theme-xs dark:text-gray-400">
                    {user.nombre + ` ` + user.apellido}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-theme-xs dark:text-gray-400">
                    {user.correo}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-theme-xs dark:text-gray-400">
                    {user.telefono}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-theme-xs dark:text-gray-400">
                    {parseUserRole(user.rol)}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-theme-xs dark:text-gray-400">
                    {user.estado ? (
                      <Badge color="success">Activo</Badge>
                    ) : (
                      <Badge color="error">Inactivo</Badge>
                    )}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-theme-xs dark:text-gray-400">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => editUser(user._id)}
                        className="cursor-pointer w-16 h-16"
                      >
                        <BiEdit />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="grid grid-cols-1 sm: grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {cardItems.map((item) => (
              <Card key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
