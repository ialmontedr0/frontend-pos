import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import moment from 'moment';

import { useAppDispatch, useAppSelector } from '../../../../hooks/hooks';
import type { RootState } from '../../../../store/store';
import { getTransactionByID } from '../slices/transactionsSlice';
import { Label } from '../../../../components/UI/Label/Label';
import Button from '../../../../components/UI/Button/Button';
import { BiArrowBack } from 'react-icons/bi';

export const Transaction: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { transactionId } = useParams<{ transactionId: string }>();

  const { transaction } = useAppSelector((state: RootState) => state.transactions);

  useEffect(() => {
    if (!transactionId) return;

    dispatch(getTransactionByID(transactionId));
  }, [dispatch]);

  if (!transaction) {
    return (
      <div>
        <p>No existe la transaccion...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <div className="space-y-6">
        <h2 className="font-regular text-3xl">Transaccion</h2>
      </div>

      {/** Cuerpo de la transaccion */}
      <div className="lg:grid lg:grid-cols-2 md:flex md:flex-col space-y-4">
        <div>
          <Label className="text-md" htmlFor="">
            Fecha
          </Label>
          <p>{moment(transaction.fecha).format('LLLL')}</p>
        </div>

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
          <Label className="text-md" htmlFor="motivo">
            Motivo
          </Label>
          <p>{transaction.motivo}</p>
        </div>
      </div>

      <div>
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
