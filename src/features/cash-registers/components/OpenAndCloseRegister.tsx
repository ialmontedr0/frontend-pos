import React, { useCallback, useEffect } from 'react';
import type { CashRegister } from '../interfaces/CashRegisterInterface';
import { useAppDispatch } from '../../../hooks/hooks';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import type { OpenRegisterDTO } from '../dtos/open-register.dto';
import { useForm } from 'react-hook-form';
import { BiSave, BiSolidBox, BiX } from 'react-icons/bi';
import { closeCashRegister, openCashRegister } from '../slices/cashRegisterSlice';
import { myAlertError, myAlertSuccess } from '../../../utils/commonFunctions';
import { Modal } from '../../../components/UI/Modal/Modal';
import Button from '../../../components/UI/Button/Button';
import { Label } from '../../../components/UI/Label/Label';
import Input from '../../../components/UI/Input/Input';
import type { CloseRegisterDTO } from '../dtos/close-register.dto';

type FormValues = OpenRegisterDTO | CloseRegisterDTO;

interface Props {
  cashRegister: CashRegister;
  isOpen: boolean;
  closeModal: () => void;
  actionType: 'open' | 'close';
  error?: string;
}

export const OpenAndCloseRegister: React.FC<Props> = ({
  cashRegister,
  isOpen,
  closeModal,
  actionType = 'open',
  error,
}) => {
  const dispatch = useAppDispatch();

  const myAlert = withReactContent(Swal);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  useEffect(() => {
    if (!cashRegister) return;
    if (actionType === 'open') {
      reset({ montoApertura: cashRegister.montoApertura ?? 0 });
    } else {
      reset({ montoCierre: cashRegister.montoCierre ?? 0 });
    }
  }, [cashRegister, actionType, reset]);

  useEffect(() => {
    if (!cashRegister) {
      return;
    }
    return () => {};
  }, [cashRegister]);

  const onSubmit = useCallback(
    (data: FormValues) => {
      const confirmTitle = actionType === 'open' ? 'Abrir Caja' : 'Cerrar Caja';
      const confirmText = `Deseas ${confirmTitle.toLowerCase()} la caja ${cashRegister.codigo}`;

      myAlert
        .fire({
          title: confirmTitle + ' caja',
          text: confirmText,
          iconHtml: <BiSolidBox />,
          customClass: {
            icon: 'no-default-icon-border',
          },
          showConfirmButton: true,
          showCancelButton: true,
          confirmButtonText: 'Abrir',
          cancelButtonText: 'Cancelar',
        })
        .then((result) => {
          if (result.isConfirmed && cashRegister) {
            if (actionType === 'open') {
              dispatch(
                openCashRegister({
                  cashRegisterId: cashRegister._id,
                  openRegisterDTO: data as OpenRegisterDTO,
                })
              )
                .unwrap()
                .then(() => {
                  myAlertSuccess(`Caja Abierta`, `Se ha abierto la caja con exito.`);
                })
                .catch((error: any) => {
                  myAlertError(error);
                });
            } else {
              dispatch(
                closeCashRegister({
                  cashRegisterId: cashRegister._id,
                  closeRegisterDTO: data as CloseRegisterDTO,
                })
              )
                .unwrap()
                .then(() => {
                  myAlertSuccess(`Caja Cerrada`, `Se ha cerrado la caja con exito.`);
                })
                .catch((error: any) => {
                  myAlertError(error);
                });
            }
          }
        });
    },
    [actionType, cashRegister, dispatch, myAlertSuccess, myAlertError, myAlert]
  );

  const cancel = () => {
    myAlert
      .fire({
        title: `Cancelar accion`,
        text: `Estas seguro que deseas cancelar esta accion?`,
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

  if (!cashRegister) return null;

  const isOpenMode = actionType === 'open';
  const fieldName = isOpenMode ? 'montoApertura' : 'montoCierre';
  const fieldError = isOpenMode ? (errors as any).montoApertura : (errors as any).montoCierre;

  return (
    <>
      <Modal isOpen={isOpen} onClose={closeModal} className="mx-4 md:mx-auto max-w-[700px]">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-black dark:text-gray-200">
              {isOpenMode ? 'Abrir Caja' : 'Cerrar Caja'}
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-200 lg:mb-7"></p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
            <div className="custom-scrollbar h-fit overflow-y-auto px-2">
              <div className="">
                <h5 className="text-lg font-medium text-black dark:text-gray-200">
                  Caja #{cashRegister.codigo}
                </h5>
                <div className="flex flex-col md:grid md:grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div>
                    <Label htmlFor={isOpenMode ? 'montoApertura' : 'montoCierre'}>
                      {isOpenMode ? 'Monto Apertura' : 'Monto Cierre'}
                    </Label>
                    <Input
                      id={isOpenMode ? 'montoApertura' : 'montoCierre'}
                      type="number"
                      placeholder="RD$ .00"
                      min={0}
                      {...register(fieldName as any, {
                        required: 'Este campo es obligatorio.',
                        valueAsNumber: true,
                        min: 0,
                      })}
                    />
                    {fieldError && <div className="text-sm text-red-500">{fieldError}</div>}
                  </div>
                </div>
              </div>
            </div>

            {error && <div className="text-sm text-red-500">Error: {error}</div>}
            <div className="flex flex-wrap items-center gap-3 px-2 mt-4 justify-center md:justify-end">
              <Button type="submit" size="sm" variant="primary" startIcon={<BiSave size={20} />}>
                {isOpenMode ? 'Abrir' : 'Cerrar'}
              </Button>
              <Button size="sm" variant="outline" startIcon={<BiX size={20} />} onClick={cancel}>
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
};
