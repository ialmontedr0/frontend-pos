import React from 'react';

export const Dashboard: React.FC = () => {
  return (
    <div className="p-6">
      <div>
        <h2 className="claro:text-black dark:text-red-900 text-2xl font-semibold mb-4">Dashboard</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white shadow rounded p-4">
          <h3 className="text-lg font-medium">Ventas hoy</h3>
          <p className="text-3xl">1,234</p>
        </div>
        <div className="bg-white shadow rounded p-4">
          <h3 className="text-lg font-medium">Clientes activos</h3>
          <p className="text-3xl">56</p>
        </div>
        <div className="bg-white shadow rounded p-4">
          <h3 className="text-lg font-medium">Productos bajos de stock</h3>
          <p className="text-3xl">8</p>
        </div>
      </div>
    </div>
  );
};
