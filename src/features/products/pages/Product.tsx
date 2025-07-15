import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';

import moment from 'moment/min/moment-with-locales';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import type { RootState } from '../../../store/store';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import {
  deleteProduct,
  updateProduct,
  clearSelectedProduct,
  getProductByCode,
} from '../slices/productsSlice';

import Spinner from '../../../components/UI/Spinner/Spinner';
import { myAlertError, myAlertSuccess } from '../../../utils/commonFunctions';
import Badge from '../../../components/UI/Badge/Badge';
import Button from '../../../components/UI/Button/Button';
import { BiArrowBack, BiEdit, BiSave, BiSolidBox, BiTrash, BiX } from 'react-icons/bi';
import PageMeta from '../../../components/common/PageMeta';
import { Label } from '../../../components/UI/Label/Label';
import { NotFound } from '../../../pages/NotFound';
import { updateProductStock } from '../inventory/slices/inventorySlice';
import { Modal } from '../../../components/UI/Modal/Modal';
import { Error } from '../../../components/Error/components/Error';
import { useModal } from '../../../hooks/useModal';
import Input from '../../../components/UI/Input/Input';
import type { UpdateProductDTO } from '../dtos/update-product.dto';
import { SearchSelect } from '../../../components/SearchSelect/SearchSelect';
import { ToggleSwitch } from '../../../components/UI/ToggleSwitch/ToggleSwitch';

