import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import type { RootState } from '../../../store/store';
import { useAppSelector, useAppDispatch } from '../../../hooks/hooks';
import { clearSelectedPayment, createPayment } from '../slices/paymentsSlices';
import { clearSelectedSale, getSaleByCode } from '../../sales/slices/salesSlice';

import type { Sale } from '../../sales/interfaces/SaleInterface';
import Button from '../../../components/UI/Button/Button';
import { Label } from '../../../components/UI/Label/Label';
import Input from '../../../components/UI/Input/Input';
import {
  BiCreditCard,
  BiEraser,
  BiMoney,
  BiSave,
  BiSearch,
  BiSolidSchool,
  BiX,
} from 'react-icons/bi';
import { myAlertError, myAlertSuccess, parsePaymentMethod } from '../../../utils/commonFunctions';
import PageMeta from '../../../components/common/PageMeta';
import Badge from '../../../components/UI/Badge/Badge';

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
              myAlertError(`Error`, `Error: ${error.response?.data?.message || error.message}`);
            });
        }
      });
  };

  const clear = () => {
    dispatch(clearSelectedSale());
    clearPaymentAmount();
    setSaleQuery('');
  };

  const cancel = () => {
    dispatch(clearSelectedSale());
    navigate(-1);
  };

  return (
    <>
      {/** Meta */}
      <PageMeta title="Nuevo Pago - PoS v2" description="Creando nuevo pago" />

      {/** Header del componente */}
      <div className="p-6 h-screen max-h-full text-black dark:text-gray-200">
        <div className="">
          <h2 className="text-3xl font-regular">Nuevo Pago</h2>
        </div>

        {/** Cuerpo del componente */}
        <div className="my-2">
          {/** Busqueda de la venta */}
          <div className="relative">
            <input
              type="text"
              className="border text-sm placeholder:text-gray-500 rounded-xl w-full px-3 py-2 lg:w-md md:w-sm sm:w-xs"
              placeholder="Ingresa el codigo de la venta"
              value={saleQuery}
              onChange={(e) => setSaleQuery(e.target.value)}
            />
            <BiSearch
              onClick={() => onLoadSale(saleQuery)}
              className="absolute right-3 top-3 text-gray-400 rounded-full hover:bg-gray-300 transition-colors"
            />
          </div>

          {error && (
            <p className="my-2 ml-1 p-1 px-2 rounded-lg bg-red-300 text-gray-700 text-sm font-regular w-fit">
              Error: {error}
            </p>
          )}

          <div>
            {sale && (
              <div className="px-2">
                <h2 className="text-xl">Detalles de la Venta</h2>

                <div className="lg:grid lg:grid-cols-2 space-x-1">
                  <div>
                    <Label htmlFor="codigo">Codigo Venta</Label>
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
                    <Label htmlFor="montPendiente">Monto Pendiente</Label>
                    <p>RD$ {sale.montoPendiente.toFixed(2)}</p>
                  </div>

                  <div>
                    <Label htmlFor="totalVenta">Total</Label>
                    <p>RD$ {sale.totalVenta.toFixed(2)}</p>
                  </div>
                </div>

                {/** Pago venta */}
                <div className="">
                  <h2 className="text-xl my-2">Pago Venta</h2>

                  <div className="">
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
                      className="lg:w-md md:w-sm sm:w-xs"
                    />
                  </div>
                </div>

                <div className="flex flex-col my-2">
                  <Label htmlFor="metodoPago" className="text-xl font-regular">
                    Metodo Pago
                  </Label>
                  <div className="w-fit p-2 flex flex-row gap-2">
                    <button
                      onClick={() => setPaymentMethod('efectivo')}
                      className="p-4 border border-gray-200 bg-gray-100 focus:bg-gray-300 hover:bg-gray-200 rounded-lg transition-all"
                    >
                      <BiMoney />
                    </button>
                    <button
                      onClick={() => setPaymentMethod('tarjetaCreditoDebito')}
                      className="p-4 border border-gray-200 bg-gray-100 focus:bg-gray-300 hover:bg-gray-200 rounded-lg transition-all"
                    >
                      <BiCreditCard />
                    </button>
                    <button
                      onClick={() => setPaymentMethod('puntos')}
                      className="p-4 border border-gray-200 bg-gray-100 focus:bg-gray-300 hover:bg-gray-200 rounded-lg transition-all"
                    >
                      <BiSolidSchool />
                    </button>
                  </div>
                  <p className="my-2">Metodo pago: {parsePaymentMethod(paymentMethod)}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/** Botones */}
        <div className="flex flex-wrap gap-2 p-2 justify-end">
          <Button
            onClick={handleSubmit}
            size="sm"
            variant="primary"
            startIcon={<BiSave size={20} />}
          >
            Crear Pago
          </Button>
          <Button
            onClick={clear}
            size="sm"
            startIcon={<BiEraser size={20} className="bg-transparent" />}
          >
            Limpiar
          </Button>
          <Button onClick={cancel} size="sm" variant="outline" startIcon={<BiX size={20} />}>
            Cancelar
          </Button>
        </div>
      </div>
    </>
  );
};
