import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import type { RootState } from '../../../store/store';
import { useAppSelector, useAppDispatch } from '../../../hooks/hooks';
import { createPayment } from '../slices/paymentsSlices';
import { clearSaleError, clearSelectedSale, getSaleByCode } from '../../sales/slices/salesSlice';

import type { Sale } from '../../sales/interfaces/SaleInterface';
import Button from '../../../components/UI/Button/Button';
import { Label } from '../../../components/UI/Label/Label';
import Input from '../../../components/UI/Input/Input';
import { BiBuilding, BiCreditCard, BiEraser, BiMoney, BiMoneyWithdraw, BiX } from 'react-icons/bi';
import { myAlertError, myAlertSuccess, parsePaymentMethod } from '../../../utils/commonFunctions';
import PageMeta from '../../../components/common/PageMeta';
import Badge from '../../../components/UI/Badge/Badge';
import { AiOutlineSearch } from 'react-icons/ai';

export const CreatePayment: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const myAlert = withReactContent(Swal);

  const { sale, error } = useAppSelector((state: RootState) => state.sales);

  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [saleQuery, setSaleQuery] = useState<string>('');
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<
    'efectivo' | 'tarjetaCreditoDebito' | 'puntos'
  >('efectivo');

  useEffect(() => {
    setPaymentAmount(0);
  }, []);

  const onLoadSale = useCallback(
    (codigo: string) => {
      if (!codigo) {
        return;
      }

      dispatch(getSaleByCode(codigo))
        .unwrap()
        .then((sale: Sale) => {
          setSelectedSale(sale);
        });
    },
    [dispatch]
  );

  const clearPaymentAmount = () => {
    setPaymentAmount(0);
  };

  const handleSubmit = () => {
    if (!sale) return;

    myAlert
      .fire({
        title: `Crear pago`,
        text: `Seguro deseas crear el pago?`,
        icon: 'question',
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: 'Crear',
        cancelButtonText: 'Cancelar',
      })
      .then((result) => {
        if (result.isConfirmed) {
          dispatch(
            createPayment({
              venta: sale._id,
              metodoPago: paymentMethod,
              montoPagado: paymentAmount,
            })
          )
            .unwrap()
            .then(() => {
              myAlertSuccess(`Pago creado`, `Se ha creado el pago exitosamente!`);
              navigate('/payments');
              clear();
            })
            .catch((error: any) => {
              myAlertError(`Error`, `Error: ${error}`);
            });
        }
      });
  };

  const clear = () => {
    dispatch(clearSelectedSale());
    clearPaymentAmount();
    dispatch(clearSaleError());
    setSaleQuery('');
  };

  const cancel = () => {
    dispatch(clearSelectedSale());
    navigate(-1);
  };

  return (
    <>
      <PageMeta title="Nuevo Pago - PoS v2" description="Crear Nuevo Pago" />
      <div className="p-6 space-y-4 text-black m-2 md:mx-auto max-w-3xl rounded-xl bg-white dark:bg-gray-900 dark:text-gray-200 border-3 border-black h-screen md:h-auto shadow-lg md:max-h-full">
        <div className="border-black border-2 space-y-4">
          {/** Header del Componente */}
          <div className="">
            <h2 className="text-2xl md:text-3xl font-regular">Nuevo Pago</h2>
          </div>

          {/** Cuerpo del Componente */}
          <div className="">
            {/** Buscar la venta */}
            <Label htmlFor="codigo">Codigo Venta</Label>
            <div className="relative">
              <Input
                type="text"
                placeholder="Ingresa el codigo de la venta"
                value={saleQuery}
                onChange={(e) => setSaleQuery(e.target.value)}
              />
              <Button
                onClick={() => onLoadSale(saleQuery)}
                className="absolute right-3 top-2 hover:bg-gray-300"
                variant="icon"
                size="icon"
                startIcon={<AiOutlineSearch />}
              ></Button>
            </div>

            {error && <p className="">Error: {error}</p>}

            <div>
              {sale && (
                <div
                  className="space-y-2q
                "
                >
                  <h2 className="text-xl">Venta</h2>

                  <div className="grid grid-cols-2 space-x-2 space-y-2">
                    <div>
                      <Label htmlFor="codigo">Codigo</Label>
                      <p>{sale.codigo}</p>
                    </div>

                    <div>
                      <Label htmlFor="cliente">Cliente</Label>
                      <p>{sale.cliente.nombre}</p>
                    </div>

                    <div>
                      <Label htmlFor="estado">Estado</Label>
                      {sale.estado ? (
                        <Badge color="success">Completada</Badge>
                      ) : (
                        <Badge color="error">Pendiente</Badge>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="montoPendiente">Monto Pendiente</Label>
                      <p>RD$ {sale.montoPendiente.toFixed(2)}</p>
                    </div>

                    <div>
                      <Label htmlFor="totalVenta">Total</Label>
                      <p>RD$ {sale.totalVenta.toFixed(2)}</p>
                    </div>
                  </div>

                  {/** Pago Venta */}
                  <div>
                    <h2 className="text-xl font-regular">Pago Venta</h2>

                    <div>
                      <Input
                        type="number"
                        min={1}
                        max={sale.montoPendiente}
                        value={paymentAmount}
                        onChange={(e) => {
                          let val = parseFloat(e.target.value) || 0;
                          if (val > sale.montoPendiente) val = sale.montoPendiente;
                          else if (val < 0) val = 0;
                          setPaymentAmount(val);
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2">
                    <h2 className="text-xl font-regular">Metodo Pago</h2>

                    <div>
                      <Button
                        onClick={() => setPaymentMethod('efectivo')}
                        size="icon"
                        variant="icon"
                        startIcon={<BiMoney size={24} />}
                      ></Button>
                      <Button
                        onClick={() => setPaymentMethod('tarjetaCreditoDebito')}
                        size="icon"
                        variant="icon"
                        startIcon={<BiCreditCard size={24} />}
                      ></Button>
                      <Button
                        onClick={() => setPaymentMethod('puntos')}
                        size="icon"
                        variant="icon"
                        startIcon={<BiBuilding size={24} />}
                      ></Button>
                    </div>
                    <p className="my-2">Metodo Pago: {parsePaymentMethod(paymentMethod)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/** Botones del Componente */}
          <div className="flex flex-wrap justify-center md:justify-end gap-2">
            <Button
              onClick={handleSubmit}
              size="sm"
              variant="primary"
              startIcon={<BiMoneyWithdraw size={20} />}
            >
              Crear Pago
            </Button>
            <Button onClick={clear} size="sm" variant="outline" startIcon={<BiEraser size={20} />}>
              Limpiar
            </Button>
            <Button onClick={cancel} size="sm" variant="destructive" startIcon={<BiX size={20} />}>
              Cancelar
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
