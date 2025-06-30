import { useEffect, useState } from 'react';

import type { RootState } from '../../../../store/store';
import { useAppSelector, useAppDispatch } from '../../../../hooks/hooks';
import { getAllProducts } from '../../../products/slices/productsSlice';
import { getAllCategories } from '../../../products/categories/slices/categoriesSlice';

import type { Category } from '../../../products/categories/interfaces/CategoryInterface';
import type { Product } from '../../../products/interfaces/ProductInterface';

interface ProductProps {
  onSelectProduct: (p: Product) => void;
}

export const Products: React.FC<ProductProps> = ({ onSelectProduct }) => {
  const dispatch = useAppDispatch();
  const [productQuery, setProductQuery] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeCat, setActiveCat] = useState('Todos');

  const { products } = useAppSelector((state: RootState) => state.products);

  /* const products: Product[] = [
    {
      codigo: '1',
      _id: '1',
      nombre: 'Arroz',
      precioCompra: 5,
      precioVenta: 10,
      stock: 10,
      foto: 'http://img.png',
      categoria: 'Comida',
      proveedor: 'Proveedor',
      itbis: true,
      disponible: true,
    },
  ]; */
  const { categories } = useAppSelector((state: RootState) => state.categories);

  const filteredProducts =
    activeCat === 'Todas'
      ? products
      : products.filter(
          (p) =>
            p.categoria === activeCat ||
            p.codigo.toLowerCase().includes(productQuery.toLowerCase()) ||
            p.nombre.toLowerCase().includes(productQuery.toLowerCase())
        );

  useEffect(() => {
    dispatch(getAllProducts());
    dispatch(getAllCategories());
  }, [dispatch]);

  return (
    <div className="mt-4 bg-white dark:bg-[#1d2939] rounded-lg border">
      <div className="flex space-x-4 px-4 py-2 border-b overflow-x-auto">
        {categories.map((cat) => (
          <button
            key={cat._id}
            onClick={() => setActiveCat(cat.nombre)}
            className={`pb-1 ${activeCat === cat.nombre ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-600 hover:text-gray-800'}`}
          >
            {cat.nombre}
          </button>
        ))}
      </div>

      <div className="p-4 grid grid-cols-3 gap-4 max-h-[400px] overflow-y-auto">
        {filteredProducts.map((p) => (
          <div
            key={p._id}
            onClick={() => onSelectProduct(p)}
            className="cursor-pointer hover:shadow-md rounded-lg border p-2 flex flex-col items-center space-x-3"
          >
            <img src={p.foto} alt={p.nombre} className="w-12 h-12 object-cover rounded" />
            <div className='flex flex-col'>
              <span className="text-sm font-medium">{p.nombre}</span>
              <span className="text-sm">Stock: {p.stock}</span>
              <span className="text-xs">RD$ {p.precioVenta.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
