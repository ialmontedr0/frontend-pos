import { useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import moment from 'moment/min/moment-with-locales';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import type { RootState } from '../../../store/store';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import {
  clearSelectedProduct,
  getProductByCode,
} from '../slices/productsSlice';

import Spinner from '../../../components/UI/Spinner/Spinner';
import { myAlertError, myAlertSuccess } from '../../../utils/commonFunctions';
import Badge from '../../../components/UI/Badge/Badge';
import Button from '../../../components/UI/Button/Button';
import { BiArrowBack, BiEdit, BiSolidBox } from 'react-icons/bi';
import PageMeta from '../../../components/common/PageMeta';
import { Label } from '../../../components/UI/Label/Label';
import { NotFound } from '../../../pages/NotFound';
import { updateProductStock } from '../inventory/slices/inventorySlice';
import { Error } from '../../../components/Error/components/Error';
import { useModal } from '../../../hooks/useModal';
import type { UpdateProductDTO } from '../dtos/update-product.dto';
import { EditProduct } from '../components/EditProduct';

export function Product() {
  let newStock: number = 0;
  const { codigo } = useParams<{ codigo: string }>();
  const { isOpen, openModal, closeModal } = useModal();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const myAlert = withReactContent(Swal);
  moment.locale('es');

  const { categories } = useAppSelector((state: RootState) => state.categories);
  const { providers } = useAppSelector((state: RootState) => state.providers);

  const { product, loading, error } = useAppSelector((state: RootState) => state.products);

  const {
    reset,
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
    }
  }, [product, categories, providers, reset]);

  useEffect(() => {
    if (!codigo) return;

    dispatch(getProductByCode(codigo));
    return () => {
      dispatch(clearSelectedProduct());
    };
  }, [dispatch, codigo, navigate]);

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

        <EditProduct product={product} isOpen={isOpen} closeModal={closeModal} error={error!} />
      </div>
    </>
  );
}
