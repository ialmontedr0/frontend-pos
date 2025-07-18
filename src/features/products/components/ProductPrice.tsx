import { useForm } from 'react-hook-form';
import Input from '../../../components/UI/Input/Input';
import { Label } from '../../../components/UI/Label/Label';
import { Modal } from '../../../components/UI/Modal/Modal';
import Button from '../../../components/UI/Button/Button';
import { BiMoney, BiSave, BiX } from 'react-icons/bi';
import type { Product } from '../interfaces/ProductInterface';
import { useAppDispatch } from '../../../hooks/hooks';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { useCallback, useEffect } from 'react';
import {
  getProductByCode,
  updateProductPriceBuy,
  updateProductPriceSale,
} from '../slices/productsSlice';
import { myAlertError, myAlertSuccess } from '../../../utils/commonFunctions';
import type { UpdateProductPriceBuyDTO } from '../dtos/update-product-price-buy.dto';
import type { UpdateProductPriceSaleDTO } from '../dtos/update-product-price-sale.dto';

type FormValues = UpdateProductPriceBuyDTO | UpdateProductPriceSaleDTO;

interface EditProductProps {
  product: Product;
  isOpen: boolean;
  closeModal: () => void;
  actionType: 'updateCost' | 'updateBuy';
  error?: string;
}

export const ProductPrice: React.FC<EditProductProps> = ({
  product,
  isOpen,
  closeModal,
  actionType = 'updateCost',
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
    if (!product) return;
    if (actionType === 'updateCost') {
      reset({ precioVenta: product.precioVenta ?? 0 });
    } else {
      reset({ precioCompra: product.precioCompra ?? 0 });
    }
  }, [product, actionType, reset]);

  useEffect(() => {
    if (!product) return;

    return () => {};
  }, [product]);

  const onSubmit = useCallback(
    (data: FormValues) => {
      const confirmTitle =
        actionType === 'updateCost' ? 'Actualizar Precio Compra' : 'Actualizar Precio Venta';
      const confirmText = `Deseas ${confirmTitle.toLowerCase()} del producto ${product.nombre}`;

      myAlert
        .fire({
          title: confirmTitle + ' de Producto!',
          text: confirmText,
          iconHtml: <BiMoney />,
          customClass: {
            icon: 'no-default-icon-border',
          },
          showConfirmButton: true,
          showCancelButton: true,
          confirmButtonText: 'Actualizar',
          cancelButtonText: 'Cancelar',
        })
        .then((result) => {
          if (result.isConfirmed && product) {
            if (actionType === 'updateCost') {
              dispatch(
                updateProductPriceBuy({
                  productId: product._id,
                  updateProductPriceBuyDTO: data as UpdateProductPriceBuyDTO,
                })
              )
                .unwrap()
                .then(() => {
                  closeModal();
                  myAlertSuccess(
                    `Precio Compra Actualizado`,
                    `Se ha actualizado el precio del producto exitosamente`
                  );
                  dispatch(getProductByCode(product.codigo));
                })
                .catch((error: any) => {
                  myAlertError(error);
                });
            } else {
              dispatch(
                updateProductPriceSale({
                  productId: product._id,
                  updateProductPriceSaleDTO: data as UpdateProductPriceSaleDTO,
                })
              )
                .unwrap()
                .then(() => {
                  closeModal();
                  myAlertSuccess(
                    `Precio Venta`,
                    `Se ha actualizado el precio del producto con exito.`
                  );
                  dispatch(getProductByCode(product.codigo));
                })
                .catch((error: any) => {
                  myAlertError(error);
                });
            }
          }
        });
    },
    [dispatch, product, actionType, myAlert, myAlertSuccess, myAlertError]
  );

  const cancel = () => {
    myAlert
      .fire({
        title: 'Cancelar',
        text: `Estas seguro que deseas cancelar la edicion del producto?`,
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

  if (!product) return null;

  const isOpenMode = actionType === 'updateCost';
  const fieldName = isOpenMode ? 'precioCompra' : 'precioVenta';
  const fieldError = isOpenMode ? (errors as any).precioCompra : (errors as any).precioVenta;

  return (
    <>
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] mx-4 md:mx-auto">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-black dark:text-gray-200">
              {isOpenMode ? 'Actualizar Precio Compra' : 'Actualizar Precio Venta'}
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-200 lg:mb-7"></p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
            <div className="custom-scrollbar h-[250px] overflow-y-auto px-2 pb-3">
              <div className="mt-7">
                <h5 className="text-lg mb-5 font-medium text-black dark:text-gray-200 lg:mb-6">
                  {product.nombre}
                </h5>
                <p className="mb-6 text-sm text-gray-500 dark:text-gray-200 lg:mb-7">
                  Precio {isOpenMode ? 'Compra actual' : 'Venta actual'}: RD${' '}
                  {isOpenMode ? product.precioCompra.toFixed(2) : product.precioVenta.toFixed(2)}
                </p>
                <div className="flex flex-col md:grid md:grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div className="col-span-2 lg:col-span-1">
                    <Label htmlFor={isOpenMode ? 'precioCompra' : 'precioVenta'}>
                      {isOpenMode ? 'Precio Compra' : 'Precio Venta'}
                    </Label>
                    <Input
                      id={isOpenMode ? 'precioCompra' : 'precioVenta'}
                      type="number"
                      min={0}
                      placeholder="RD$ .00"
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
            <div className="flex flex-wrap items-center gap-3 px-2 mt-6 justify-center md:justify-end">
              <Button type="submit" size="sm" variant="primary" startIcon={<BiSave />}>
                Guardar Cambios
              </Button>
              <Button size="sm" variant="outline" startIcon={<BiX />} onClick={cancel}>
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
};
