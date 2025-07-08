import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import moment from 'moment/min/moment-with-locales';

import { useAppDispatch, useAppSelector } from '../../../../hooks/hooks';
import type { RootState } from '../../../../store/store';
import { getTransactionByID } from '../slices/transactionsSlice';
import { Label } from '../../../../components/UI/Label/Label';
import Button from '../../../../components/UI/Button/Button';
import { BiArrowBack } from 'react-icons/bi';
import { NotFound } from '../../../../pages/NotFound';
import Spinner from '../../../../components/UI/Spinner/Spinner';

export const Transaction: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  moment.locale('es');
  const { transactionId } = useParams<{ transactionId: string }>();

  const { transaction, loading, error } = useAppSelector((state: RootState) => state.transactions);

  useEffect(() => {
    if (!transactionId) return;

    dispatch(getTransactionByID(transactionId));
  }, [dispatch]);

  if (!transaction) {
    return <NotFound node="Transaccion" />;
  }

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-6 space-y-4 rounded-xl shadow-md h-auto bg-white dark:bg-gray-900 m-2 md:mx-auto text-black dark:text-gray-200">
      <div className="space-y-6">
        <h2 className="font-regular text-2xl md:text-3xl">Transaccion</h2>
      </div>

      {/** Cuerpo de la transaccion */}
      <div className="lg:grid lg:grid-cols-2 md:flex md:flex-col space-y-4">
        <div>
          <Label className="text-md" htmlFor="usuario">
            Usuario
          </Label>
          <p>{transaction.usuario.usuario}</p>
        </div>

        <div>
          <Label className="text-md" htmlFor="tipo">
            Tipo
          </Label>
          <p>{transaction.tipo === 'entrada' ? 'Entrada' : 'Salida'}</p>
        </div>

        <div>
          <Label className="text-md" htmlFor="monto">
            Monto
          </Label>
          <p>RD$ {transaction.monto.toFixed(2)}</p>
        </div>

        <div>
          <Label className="text-md" htmlFor="">
            Fecha
          </Label>
          <p>{moment(transaction.fecha).format('LLLL')}</p>
        </div>

        <div>
          <Label className="text-md" htmlFor="motivo">
            Motivo
          </Label>
          <p>{transaction.motivo}</p>
        </div>
      </div>

      <div className="flex gap-2 justify-center md:justify-end my-4">
        <Button
          onClick={() => navigate('/transactions')}
          size="sm"
          startIcon={<BiArrowBack size={24} />}
        >
          Volver
        </Button>
      </div>
    </div>
  );
};
