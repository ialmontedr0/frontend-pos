import React, { useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import type { RootState } from '../../../store/store';
import { useAppSelector, useAppDispatch } from '../../../hooks/hooks';
import {
  clearSelectedProduct,
  updateProduct,
  deleteProduct,
  getProductByCode,
} from '../slices/productsSlice';
import type { UpdateProductDTO } from '../dtos/update-product.dto';

import Button from '../../../components/UI/Button/Button';
import Input from '../../../components/UI/Input/Input';
import { Label } from '../../../components/UI/Label/Label';
import { SearchSelect } from '../../../components/SearchSelect/SearchSelect';
import { Textarea } from '../../../components/UI/TextArea/TextArea';
import { ToggleSwitch } from '../../../components/UI/ToggleSwitch/ToggleSwitch';
import { BiSave, BiTrash, BiX } from 'react-icons/bi';
import PageMeta from '../../../components/common/PageMeta';
import { myAlertError, myAlertSuccess } from '../../../utils/commonFunctions';
import { NotFound } from '../../../pages/NotFound';

export const EditProduct: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const myAlert = withReactContent(Swal);
  const { codigo } = useParams<{ codigo: string }>();

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

              navigate('/products');
            })
            .catch((error: any) => {
              myAlertError(`Error`, `Error: ${error.response?.data?.message || error.message}`);
            });
        }
      });
  };

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
                myAlertError(`Error`, `Error: ${error.response?.data?.message || error.message}`);
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
          navigate('/products');
        }
      });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500 dark:text-gray-400">Cargando datos del producto...</p>
      </div>
    );
  }

  if (!product) {
    return <NotFound node="Producto" />;
  }

  return (
    <>
      <PageMeta title="Editar Producto - PoS v2" description="Editar producto" />

      <div className="h-full h-screen max-h-auto">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-4xl mx-2 md:mx-auto my-6 p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md space-y-6 text-black dark:text-gray-200"
        >
          {/** Header del componente */}
          <div className="space-y-4">
            <h2 className="text-3xl font-regular">Editar producto</h2>
          </div>

          {/** Cuerpo del componente */}
          <div className="flex flex-col md:flex-row">
            {/** Imagen */}
            <div className="flex-shrink-0 rounded-full">
              <img src={product.foto} className="w-64 h-auto rounded-full" alt="" />
            </div>

            {/** Campos a editar */}
            <div className="lg:grid lg:grid-cols-2 space-x-4">
              <div className="">
                <Label className="" htmlFor="nombre">
                  Nombre
                </Label>
                <Input
                  id="nombre"
                  {...register('nombre', { required: 'El campo nombre es obligatorio.' })}
                />
                {errors.nombre && <p className="text-sm text-red-500">{errors.nombre.message}</p>}
              </div>

              {/** Categoria (Busqueda) */}
              <div>
                <Label className="" htmlFor="categoria">
                  Categoria
                </Label>
                <Controller
                  name="categoria"
                  control={control}
                  rules={{ required: 'El campo categoria es obligatorio ' }}
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
                  <p className="text-sm text-red-500">{errors.categoria.message}</p>
                )}
              </div>

              <div className="">
                <Label className="" htmlFor="proveedor">
                  Proveedor
                </Label>
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
                  <p className="text-sm text-red-500">{errors.proveedor.message}</p>
                )}
              </div>

              <div className="">
                <Label className="" htmlFor="descripcion">
                  Descripcion
                </Label>
                <Textarea id="descripcion" {...register('descripcion')} />
                {errors.descripcion && (
                  <p className="text-sm text-red-500">{errors.descripcion.message}</p>
                )}
              </div>

              <div className="">
                <Label className="" htmlFor="stock">
                  Stock
                </Label>
                <Input
                  id="stock"
                  {...register('stock', {
                    required: 'El campo stock es obligatorio.',
                    valueAsNumber: true,
                    min: 0,
                  })}
                />
                {errors.stock && <p className="text-sm text-red-500">{errors.stock.message}</p>}
              </div>

              <div className="">
                <Label className="" htmlFor="precioCompra">
                  Precio Compra
                </Label>
                <Input
                  id="precioCompra"
                  {...register('precioCompra', {
                    required: 'El campo Precio Compra es obligatorio.',
                    valueAsNumber: true,
                    min: 0,
                  })}
                />
                {errors.precioCompra && (
                  <p className="text-sm text-red-500">{errors.precioCompra.message}</p>
                )}
              </div>

              <div className="">
                <Label className="" htmlFor="precioVenta">
                  Precio Venta
                </Label>
                <Input
                  id="precioVenta"
                  {...register('precioVenta', {
                    required: 'El campo Precio Venta es obligatorio.',
                    valueAsNumber: true,
                    min: 0,
                  })}
                />
                {errors.precioVenta && (
                  <p className="text-sm text-red-500">{errors.precioVenta.message}</p>
                )}
              </div>

              <div className="">
                <Label className="" htmlFor="ITBIS">
                  ITBIS
                </Label>
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
                      offLabel="No Aplica"
                      onLabel="Aplica"
                      className="mt-1"
                    />
                  )}
                />
                {errors.itbis && <p className="text-sm text-red-500">{errors.itbis.message}</p>}
              </div>

              <div className="">
                <Label className="" htmlFor="foto">
                  Foto
                </Label>
                <Input id="foto" {...register('foto')} />
                {errors.foto && <p className="text-sm text-red-500">{errors.foto.message}</p>}
              </div>

              {error && <p>Error: {error}</p>}
            </div>
          </div>

          {/** Botones del componente */}
          <div className="flex gap-2 justify-end p-2">
            <Button size="sm" variant="primary" type="submit" startIcon={<BiSave size={20} />}>
              Guardar
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onDelProduct(product._id)}
              startIcon={<BiTrash size={20} />}
            >
              Eliminar
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => cancel()}
              startIcon={<BiX size={20} />}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};
