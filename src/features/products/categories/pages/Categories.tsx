import React, { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import type { RootState } from '../../../../store/store';
import { getAllCategories, deleteCategory } from '../slices/categoriesSlice';
import type { Category } from '../interfaces/CategoryInterface';
import type { Column, Action } from '../../../../components/Table/types';
import { Table } from '../../../../components/Table/Table';
import { useAppDispatch, useAppSelector } from '../../../../hooks/hooks';
import { Button } from '../../../../components/UI/Button/Button';
import { BiPlusCircle } from 'react-icons/bi';
import Spinner from '../../../../components/UI/Spinner/Spinner';

export const Categories: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const myAlert = withReactContent(Swal);

  const { categories, loading, error } = useAppSelector((state: RootState) => state.categories);

  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);

  const categoriesColumns: Column<Category>[] = [{ header: 'Nombre', accessor: 'nombre' }];

  const categoryActions: Action<Category>[] = [
    { label: 'Ver', onClick: (c) => viewCategory(c._id) },
    { label: 'Editar', onClick: (c) => editCategory(c._id) },
    { label: 'Eliminar', onClick: (c) => handleDeleteCategory(c._id) },
  ];

  const createCategory = () => {
    navigate('/products/categories/create');
  };

  const viewCategory = useCallback(
    (categoryId: string) => {
      navigate(`/products/categories/${categoryId}`);
    },
    [navigate]
  );

  const editCategory = useCallback(
    (categoryId: string) => {
      navigate(`/products/categories/edit/${categoryId}`);
    },
    [navigate]
  );

  const handleDeleteCategory = useCallback(
    (categoryId: string) => {
      myAlert
        .fire({
          title: 'Eliminar Categoria',
          text: `Estas seguro que deseas eliminar esta categoria?`,
          icon: 'question',
          showConfirmButton: true,
          confirmButtonText: 'Si, eliminar!',
          showCancelButton: true,
          cancelButtonText: 'Cancelar',
        })
        .then((result) => {
          if (result.isConfirmed) {
            dispatch(deleteCategory(categoryId))
              .unwrap()
              .then(() => {
                myAlert.fire({
                  title: 'Categoria eliminada',
                  text: `Se ha eliminado el cliente con exito!`,
                  icon: 'success',
                  timer: 5000,
                  timerProgressBar: true,
                });
                dispatch(getAllCategories());
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
    },
    [dispatch]
  );

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold text-black dark:text-white mb-4">Categorias</h2>

      <Button
        icon={<BiPlusCircle size={24} />}
        type="button"
        iconPosition="right"
        className="border my-4 border-gray-900 px-4 py-1 rounded-md text-white bg-blue-900 dark:bg-blue-400 cursor-pointer hover:bg-blue-800 transition-colors"
        onClick={createCategory}
      >
        Nueva Categoria
      </Button>

      {loading && <Spinner />}
      {!loading && categories.length === 0 && <div>No hay categorias.</div>}
      {error && <div className="text-sm text-red-600">Error: {error}</div>}

      <Table
        columns={categoriesColumns}
        data={categories}
        defaultPageSize={10}
        pageSizeOptions={[5, 10, 20]}
        actions={categoryActions}
      />
    </div>
  );
};
