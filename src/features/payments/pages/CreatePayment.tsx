import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import type { RootState } from '../../../store/store';
import { useAppSelector, useAppDispatch } from '../../../hooks/hooks';
import { createPayment } from '../slices/paymentsSlices';
import { clearSelectedSale, getSaleByCode } from '../../sales/slices/salesSlice';

import type { Sale } from '../../sales/interfaces/SaleInterface';
import  Button  from '../../../components/UI/Button/Button';
import { Label } from '../../../components/UI/Label/Label';
import  Input  from '../../../components/UI/Input/Input';
import { BiEraser, BiGlasses, BiSave, BiX } from 'react-icons/bi';
import { Select } from '../../../components/UI/Select/Select';

export const CreatePayment: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const myAlert = withReactContent(Swal);

  const { sale, loading, error } = useAppSelector((state: RootState) => state.sales);

  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [saleQuery, setSaleQuery] = useState<string>('');
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<
    'efectivo' | 'credito' | 'tarjetaCreditoDebito' | 'puntos'
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
              myAlert.fire({
                title: `Pago creado`,
                text: `Se  ha creado el pago con exito!`,
                icon: 'success',
                timer: 5000,
                timerProgressBar: true,
              });
              navigate('/payments');
              clear();
            })
            .catch((error: any) => {
              myAlert.fire({
                title: 'Error',
                text: `Error: ${error.response?.data?.message || error.message}`,
                icon: 'error',
                timer: 5000,
                timerProgressBar: true,
              });
            });
        }
      });
  };

  const clear = () => {
    dispatch(clearSelectedSale());
    setSaleQuery('');
  };

  const cancel = () => {
    dispatch(clearSelectedSale());
    navigate(-1);
  };

  return (
    <div className="p-6">
      <div>
        <h2 className="text-2xl font-semibold">Nuevo Pago</h2>
      </div>

      <div>
        <div className="">
          <Label htmlFor="codigo">Ingresa el codigo de la venta</Label>
          <div className="flex flex-row gap-2 relative">
            <Input
              type="text"
              placeholder="Ingresa codigo venta, ej: X0000000"
              value={saleQuery}
              onChange={(e) => setSaleQuery(e.target.value)}
            />

            <Button
              className="bg-trasnparent hover:bg-gray-100 text-black border border-gray-100"
              startIcon={<BiGlasses size={24} onClick={() => onLoadSale(saleQuery)} />}
            ></Button>
          </div>
        </div>

        {error && <p className="text-sm text-red-600">Error: {error}</p>}

        {loading && <div>Cargando...</div>}

        {sale && (
          <div className="my-2">
            <div>
              <h3 className="text-lg font-semibold">Detalles venta</h3>
            </div>

            <div className="grid grid-cols-2">
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
                <p
                  className={`w-fit px-4 rounded-full text-sm ${
                    sale.estado === 'pendiente' ? 'bg-orange-600 text-white' : 'bg-green-600'
                  }`}
                >
                  {sale.estado.charAt(0).toUpperCase() + sale.estado.slice(1)}
                </p>
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

            <div className="my-3">
              <Label>Pago venta</Label>

              <div className="my-2 flex flex-row gap-2 relative">
                <Input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => {
                    let val = parseFloat(e.target.value) || 0;
                    if (val > sale.montoPendiente) val = sale.montoPendiente;
                    else if (val < 0) val = 0;
                    setPaymentAmount(val);
                  }}
                />
                <Button
                  className="bg-transparent hover:bg-gray-200 transition-colors text-black"
                  startIcon={<BiEraser size={20} />}
                  onClick={clearPaymentAmount}
                ></Button>
              </div>
            </div>

            <div>
              <Label htmlFor="metodoPago">Metodo Pago</Label>
              <Select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="w-full border rounded px-3 py-2"
              >
                <option value="efectivo">Efectivo</option>
                <option value="credito">Credito</option>
                <option value="tarjetaCreditoDebito">Tarjeta</option>
                <option value="puntos">Puntos</option>
              </Select>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-grow gap-2 my-2">
        <Button
          className="px-3 rounded-full py-1 bg-blue-800 hover:bg-blue-900 disabled-[bg-blue-200] transition-colors"
          startIcon={<BiSave size={20} />}
          onClick={handleSubmit}
          disabled={!paymentAmount}
        >
          Crear pago
        </Button>
        <Button
          className="px-3 py-1 bg-white rounded-full hover:bg-gray-200 transition-colors border border-gray-500 text-black "
          startIcon={<BiEraser size={20} />}
          onClick={clear}
        >
          Limpiar
        </Button>
        <Button
          className="rounded-full px-3 py-1 bg-red-600 hover:bg-red-700 transition-colors"
          startIcon={<BiX size={20} />}
          onClick={cancel}
        >
          Cancelar
        </Button>
      </div>
    </div>
  );
};
