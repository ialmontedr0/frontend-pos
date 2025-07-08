import { useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import moment from 'moment/min/moment-with-locales';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import type { RootState } from '../../../store/store';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import { deleteProduct, clearSelectedProduct, getProductByCode } from '../slices/productsSlice';

import Spinner from '../../../components/UI/Spinner/Spinner';
import { myAlertError, myAlertSuccess } from '../../../utils/commonFunctions';
import Badge from '../../../components/UI/Badge/Badge';
import Button from '../../../components/UI/Button/Button';
import { BiArrowBack, BiEdit, BiSolidBox, BiTrash } from 'react-icons/bi';
import PageMeta from '../../../components/common/PageMeta';
import { Label } from '../../../components/UI/Label/Label';
import { NotFound } from '../../../pages/NotFound';
import { updateProductStock } from '../inventory/slices/inventorySlice';

export function Product() {
  let newStock: number = 0;
  const { codigo } = useParams<{ codigo: string }>();

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const myAlert = withReactContent(Swal);
  moment.locale('es');

  const { product, loading, error } = useAppSelector((state: RootState) => state.products);

  useEffect(() => {
    if (!codigo) {
      navigate('/products');
      return;
    }
    dispatch(getProductByCode(codigo));
    return () => {
      dispatch(clearSelectedProduct());
    };
  }, [dispatch, codigo, navigate]);

  const handleUpdateStock = () => {
    if (!product) return;

    myAlert
      .fire({
        title: 'Actualizar Stock',
        text: `Ingresa la cantidad nueva del Stock del producto.`,
        iconHtml: <BiSolidBox />,
        customClass: {
          icon: 'no-default-icon-border',
        },
        input: 'number',
        inputValue: newStock,
        inputPlaceholder: 'Stock',
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
              productId: product._id,
              updateProductStockDTO: {
                stock: newStock,
              },
            })
          )
            .unwrap()
            .then(() => {
              myAlertSuccess(
                'Stock actualizado',
                'Se ha actualizado el stock del producto con exito'
              );
            })
            .catch((error: string) => {
              myAlertError(`Error`, `Error: ${error}`);
            });
        }
      });
  };

  const handleDeleteProduct = useCallback(
    (productId: string) => {
      myAlert
        .fire({
          title: 'Eliminar producto',
          text: `Estas seguro que deseas eliminar este producto?`,
          icon: 'question',
          showConfirmButton: true,
          showCancelButton: true,
          confirmButtonText: 'Si, eliminar!',
          cancelButtonText: 'Cancelar',
        })
        .then((result) => {
          if (result.isConfirmed) {
            dispatch(deleteProduct(productId))
              .unwrap()
              .then(() => {
                myAlertSuccess(`Producto eliminado`, `Se ha eliminado el producto exitosamente`);
                navigate('/products');
              })
              .catch((error: any) => {
                myAlertError(`Error`, `Error: ${error}`);
              });
          }
        });
    },
    [dispatch, navigate]
  );

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <div className="p-6 max-w-lg mx-auto bg-white dark:bg-gray-800 rounded-lg shadow">
        <p className="text-red-600 dark:text-red-400">Error: {error}</p>
        <button
          className="mt-4 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
          onClick={() => navigate('/products')}
        >
          Volver
        </button>
      </div>
    );
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
              onClick={() => navigate(`/products/edit/${product.codigo}`)}
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
                onClick={handleUpdateStock}
              >
                Actualizar Stock
              </Button>
            )}
            <Button
              onClick={() => handleDeleteProduct(product._id)}
              size="sm"
              variant="destructive"
              startIcon={<BiTrash size={20} />}
            >
              Eliminar
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
