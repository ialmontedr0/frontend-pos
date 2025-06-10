import React from 'react';
import { Link, useRouteError, isRouteErrorResponse } from 'react-router-dom';

export const NotFound: React.FC = () => {
  const error = useRouteError();

  let title = '404';
  let message = 'La pagina que buscas no existe.';

  if (isRouteErrorResponse(error)) {
    title = error.status.toString();
    message = error.statusText ?? message;
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <h1 className="mb-4 text-9xl font-extrabold text-gray-400">{title}</h1>
      <p className="mb-8 text-xl text-gray-600 dark:text-gray-300">{message}</p>
      <Link
        to="/"
        className="
          inline-block px-6 py-3
          bg-indigo-600 text-white rounded shadow
          hover:bg-indigo-700 transition
        "
      >
        Ir al Inicio
      </Link>
    </div>
  );
};
