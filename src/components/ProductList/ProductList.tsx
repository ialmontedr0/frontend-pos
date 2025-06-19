import React from 'react';
import type { Product } from '../../features/products/interfaces/ProductInterface';

interface Props {
  products: Product[];
}

const ProductList: React.FC<Props> = ({ products }) => (
  <ul className="divide-y">
    {products.map((p) => (
      <li key={p._id} className="py-2 flex justify-between">
        <span>{p.nombre}</span>
        <span className="font-semibold">{p.stock}</span>
      </li>
    ))}
  </ul>
);

export default ProductList;
