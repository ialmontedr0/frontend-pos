import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { RootState } from '../../../store/store';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import { getAllProducts } from '../slices/productsSlice';

import type { Product } from '../interfaces/ProductInterface';
import type { Column, Action } from '../../../components/Table/types';
import { Table } from '../../../components/Table/Table';

import Button from '../../../components/UI/Button/Button';
import { BiPlusCircle } from 'react-icons/bi';
import Spinner from '../../../components/UI/Spinner/Spinner';
import { EditProduct } from '../components/EditProduct';
import { useModal } from '../../../hooks/useModal';
import { ProductPrice } from '../components/ProductPrice';

export default function Products() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isOpen: isEditOpen, openModal: openEditModal, closeModal: closeEditModal } = useModal();
  const {
    isOpen: isUpdatePriceOpen,
    openModal: openUpdatePriceModal,
    closeModal: closeUpdatePriceModal,
  } = useModal();
  const [actionType, setActionType] = useState<'updateCost' | 'updateBuy'>('updateCost');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { products, loading, error } = useAppSelector((state: RootState) => state.products);

  const productsData: Product[] = products;

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
    { label: 'Editar', onClick: (product) => onEditProduct(product) },
    { label: 'Act precio compra', onClick: (product) => onUpdateCost(product) },
    { label: 'Act precio venta', onClick: (product) => onUpdateSell(product) },
  ];

  const createProduct = () => {
    navigate('/products/create');
  };

  const onEditProduct = (product: Product) => {
    setSelectedProduct(product);
    openEditModal();
  };

  const onUpdateCost = (product: Product) => {
    setSelectedProduct(product);
    setActionType('updateCost');
    openUpdatePriceModal();
  };

  const onUpdateSell = (product: Product) => {
    setSelectedProduct(product);
    setActionType('updateBuy');
    openUpdatePriceModal()
  }

  return (
    <>
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
      <EditProduct
        product={selectedProduct!}
        isOpen={isEditOpen}
        closeModal={closeEditModal}
        error={error!}
      />
      <ProductPrice 
        product={selectedProduct!}
        isOpen={isUpdatePriceOpen}
        closeModal={closeUpdatePriceModal}
        actionType={actionType}
        error={error!}
      />
    </>
  );
};
