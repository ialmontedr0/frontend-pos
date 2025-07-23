import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Input from '../../../components/UI/Input/Input';
import { Label } from '../../../components/UI/Label/Label';
import { Modal } from '../../../components/UI/Modal/Modal';
import Button from '../../../components/UI/Button/Button';
import { BiEraser, BiMoney, BiSolidBuilding, BiSolidTrash, BiWallet, BiX } from 'react-icons/bi';
import type { Sale } from '../interfaces/SaleInterface';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { useCallback, useEffect, useRef, useState } from 'react';
import { getSaleByCode } from '../../sales/slices/salesSlice';
import { createPayment } from '../../payments/slices/paymentsSlices';
import { myAlertError, myAlertSuccess, parsePaymentMethod } from '../../../utils/commonFunctions';
import type { CreatePaymentDTO } from '../../payments/dtos/create-payment.dto';
import type { Customer } from '../../customers/interfaces/CustomerInterface';
import type { RootState } from '../../../store/store';
import { Textarea } from '../../../components/UI/TextArea/TextArea';
import { getAllCustomers } from '../../customers/slices/customerSlice';

interface MakePaymentProps {
  sale: Sale;
  isOpen: boolean;
  closeModal: () => void;
  error?: string;
}

export const MakePayment: React.FC<MakePaymentProps> = ({ sale, isOpen, closeModal }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const myAlert = withReactContent(Swal);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerQuery, setCustomerQuery] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<
    'efectivo' | 'tarjetaCreditoDebito' | 'puntos'
  >('efectivo');
  const [cajaCodigo, setCajaCodigo] = useState<string>('');
  const customerInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAppSelector((state: RootState) => state.auth);
  const isAdmin = user?.rol === 'admin';
  const { customers } = useAppSelector((state: RootState) => state.customers);

  useEffect(() => {
    onCustomerQuery(customerQuery);
    dispatch(getAllCustomers());
  }, [customerQuery]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreatePaymentDTO>({
    defaultValues: {
      venta: '',
      cliente: '',
      montoPagado: 0,
      metodoPago: 'efectivo',
      referenciaExterna: '',
    },
  });

  useEffect(() => {
    if (!sale) return;

    return () => {};
  }, [sale]);

  useEffect(() => {
    if (sale) {
      reset({
        venta: sale._id,
        cliente: '',
        montoPagado: 0,
        metodoPago: 'efectivo',
        referenciaExterna: '',
      });
    }

    return () => {};
  }, [sale]);

  const onCustomerQuery = (q: string) => {
    setCustomerQuery(q);
  };

  const onSelectCustomer = (customer: Customer | null) => {
    setSelectedCustomer(customer);
  };

  const onSetPaymentMethod = (paymentMethod: 'efectivo' | 'tarjetaCreditoDebito' | 'puntos') => {
    setPaymentMethod(paymentMethod);
  };

  const onSubmit = useCallback(
    (createPaymentDTO: CreatePaymentDTO) => {
      myAlert
        .fire({
          title: 'Realizar Nuevo Pago',
          text: `Estas seguro que deseas realizar este pago?`,
          iconHtml: <BiMoney color="green" />,
          customClass: {
            icon: 'no-default-icon-border',
          },
          showConfirmButton: true,
          showCancelButton: true,
          confirmButtonText: 'Realizar Pago',
          cancelButtonText: 'Cancelar',
        })
        .then((result) => {
          if (result.isConfirmed && sale) {
            dispatch(
              createPayment({
                venta: sale._id,
                cliente: createPaymentDTO.cliente,
                montoPagado: createPaymentDTO.montoPagado,
                metodoPago: createPaymentDTO.metodoPago ?? 'efectivo',
                referenciaExterna: createPaymentDTO.referenciaExterna ?? '',
                ...(isAdmin ? { cajaCodigo: cajaCodigo.trim() } : {}),
              })
            )
              .unwrap()
              .then(() => {
                getSaleByCode(sale.codigo);
                navigate(0);
                closeModal();
                myAlertSuccess(`Pago Reaalizado`, `Pago Realizado con exito`);
              })
              .catch((error: any) => {
                myAlertError(error);
              });
          }
        });
    },
    [dispatch, sale, myAlert, myAlertSuccess, myAlertError]
  );

  const cancel = () => {
    myAlert
      .fire({
        title: 'Cancelar',
        text: `Estas seguro que deseas cancelar el nuevo pago?`,
        icon: 'question',
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: 'Cancelar',
        cancelButtonText: 'Continuar',
      })
      .then((result) => {
        if (result.isConfirmed) {
          closeModal();
        }
      });
  };

  if (!sale) return null;

  return (
    <>
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] mx-4 md:mx-auto">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-black dark:text-gray-200">
              Nuevo Pago
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-200 lg:mb-7">
              Realizar Nuevo Pago
            </p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
            <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
              <div className="mt-7">
                <h5 className="text-lg mb-5 font-medium text-black dark:text-gray-200 lg:mb-6">
                  Venta No. {sale.codigo}
                </h5>
                <p className="my-2 text-sm text-gray-500 dark:text-gray-200">
                  Monto Pendiente: RD$ {sale.montoPendiente.toFixed(2)}
                </p>
                <div className="flex flex-col md:grid md:grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div className="">
                    <input
                      ref={customerInputRef}
                      type="text"
                      className="h-11 w-full rounded-full border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-[#1d2939] dark:text-white/90 dark:placeholder:text-white/30"
                      placeholder="Buscar cliente..."
                      value={selectedCustomer?.nombre || customerQuery}
                      onChange={(e) => {
                        setCustomerQuery(e.target.value);
                        onSelectCustomer(null);
                      }}
                    />
                    {!selectedCustomer && customerQuery && (
                      <ul className="absolute bg-white border w-full mt-1 max-h-40 overflow-auto z-10">
                        {customers.map((c) => (
                          <li
                            key={c._id}
                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                              onSelectCustomer(c);
                              setCustomerQuery('');
                            }}
                          >
                            {c.nombre}
                          </li>
                        ))}
                      </ul>
                    )}
                    {selectedCustomer && (
                      <div className="flex flex-row gap-2 my-2">
                        <p>Cliente: {selectedCustomer.nombre}</p>
                        <Button
                          size="icon"
                          variant="icon"
                          startIcon={<BiSolidTrash color="red" size={20} />}
                          onClick={() => onSelectCustomer(null)}
                        ></Button>
                      </div>
                    )}
                  </div>

                  {isAdmin && (
                    <div>
                      <Label htmlFor="cajaCodigo">Caja Codigo</Label>
                      <Input
                        type="text"
                        value={cajaCodigo}
                        onChange={(e) => setCajaCodigo(e.target.value)}
                        placeholder="Ingresa el codigo de la caja"
                      />
                    </div>
                  )}

                  <div>
                    <Label htmlFor="montoPagado">Monto Pago</Label>
                    <Input
                      id="montoPagado"
                      type="number"
                      min={0}
                      max={sale.montoPendiente}
                      {...register('montoPagado', {
                        required: 'El campo Monto Pago es obligatorio.',
                        min: 0,
                        valueAsNumber: true,
                      })}
                    />
                    {errors.montoPagado && (
                      <div className="text-sm text-red-500">{errors.montoPagado.message}</div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="metodoPago">Metodo pago</Label>
                    <Button
                      size="icon"
                      variant="icon"
                      type="button"
                      startIcon={<BiMoney size={24} />}
                      onClick={() => onSetPaymentMethod('efectivo')}
                    ></Button>
                    <Button
                      size="icon"
                      variant="icon"
                      type="button"
                      startIcon={<BiWallet size={24} />}
                      onClick={() => onSetPaymentMethod('tarjetaCreditoDebito')}
                    ></Button>
                    <Button
                      size="icon"
                      variant="icon"
                      type="button"
                      startIcon={<BiSolidBuilding size={24} />}
                      onClick={() => onSetPaymentMethod('puntos')}
                    ></Button>
                    {paymentMethod && <p>Metodo Pago: {parsePaymentMethod(paymentMethod)}</p>}
                  </div>

                  <div>
                    <Label htmlFor="referenciaExterna">Referencia Externa</Label>
                    <Textarea
                      id="referenciaExterna"
                      {...register('referenciaExterna')}
                      placeholder="Referencia Externa"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 px-2 mt-6 justify-center md:justify-end">
              <Button type="submit" size="sm" variant="success" startIcon={<BiMoney size={24} />}>
                Realizar Pago
              </Button>
              <Button type="button" size="sm" variant="primary" startIcon={<BiEraser size={24} />}>
                Limpiar
              </Button>
              <Button size="sm" variant="outline" startIcon={<BiX size={24} />} onClick={cancel}>
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
};
