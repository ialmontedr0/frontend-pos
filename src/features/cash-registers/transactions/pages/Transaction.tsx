import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../../hooks/hooks';
import type { RootState } from '../../../../store/store';
import { getTransactionByID } from '../slices/transactionsSlice';

export const Transaction: React.FC = () => {
  const dispatch = useAppDispatch();
  const { transactionId } = useParams<{ transactionId: string }>();

  const { transaction } = useAppSelector((state: RootState) => state.transactions);

  useEffect(() => {
    if (!transactionId) return;

    dispatch(getTransactionByID(transactionId));
  }, [dispatch]);

  return (
    <div>
      <div>
        <h2>Transaccion</h2>
      </div>

      {transaction && <div>{transaction.fecha}</div>}
    </div>
  );
};
