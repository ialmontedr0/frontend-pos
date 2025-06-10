import React from 'react';
import { useNavigate } from 'react-router-dom';

export const Forbidden: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="p-8 text-center">
      <h2 className="text-3xl font-bold mb-4 text-black dark:text-white">403 • Acceso denegado</h2>
      <p className="mb-6">No tienes persmisos para ver esta pagina</p>
      <button
        onClick={() => navigate(-1)}
        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
      >
        Volver
      </button>
    </div>
  );
};
