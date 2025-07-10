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
    navigate(0);
  };

  return (
    <div className="self-center m-4 w-md bg-red-200 rounded-xl shadow-md p-2 h-auto space-y-2">
      <div className="p-2">
        <h2 className="text-2xl md:text-3xl font-regular">Error</h2>
      </div>

      <div className="p-2">
        <p className="text-sm text-gray-700 font-regular">Error: {message}</p>
      </div>

      <div className="my-4 flex flex-row justify-start gap-2">
        <Button
          size="icon"
          variant="icon"
          startIcon={<BiArrowBack size={24} />}
          onClick={() => navigate(-1)}
        ></Button>
        <Button
          size="icon"
          variant="icon"
          startIcon={<BiRefresh size={24} />}
          onClick={reload}
        ></Button>
      </div>
    </div>
  );
};
