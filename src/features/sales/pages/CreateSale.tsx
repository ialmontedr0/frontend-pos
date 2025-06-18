import type React from 'react';
import { CreateSaleForm } from '../components/CreateSaleForm';

export const CreateSale: React.FC = () => {
  return (
    <div className="p-6">
      <div className="my-4">
        <h2 className="text-2xl font-semibold">Nueva Venta</h2>
      </div>
      <CreateSaleForm />
    </div>
  );
};
