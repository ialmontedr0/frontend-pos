import React, { useEffect } from 'react';

import type { RootState } from '../../../../store/store';
import { useAppSelector, useAppDispatch } from '../../../../hooks/hooks';

import { fetchInventory } from '../slices/inventorySlice';
import Spinner from '../../../../components/UI/Spinner/Spinner';
import { Section } from '../../../../components/Section/Section';
import { ProductsTable } from '../components/ProductTable';

export const InventoryPage: React.FC = () => {
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
      <div>
        <h2 className="text-3xl font-regular">Inventario</h2>
      </div>

      {loading && <Spinner />}

      <div className="space-y-4">
        <Section title="Recientes" description="Productos recientes">
          <ProductsTable products={recent} emptyMessage="No hay productos reciente" />
        </Section>

        <Section title="Stock Bajo" description="Productos bajos de stock">
          <ProductsTable products={lowStock} emptyMessage="Sin productos bajos de stock" />
        </Section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Section title="Mas vendidos" description="Productos mas vendidos">
            <ProductsTable products={topSold} emptyMessage="Sin productos mas vendidos" />
          </Section>

          <Section title="Menos vendidos" description="Productos menos vendidos">
            <ProductsTable products={leastSold} emptyMessage="Productos menos vendidos" />
          </Section>
        </div>
      </div>
    </div>
  );
};