export function Product() {
  let newStock: number = 0;
  const { codigo } = useParams<{ codigo: string }>();
  const { isOpen, openModal, closeModal } = useModal();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const myAlert = withReactContent(Swal);
  moment.locale('es');

  const [selectedCategoryName, setSelectedCategoryName] = useState<string>('');
  const [selectedProviderName, setSelectedProviderName] = useState<string>('');

  const { categories } = useAppSelector((state: RootState) => state.categories);
  const { providers } = useAppSelector((state: RootState) => state.providers);

  const { product, loading, error } = useAppSelector((state: RootState) => state.products);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<UpdateProductDTO>({
    defaultValues: {
      nombre: '',
      categoria: '',
      descripcion: '',
      stock: 0,
      precioCompra: 0,
      precioVenta: 0,
      itbis: true,
      proveedor: '',
      foto: '',
    },
  });

  useEffect(() => {
    if (product) {
      const catId =
        (typeof product.categoria === 'object' ? product.categoria._id : product.categoria) || '';

      const provId =
        (typeof product.proveedor === 'object' ? product.proveedor._id : product.proveedor) || '';

      reset({
        nombre: product.nombre,
        categoria: catId,
        descripcion: product.descripcion,
        stock: product.stock,
        precioVenta: product.precioVenta,
        precioCompra: product.precioCompra,
        itbis: product.itbis ?? false,
        proveedor: provId,
        foto: product.foto,
      });

      setSelectedCategoryName(
        typeof product.categoria === 'object'
          ? product.categoria.nombre
          : categories.find((c) => c._id === catId)?.nombre || ''
      );

      setSelectedProviderName(
        typeof product.proveedor === 'object'
          ? product.proveedor.nombre
          : providers.find((p) => p._id === provId)?.nombre || ''
      );
    }
  }, [product, categories, providers, reset]);

  useEffect(() => {
    if (!codigo) return;

    dispatch(getProductByCode(codigo));
    return () => {
      dispatch(clearSelectedProduct());
    };
  }, [dispatch, codigo, navigate]);

  const onSubmit = (updateProductDTO: UpdateProductDTO) => {
    myAlert
      .fire({
        title: `Actualizar producto!`,
        text: `Estas seguro que deseas actualizar este producto?`,
        icon: 'question',
        showConfirmButton: true,
        confirmButtonText: 'Si, guardar',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
      })
      .then((result) => {
        if (result.isConfirmed) {
          dispatch(updateProduct({ productId: product!._id, updateProductDTO }))
            .unwrap()
            .then(() => {
              myAlertSuccess(
                `Producto actualizado`,
                `Se ha actualizado el producto exitomsamente.`
              );
              closeModal();
              navigate('/products');
            })
            .catch((error: any) => {
              myAlertError(`Error: ${error}`);
            });
        }
      });
  };

  const handleUpdateStock = useCallback((productId: string) => {
    if (!product) return;

    myAlert
      .fire({
        title: 'Actualizar Stock',
        text: `Ingresa la cantidad nueva del Stock del producto.`,
        iconHtml: <BiSolidBox />,
        html: `<div><strong>Stock actual: </strong> ${product.stock}</div>`,
        customClass: {
          icon: 'no-default-icon-border',
        },
        input: 'number',
        inputValue: newStock,
        inputPlaceholder: `Stock`,
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: 'Actualizar',
        cancelButtonText: 'Cancelar',
      })
      .then((result) => {
        if (result.isConfirmed) {
          newStock = Number(result.value);
          dispatch(
            updateProductStock({
              productId: productId,
              updateProductStockDTO: {
                stock: newStock,
              },
            })
          )
            .unwrap()
            .then(() => {
              dispatch(getProductByCode(codigo!));
              myAlertSuccess(`Stock Actualizado`, `Se ha actualizado el producto exitosamente.`);
            })
            .catch((error: any) => {
              myAlertError(`Error: ${error}`);
            });
        }
      });
  }, []);

  const onDelProduct = useCallback(
    (productId: string) => {
      myAlert
        .fire({
          title: 'Eliminar producto',
          text: `Estas seguro que deseas eliminar este producto?`,
          icon: 'question',
          showConfirmButton: true,
          confirmButtonText: 'Si, eliminar',
          showCancelButton: true,
          cancelButtonText: 'Cancelar',
        })
        .then((result) => {
          if (result.isConfirmed) {
            dispatch(deleteProduct(productId))
              .unwrap()
              .then(() => {
                myAlertSuccess(`Producto eliminado`, `Se ha eliminado el producto exitomsamente.`);
                navigate('/product');
              })
              .catch((error: any) => {
                myAlertError(`Error: ${error}`);
              });
          }
        });
    },
    [dispatch, navigate, myAlert]
  );

  const cancel = () => {
    myAlert
      .fire({
        title: 'Cancelar edicion!',
        text: 'Estas seguro que deseas cancelar la edicion del prodcuto?',
        icon: 'question',
        showConfirmButton: true,
        showCancelButton: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          closeModal();
        }
      });
  };

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <Error message="" />;
  }

  if (!product) {
    return <NotFound node="Producto" />;
  }

  return (
    <>
      <PageMeta title="Producto - PoS v2" description="Producto" />
      <div className="p-6 m-2 space-y-4 text-black dark:text-gray-200 bg-gray-100 dark:bg-gray-900 rounded-xl shadow">
        <div className="space-y-4">
          <div className="">
            <h2 className="text-2xl md:text-3xl font-regular">{product.nombre}</h2>
          </div>
          <div className="w-fit mr-4">
            <img src={product.foto} className="bg-none w-64 h-62 rounded-full" alt="" />
          </div>

          <div className="grid grid-cols-2 space-y-2">
            <div>
              <Label htmlFor="codigo">Codigo</Label>
              <p>{product.codigo}</p>
            </div>

            <div>
              <Label>Categoria</Label>
              <p>{product.categoria.nombre}</p>
            </div>

            {product.descripcion && (
              <div>
                <Label>Descripcion</Label>
                <p>{product.descripcion}</p>
              </div>
            )}

            <div>
              <Label>Proveedor</Label>
              <p>{product.proveedor.nombre}</p>
            </div>

            <div>
              <Label>Precio compra</Label>
              <p>RD$ {product.precioCompra.toFixed(2)}</p>
            </div>

            <div>
              <Label>Precio venta</Label>
              <p>RD$ {product.precioVenta.toFixed(2)}</p>
            </div>

            <div>
              <Label>ITBIS</Label>
              <p>
                {product.itbis === true ? (
                  <Badge color="success">Aplica</Badge>
                ) : (
                  <Badge color="error">No Aplica</Badge>
                )}
              </p>
            </div>

            <div>
              <Label htmlFor="">Estado</Label>
              <p>
                {product.disponible === true ? (
                  <Badge color="success">Disponible</Badge>
                ) : (
                  <Badge color="error">No disponible</Badge>
                )}
              </p>
            </div>

            <div>
              <Label htmlFor="">Unidades Vendidas</Label>
              <p>{product.soldCount}</p>
            </div>

            <div>
              <Label>Stock Disponible</Label>
              <p>{product.stock}</p>
            </div>

            <div>
              <Label>Creador</Label>
              <p>{product.createdBy?.usuario}</p>
            </div>

            <div>
              <Label>Fecha Creacion</Label>
              <p>{moment(product.createdAt).format('LLLL')}</p>
            </div>

            {product.updatedAt && (
              <div>
                <Label>Fecha Actualizacion</Label>
                <p>{moment(product.updatedAt).format('LLLL')}</p>
              </div>
            )}

            {product.updatedBy && (
              <div>
                <Label>Actualizado por</Label>
                <p>{product.updatedBy.usuario}</p>
              </div>
            )}
          </div>

          <div className="flex flex-wrap justify-center md:justify-end gap-2">
            <Button
              onClick={() => navigate('/products')}
              size="sm"
              variant="outline"
              startIcon={<BiArrowBack size={20} />}
            >
              Volver
            </Button>
            <Button
              onClick={openModal}
              size="sm"
              variant="primary"
              startIcon={<BiEdit size={20} />}
            >
              Editar
            </Button>
            {product.stock <= 5 && (
              <Button
                size="sm"
                variant="primary"
                startIcon={<BiSolidBox />}
                onClick={() => handleUpdateStock(product._id)}
              >
                Actualizar Stock
              </Button>
            )}
          </div>
        </div>

        <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] mx-4 md:mx-auto">
          <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
            <div className="px-2 pr-14">
              <h4 className="mb-2 text-2xl font-semibold text-black dark:text-gray-200">
                Editar Producto
              </h4>
              <p className="mb-6 text-sm text-gray-500 dark:text-gray-200 lg:mb-7">
                Actualiza los datos del producto
              </p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
              <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
                <div className="mt-7">
                  <h5 className="text-lg mb-5 font-medium text-black dark:text-gray-200 lg:mb-6">
                    {product.nombre}
                  </h5>
                  <div className="flex flex-col md:grid md:grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                    <div className="col-span-2 lg:col-span-1">
                      <Label htmlFor="nombre">Nombre</Label>
                      <Input
                        id="nombre"
                        {...register('nombre', { required: 'El campo nombre es obligatorio.' })}
                        placeholder={product.nombre}
                      />
                      {errors.nombre && (
                        <div className="text-sm text-red-500">{errors.nombre.message}</div>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="categoria">Categoria</Label>
                      <Controller
                        name="categoria"
                        control={control}
                        rules={{ required: 'El campo categoria es obligatorio.' }}
                        render={({ field }) => (
                          <SearchSelect
                            options={categories}
                            initialDisplayValue={selectedCategoryName}
                            fieldValue={field.value}
                            placeholder="Buscar categoria..."
                            name={field.name}
                            onFieldChange={field.onChange}
                            onFieldBlur={field.onBlur}
                            onSelect={(id: string) => {
                              field.onChange(id);
                              const found = categories.find((c) => c._id === id);
                              setSelectedCategoryName(found?.nombre || '');
                            }}
                          />
                        )}
                      />
                      {errors.categoria && (
                        <div className="text-sm text-red-500">{errors.categoria.message}</div>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="descripcion">Descripcion</Label>
                      <Input
                        id="descripcion"
                        placeholder={product.descripcion}
                        {...register('descripcion')}
                      />
                      {errors.descripcion && (
                        <div className="text-sm text-red-500">{errors.descripcion.message}</div>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="stock">Stock</Label>
                      <Input
                        type="number"
                        id="stock"
                        {...register('stock', {
                          required: 'El campo stock es obligatorio',
                          valueAsNumber: true,
                          min: 0,
                        })}
                      />
                      {errors.stock && (
                        <div className="text-sm text-red-500">{errors.stock.message}</div>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="precioCompra">Precio Compra</Label>
                      <Input
                        type="number"
                        id="precioCompra"
                        {...register('precioCompra', {
                          required: 'El campo precio compra es obligatorio',
                          valueAsNumber: true,
                          min: 0,
                        })}
                      />
                      {errors.precioCompra && (
                        <div className="text-sm text-red-500">{errors.precioCompra.message}</div>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="precioVenta">Precio Venta</Label>
                      <Input
                        type="number"
                        id="precioVenta"
                        {...register('precioVenta', {
                          required: 'El campo precio venta es obligatorio',
                          valueAsNumber: true,
                          min: 0,
                        })}
                      />
                      {errors.precioVenta && (
                        <div className="text-sm text-red-500">{errors.precioVenta.message}</div>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="proveedor">Proveedor</Label>
                      <Controller
                        name="proveedor"
                        control={control}
                        rules={{ required: 'El campo proveedor es obligatorio.' }}
                        render={({ field }) => (
                          <SearchSelect
                            options={providers}
                            initialDisplayValue={selectedProviderName}
                            fieldValue={field.value}
                            placeholder="Buscar proveedor..."
                            name={field.name}
                            onFieldChange={field.onChange}
                            onFieldBlur={field.onBlur}
                            onSelect={(id: string) => {
                              field.onChange(id);
                              const found = providers.find((p) => p._id === id);
                              setSelectedProviderName(found?.nombre || '');
                            }}
                          />
                        )}
                      />
                      {errors.proveedor && (
                        <div className="text-sm text-red-500">{errors.proveedor.message}</div>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="itbis">ITBIS</Label>
                      <Controller
                        name="itbis"
                        control={control}
                        rules={{
                          validate: {
                            isBoolean: (v) => v === true || v === false,
                          },
                        }}
                        render={({ field }) => (
                          <ToggleSwitch<boolean>
                            value={field.value ?? false}
                            offValue={false}
                            onValue={true}
                            onToggle={(v) => field.onChange(v)}
                            offLabel="No"
                            onLabel="Si"
                            className="mt-1"
                          />
                        )}
                      />
                      {errors.itbis && (
                        <div className="text-sm text-red-500">{errors.itbis.message}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3 px-2 mt-6 justify-center md:justify-end">
                <Button type="submit" size="sm" variant="primary" startIcon={<BiSave />}>
                  Guardar Cambios
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  startIcon={<BiTrash />}
                  onClick={() => onDelProduct(product._id)}
                >
                  Eliminar
                </Button>
                <Button size="sm" variant="outline" startIcon={<BiX />} onClick={cancel}>
                  Cancelar
                </Button>
              </div>
            </form>
          </div>
        </Modal>
      </div>
    </>
  );
}
