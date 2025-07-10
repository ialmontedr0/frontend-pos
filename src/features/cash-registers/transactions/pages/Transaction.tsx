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
import PageMeta from '../../../../components/common/PageMeta';
import PageBreadcrum from '../../../../components/common/PageBreadCrumb';
import Badge from '../../../../components/UI/Badge/Badge';

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
    <>
      <PageMeta title="Transaccion - PoS v2" description="Transaccion" />
      <PageBreadcrum pageTitle="Transaccion" />
      <div className="border border-black m-2 p-4 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
        <div className="flex-1 space-y-4 my-4">
          <h2 className="text-2xl md:text-3xl font-regular text-black dark:text-gray-200">
            Transaccion
          </h2>
        </div>

        <div className="flex flex-col md:grid md:grid-cols-2 gap-x-6 gap-y-2">
          <div>
            <Label htmlFor="tipo">Tipo</Label>
            {transaction.tipo === 'entrada' ? (
              <Badge color="success">Entrada</Badge>
            ) : (
              <Badge color="error">Salida</Badge>
            )}
          </div>

          <div>
            <Label htmlFor="fecha">Fecha</Label>
            <p>{moment(transaction.fecha).format('LLLL')}</p>
          </div>

          <div>
            <Label htmlFor="usuario">Usuario</Label>
            <p>{transaction.usuario.usuario}</p>
          </div>

          <div>
            <Label htmlFor="motivo">Motivo</Label>
            <p>{transaction.motivo}</p>
          </div>

          <div>
            <Label htmlFor="monto">Monto</Label>
            <p>RD$ {transaction.monto.toFixed(2)}</p>
          </div>
        </div>

        <div className="flex gap-2 justify-center md:justify-end my-4">
          <Button
            size="sm"
            variant="outline"
            startIcon={<BiArrowBack size={20} />}
            onClick={() => navigate('/transactions')}
          >Volver</Button>
        </div>
      </div>
    </>
  );
};
