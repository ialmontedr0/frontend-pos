import type React from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import type { RootState } from '../../../store/store';
import { useAppDispath, useAppSelector } from '../../../hooks/hooks';
import { getAllProducts, deleteProduct } from '../slices/productsSlice';
import type { Product } from '../interfaces/ProductInterface';
import type { Column, Action } from '../../../components/Table/types';
import { Table } from '../../../components/Table/Table';
import { useCallback, useEffect } from 'react';

export const Products: React.FC = () => {
  const dispatch = useAppDispath();
  const navigate = useNavigate();
  const myAlert = withReactContent(Swal);

  const { products, loading, error } = useAppSelector((state: RootState) => state.products);

  useEffect(() => {
    dispatch(getAllProducts());
  }, [dispatch]);

  const productColumns: Column<Product>[] = [
    { header: 'Nombre', accessor: 'nombre' },
    { header: 'Categoria', accessor: 'categoria' },
    { header: 'Stock', accessor: 'stock' },
    { header: 'Disponible', accessor: 'disponible' },
    { header: 'Precio', accessor: 'precioVenta' },
    { header: 'ITBIS', accessor: 'itbis' },
  ];

  const productActions: Action<Product>[] = [
    { label: 'Ver', onClick: (p) => viewProduct(p._id) },
    { label: 'Editar', onClick: (p) => editProduct(p._id) },
    { label: 'Eliminar', onClick: (p) => handleDeleteProduct(p._id) },
  ];

  const createProduct = () => {
    navigate('/products/create');
  };

  const viewProduct = useCallback(
    (productId: string) => {
      navigate(`/products/${productId}`);
    },
    [navigate]
  );

  const editProduct = useCallback(
    (productId: string) => {
      navigate(`/products/edit/${productId}`);
    },
    [navigate]
  );

  const handleDeleteProduct = useCallback(
    (productId: string) => {
      myAlert
        .fire({
          title: 'Eliminar producto',
          text: `Estas seguro que deseas eliminar este producto?`,
          icon: 'question',
          showConfirmButton: true,
          showCancelButton: true,
          confirmButtonText: 'Si, eliminar!',
          cancelButtonText: 'Cancelar',
        })
        .then((result) => {
          if (result.isConfirmed) {
            dispatch(deleteProduct(productId))
              .unwrap()
              .then(() => {
                myAlert.fire({
                  title: 'Eliminar producto',
                  text: `Se ha eliminado el producto con exito`,
                  icon: 'success',
                  timer: 5000,
                  timerProgressBar: true,
                });
                navigate('/products');
              })
              .catch((error: any) => {
                myAlert.fire({
                  title: 'Error',
                  text: `Error: ${error}`,
                  icon: 'error',
                  timer: 5000,
                  timerProgressBar: true,
                });
              });
          }
        });
    },
    [dispatch, navigate]
  );

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="text-black dark:text-white">
      <div className="flex flex-col">
        <h2 className="text-xl font-semibold mb-3">Productos</h2>

        <button onClick={() => createProduct()}>Crear producto</button>
        <button
          className="bg-blue-800 text-white dark:text-white px-4 py-2 w-xs rounded-lg"
          onClick={() => navigate('/products/categories')}
        >
          Categorias
        </button>
        <button onClick={() => navigate('/products/providers')}>Proveedores</button>
        <button onClick={() => navigate('/products/inventory')}>Inventario</button>
      </div>

      <Table
        columns={productColumns}
        data={products}
        defaultPageSize={10}
        pageSizeOptions={[5, 10, 20]}
        actions={productActions}
      />
    </div>
  );
};
