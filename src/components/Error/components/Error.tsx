import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../UI/Button/Button';
import { BiArrowBack, BiRefresh } from 'react-icons/bi';

type ErrorProps = {
  message: string;
};

export const Error: React.FC<ErrorProps> = ({ message }) => {
  const navigate = useNavigate();

  const reload = () => {
    navigate(0)
  }

  return (
    <div className="m-4 w-md bg-red-200 rounded-xl shadow-md p-2 border border-gray-400 h-auto space-y-2">
      <div className="">
        <h2 className="text-2xl md:text-3xl font-regular">Error</h2>
      </div>

      <div>
        <p>Error: {message}</p>
      </div>

      <div className="my-4 flex flex-row justify-start gap-2">
        <Button
          size="sm"
          variant="outline"
          startIcon={<BiArrowBack size={20} />}
          onClick={() => navigate(-1)}
        >
          Volver
        </Button>
        <Button size="sm" variant="primary" startIcon={<BiRefresh size={20} />} onClick={reload}>
          Recargar
        </Button>
      </div>
    </div>
  );
};
