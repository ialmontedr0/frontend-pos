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
import Button from '../../../../components/UI/Button/Button';
import { BiPlusCircle } from 'react-icons/bi';
import Spinner from '../../../../components/UI/Spinner/Spinner';
import { myAlertError, myAlertSuccess } from '../../../../utils/commonFunctions';
import PageMeta from '../../../../components/common/PageMeta';

export const Categories: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const myAlert = withReactContent(Swal);

  const { categories, loading, error } = useAppSelector((state: RootState) => state.categories);

  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);

  const categoriesData: Category[] = categories;

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
                myAlertSuccess(`Categoria eliminada`, `Se ha eliminado la categoria exitosamente`);
                dispatch(getAllCategories());
              })
              .catch((error: any) => {
                myAlertError(`Error`, `Error: ${error.response?.data?.message || error.message}`);
              });
          }
        });
    },
    [dispatch]
  );

  return (
    <>
      <PageMeta title="Categorias - PoS v2" description="Categorias" />
      <div className="overflow-x-auto space-y-6 p-4">
        <div className="space-y-4">
          <h2 className="text-3xl font-regular text-black dark:text-gray-200">Categorias</h2>

          <Button startIcon={<BiPlusCircle size={24} />} type="button" onClick={createCategory}>
            Nueva Categoria
          </Button>
        </div>

        {loading && <Spinner />}
        {error && <div className="text-sm text-red-600">Error: {error}</div>}

        {categoriesData.length ? (
          <Table
            columns={categoriesColumns}
            data={categoriesData}
            defaultPageSize={10}
            pageSizeOptions={[5, 10, 20]}
            actions={categoryActions}
          />
        ) : (
          <div>No hay categorias</div>
        )}
      </div>
    </>
  );
};
