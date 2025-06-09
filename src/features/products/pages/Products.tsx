import type React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispath } from '../../../hooks/hooks';

export const Products: React.FC = () => {
  const dispatch = useAppDispath();
  const navigate = useNavigate();

  return (
    <div className="text-black dark:text-white">
      <div className="flex flex-col">
        <h2 className="text-xl font-semibold mb-3">Productos</h2>

        <button
          className="bg-blue-800 text-white dark:text-white px-4 py-2 w-xs rounded-lg"
          onClick={() => navigate('/products/categories')}
        >
          Categorias
        </button>
        <button onClick={() => navigate('/products/providers')}>Proveedores</button>
      </div>
    </div>
  );
};
