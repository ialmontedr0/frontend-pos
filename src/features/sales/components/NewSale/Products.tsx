import { useEffect, useState } from 'react';

import type { RootState } from '../../../../store/store';
import { useAppSelector, useAppDispatch } from '../../../../hooks/hooks';
import { getAllProducts } from '../../../products/slices/productsSlice';
import { getAllCategories } from '../../../products/categories/slices/categoriesSlice';

import type { Product } from '../../../products/interfaces/ProductInterface';

const CATEGORY_COLORS = [
  'bg-red-100',
  'bg-blue-100',
  'bg-green-100',
  'bg-yellow-100',
  'bg-purple-100',
];

interface ProductProps {
  search: string;
  onSelect: (p: Product) => void;
}

export const Products: React.FC<ProductProps> = ({ search, onSelect }) => {
  const dispatch = useAppDispatch();
  const { categories } = useAppSelector((state: RootState) => state.categories);
  const { products } = useAppSelector((state: RootState) => state.products);

  const [activeCat, setActiveCat] = useState<string>('Todos');

  useEffect(() => {
    dispatch(getAllCategories());
    dispatch(getAllProducts());
  }, []);

  const filtered = products.filter((p) => {
    if (activeCat !== 'Todos' && p.categoria.nombre !== activeCat) return false;
    return p.nombre.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="mt-4 text-black dark:text-gray-200 rounded shadow">
      <div className="flex space-x-4 px-4 py-2 overflow-x-auto border-b">
        <button
          onClick={() => setActiveCat('Todos')}
          className={activeCat === 'Todos' ? 'border-b-2 text-blue-600' : 'text-gray-600'}
        >
          Todos
        </button>
        {categories.map((c) => (
          <button
            key={c._id}
            onClick={() => setActiveCat(c.nombre)}
            className={activeCat === c.nombre ? 'border-b-2 text-blue-600' : 'text-gray-600'}
          >
            {c.nombre}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4 p-4 max-h-[500px] overflow-auto">
        {filtered.map((p, i) => (
          <div
            key={p._id}
            className={`${CATEGORY_COLORS[i % CATEGORY_COLORS.length]} 
            cursor-pointer rounded-lg p-3 flex flex-col items-center`}
            onClick={() => onSelect(p)}
          >
            <img
              src={p.foto || ''}
              alt={p.nombre}
              className="w-16 h-16 object-cover rounded mb-2"
            />
            <div className="text-sm font-medium">{p.nombre}</div>
            <div className="text-xs text-gray-600">RD$ {p.precioVenta.toFixed(2)}</div>
            <div className="text-xs text-gray-500">Stock: {p.stock}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
