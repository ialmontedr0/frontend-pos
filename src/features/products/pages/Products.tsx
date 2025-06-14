import type React from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import type { RootState } from '../../../store/store';
import { useAppDispath, useAppSelector } from '../../../hooks/hooks';
import { getAllProducts, deleteProduct, updateProduct } from '../slices/productsSlice';
import type { Product } from '../interfaces/ProductInterface';
import type { Column, Action } from '../../../components/Table/types';
import { Table } from '../../../components/Table/Table';
import { useCallback, useEffect, useState } from 'react';
import { ProductPriceModal } from '../components/ProductStockModal/ProductPriceModal';
import { Button } from '../../../components/UI/Button/Button';
import { BiCabinet, BiCategory, BiPlusCircle } from 'react-icons/bi';

export const Products: React.FC = () => {
  const dispatch = useAppDispath();
  const navigate = useNavigate();
  const myAlert = withReactContent(Swal);

  const { products, loading, error } = useAppSelector((state: RootState) => state.products);

  const [selected, setSelected] = useState<Product | null>(null);
  const [modalType, setModalType] = useState<'updateCost' | 'updateSale' | null>(null);

  const handleOpenModal = (p: Product, type: 'updateCost' | 'updateSale') => {
    setSelected(p);
    setModalType(type);
  };

  const handleConfirm = (value: number) => {
    if (!selected || !modalType) return;
    const dto = modalType === 'updateCost' ? { precioCompra: value } : { precioVenta: value };
    dispatch(updateProduct({ productId: selected._id, updateProductDTO: dto }));
  };

  useEffect(() => {
    dispatch(getAllProducts());
  }, [dispatch]);

  const productColumns: Column<Product>[] = [
    { header: 'Nombre', accessor: 'nombre' },
    {
      header: 'Categoria',
      accessor: 'categoria',
      render: (value: { _id: string; nombre: string }) => `${value.nombre ?? '-'}`,
    },
    { header: 'Stock', accessor: 'stock' },
    {
      header: 'Disponible',
      accessor: 'disponible',
      render: (value: string) => `${value ? 'Si' : 'No'}`,
    },
    {
      header: 'Precio',
      accessor: 'precioVenta',
      render: (value: number) => `RD$ ${value.toFixed(2)}`,
    },
    { header: 'ITBIS', accessor: 'itbis', render: (value: string) => `${value ? 'Si' : 'No'}` },
  ];

  const productActions: Action<Product>[] = [
    { label: 'Ver', onClick: (p) => navigate(`/products/${p._id}`) },
    { label: 'Editar', onClick: (p) => navigate(`/products/edit/${p._id}`) },
    { label: 'Act precio compra', onClick: (p) => handleOpenModal(p, 'updateCost') },
    { label: 'Act precio venta', onClick: (p) => handleOpenModal(p, 'updateSale') },
    { label: 'Eliminar', onClick: (p) => handleDeleteProduct(p._id) },
  ];

  const createProduct = () => {
    navigate('/products/create');
  };

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
    <div className="p-2 text-black dark:text-white">
      <div className="flex flex-col">
        <h2 className="p-2 text-2xl font-semibold mb-3">Productos</h2>

        <div className="w-auto h-xs flex flex-wrap gap-2 m-2 p-2">
          <Button
            onClick={() => createProduct()}
            className="border border-gray-900 px-4 py-1 rounded-md text-white bg-blue-900 dark:bg-blue-400 cursor-pointer hover:bg-blue-800 transition-colors"
            icon={<BiPlusCircle size={24} />}
          >
            Nuevo Producto
          </Button>
          <Button
            onClick={() => navigate('/products/categories')}
            className="px-4 py-1 rounded-md font-light text-white bg-green-900 dark:bg-green-400 cursor-pointer hover:bg-green-800 transition-colors"
            icon={<BiCategory size={24} />}
          >
            Categorias
          </Button>
          <Button
            onClick={() => navigate('/products/providers')}
            className="px-4 py-1 rounded-md text-white bg-purple-900 dark:bg-purple-400 cursor-pointer hover:bg-purple-800 transition-colors"
            icon={<BiCabinet size={24} />}
          >
            Proveedores
          </Button>
          <Button
            onClick={() => navigate('/products/inventory')}
            className="px-4 py-1 rounded-md text-black border-gray-500 bg-gray-200 dark:bg-gray-100 cursor-pointer hover:bg-gray-300 transition-colors"
          >
            Inventario
          </Button>
        </div>
      </div>

      <Table
        columns={productColumns}
        data={products}
        defaultPageSize={10}
        pageSizeOptions={[5, 10, 20]}
        actions={productActions}
      />
      {selected && modalType && (
        <ProductPriceModal
          product={selected}
          isOpen={true}
          actionType={modalType}
          onClose={() => setModalType(null)}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  );
};
