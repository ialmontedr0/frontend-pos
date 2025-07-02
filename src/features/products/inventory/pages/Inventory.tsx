import React, { useEffect } from 'react';

import type { RootState } from '../../../../store/store';
import { useAppSelector, useAppDispatch } from '../../../../hooks/hooks';

import { fetchInventory } from '../slices/inventorySlice';
import type { Product } from '../../interfaces/ProductInterface';
import Spinner from '../../../../components/UI/Spinner/Spinner';
import ProductList from '../../../../components/ProductList/ProductList';

export const Inventory: React.FC = () => {
  const dispatch = useAppDispatch();
  const { lowStock, recent, topSold, leastSold, loading, error } = useAppSelector(
    (state: RootState) => state.inventory
  );

  useEffect(() => {
    dispatch(fetchInventory());
  }, [dispatch]);

  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="p-6 space-y-4">
      <div className="">
        <h2 className="text-3xl font-regular text-black dark:text-gray-200">Inventario</h2>
      </div>
      {loading && <Spinner />}

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {error && <p className="text-red-600">{error}</p>}

        <div className="bg-white rounded shadow p-4">
          <h3 className="text-lg font-semibold mb-2">Productos bajos de Stock</h3>
          <ProductList products={lowStock} />
        </div>

        <div className="bg-white rounded shadow p-4">
          <h3 className="text-lg font-semibold mb-2">Productos más vendidos</h3>
          <ProductList products={topSold} />
        </div>

        <div className="bg-white rounded shadow p-4">
          <h3 className="text-lg font-semibold mb-2">Productos menos vendidos</h3>
          <ProductList products={leastSold} />
        </div>

        <div className="bg-white rounded shadow p-4">
          <h3 className="text-lg font-semibold mb-2">Productos recientes</h3>
          <ProductList products={recent} />
        </div>
      </div>
    </div>
  );
};
