import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import type { RootState } from '../../../store/store';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import { getAllProducts, deleteProduct, updateProduct } from '../slices/productsSlice';
import { myAlertError, myAlertSuccess } from '../../../utils/commonFunctions';

import type { Product } from '../interfaces/ProductInterface';
import type { Column, Action } from '../../../components/Table/types';
import { Table } from '../../../components/Table/Table';

import Button from '../../../components/UI/Button/Button';
import { BiMoney, BiPlusCircle, BiTrash } from 'react-icons/bi';
import Spinner from '../../../components/UI/Spinner/Spinner';

export const Products: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const myAlert = withReactContent(Swal);

  const { products, loading, error } = useAppSelector((state: RootState) => state.products);

  let buyCost: number = 0;
  let sellCost: number = 0;

  const productsData: Product[] = products;

  const handleUpdateCost = useCallback(
    (productId: string) => {
      myAlert
        .fire({
          title: `Actualizar precio de compra`,
          text: 'Ingresa el nuevo precio de compra del producto!',
          iconHtml: <BiMoney className='text-green-500'/>,
          customClass: {
            icon: 'no-default-icon-border',
          },
          input: 'number',
          inputValue: buyCost,
          inputPlaceholder: `RD$ .00`,
          showConfirmButton: true,
          showCancelButton: true,
          confirmButtonText: 'Actualizar',
          cancelButtonText: 'Cancelar',
        })
        .then((result) => {
          if (result.isConfirmed) {
            buyCost = Number(result.value);
            dispatch(
              updateProduct({
                productId: productId,
                updateProductDTO: {
                  precioCompra: buyCost,
                },
              })
            )
              .unwrap()
              .then(() => {
                myAlertSuccess(
                  `Producto actualizado`,
                  `Se ha actualizado el precio de compra del producto`
                );
              })
              .catch((error: any) => {
                myAlertError(`Error`, `Error: ${error.response?.data?.message || error.message}`);
              });
          }
        });
    },
    [dispatch, myAlertSuccess, myAlertError]
  );

  const handleUpdateSell = useCallback(
    (productId: string) => {
      myAlert
        .fire({
          title: `Actualizar precio venta`,
          text: `Ingresa el nuevo monto de venta del producto por favor!`,
          iconHtml: <BiMoney className="text-green-400" />,
          customClass: {
            icon: 'no-default-icon-border',
          },
          input: 'number',
          inputValue: sellCost,
          showConfirmButton: true,
          showCancelButton: true,
          confirmButtonText: 'Actualizar',
          cancelButtonText: 'Cancelar',
        })
        .then((result) => {
          if (result.isConfirmed) {
            sellCost = Number(result.value);
            dispatch(
              updateProduct({
                productId: productId,
                updateProductDTO: {
                  precioVenta: sellCost,
                },
              })
            )
              .unwrap()
              .then(() => {
                myAlertSuccess(
                  `Precio de venta actualizado!`,
                  `Se ha actualizado el precio de venta del producto con exito!`
                );
              })
              .catch((error: any) => {
                myAlertError(`Error`, `Error: ${error.response?.data?.message || error.message}`);
              });
          }
        });
    },
    [dispatch, myAlertSuccess, myAlertError]
  );

  useEffect(() => {
    dispatch(getAllProducts());
  }, [dispatch]);

  const productColumns: Column<Product>[] = [
    { header: 'Nombre', accessor: 'nombre' },
    {
      header: 'Categoria',
      accessor: 'categoria',
      render: (value: { _id: string; nombre: string } | null) => (value ? value.nombre : '-'),
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
    { label: 'Ver', onClick: (p) => navigate(`/products/${p.codigo}`) },
    { label: 'Editar', onClick: (p) => navigate(`/products/edit/${p.codigo}`) },
    { label: 'Act precio compra', onClick: (p) => handleUpdateCost(p._id) },
    { label: 'Act precio venta', onClick: (p) => handleUpdateSell(p._id) },
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
          iconHtml: <BiTrash className="text-red-400" />,
          customClass: {
            icon: 'no-default-icon-border',
          },
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
                myAlertSuccess(`Producto eliminado`, `Se ha eliminado el producto exitosamente~`);
                navigate('/products');
              })
              .catch((error: any) => {
                myAlertError(`Error`, `Error: ${error.response?.data?.message || error.message}`);
              });
          }
        });
    },
    [dispatch, navigate]
  );

  return (
    <div className="p-4 space-y-6">
      <div className="space-y-4">
        <h2 className="text-3xl font-regular text-black dark:text-gray-200">Productos</h2>

        <Button
          onClick={() => createProduct()}
          variant="primary"
          startIcon={<BiPlusCircle size={24} />}
        >
          Nuevo Producto
        </Button>
      </div>

      {loading && <Spinner />}

      {error && <div className="text-red-500">Error: {error}</div>}

      {productsData.length ? (
        <Table
          columns={productColumns}
          data={products}
          defaultPageSize={10}
          pageSizeOptions={[5, 10, 20]}
          actions={productActions}
        />
      ) : (
        <div>No hay productos en el sistema.</div>
      )}
    </div>
  );
};
