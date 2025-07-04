import React from 'react';
import type { Product } from '../../interfaces/ProductInterface';
import { Table } from '../../../../components/Table/Table';
import type { Column, Action } from '../../../../components/Table/types';
import { useNavigate } from 'react-router-dom';

type ProductTableProps = {
  products: Product[];
  emptyMessage?: string;
};

export const ProductsTable: React.FC<ProductTableProps> = ({
  products,
  emptyMessage = 'No hay productos para mostrar',
}) => {
  const navigate = useNavigate();
  const productsColumns: Column<Product>[] = [
    { header: 'Codigo', accessor: 'codigo' },
    { header: 'Nombre', accessor: 'nombre' },
    { header: 'Stock', accessor: 'stock' },
    { header: 'Vendidos', accessor: 'soldCount' },
  ];

  const productActions: Action<Product>[] = [
    { label: 'Ver', onClick: (p) => navigate(`/products/${p.codigo}`) },
  ];

  if (products.length === 0) {
    return <div className="text-center text-gray-500 py-10">{emptyMessage}</div>;
  }

  return (
    <div className="overflow-auto">
      <Table
        data={products}
        actions={productActions}
        columns={productsColumns}
        pageSizeOptions={[10, 20]}
        defaultPageSize={10}
      />
    </div>
  );
};
