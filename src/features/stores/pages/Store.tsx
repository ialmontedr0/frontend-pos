import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import moment from 'moment/min/moment-with-locales';

import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import type { RootState } from '../../../store/store';

import { BiArrowBack, BiEdit } from 'react-icons/bi';
import PageMeta from '../../../components/common/PageMeta';
import Button from '../../../components/UI/Button/Button';
import { Label } from '../../../components/UI/Label/Label';
import { NotFound } from '../../../pages/NotFound';
import { getStoreByCode } from '../slices/storesSlice';
import Spinner from '../../../components/UI/Spinner/Spinner';
import { EditStore } from '../components/EditStore';
import { useModal } from '../../../hooks/useModal';

export const Store: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { codigo } = useParams<{ codigo: string }>();
  const { isOpen, openModal, closeModal } = useModal();
  moment.locale('es');

  const { store, loading, error } = useAppSelector((state: RootState) => state.stores);

  useEffect(() => {
    if (codigo) {
      dispatch(getStoreByCode(codigo));
    }
  }, [dispatch]);

  const goBack = () => {
    navigate(-1);
  };

  const oneditBranche = () => {
    openModal();
  };

  if (!store) {
    return <NotFound node="Sucursal" />;
  }

  if (loading && !error) return <Spinner />;

  return (
    <>
      <PageMeta title="Sucursal - PoS v2" description="Sucursal" />
      <div className="space-y-6 p-4 text-black dark:text-gray-200">
        <div className="space-y-4">
          <div className="my-2">
            <h2 className="text-2xl md:text-3xl font-medium">Sucursal {store.nombre}</h2>
          </div>

          <div className="space-y-2 grid grid-cols-2 space-x-3">
            <div>
              <Label htmlFor="nombre">Nombre</Label>
              <p>{store.nombre}</p>
            </div>

            <div>
              <Label htmlFor="codigo">Codigo</Label>
              <p>{store.codigo}</p>
            </div>

            <div>
              <Label>Direccion</Label>
              <p>
                <strong>Calle: </strong>
                {store.direccion.calle}
              </p>

              <p>
                <strong>Numero: </strong>
                {store.direccion.numero || '#'}
              </p>
              <p>
                <strong>Ciudad: </strong>
                {store.direccion.ciudad}
              </p>
            </div>

            <div>
              <Label htmlFor="telefono">Telefono</Label>
              <p>{store.telefono}</p>
            </div>

            <div>
              <Label htmlFor="createdBy">Creada Por</Label>
              <p>{store.createdBy.usuario}</p>
            </div>

            <div>
              <Label htmlFor="createdAt">Fecha Creacion</Label>
              <p>{moment(store.createdAt).format('LLLL')}</p>
            </div>

            {store.updatedBy && (
              <div>
                <Label htmlFor="updatedBy">Actualizado Por</Label>
                <p>{store.updatedBy.usuario}</p>
              </div>
            )}
            {store.updatedAt && (
              <div>
                <Label htmlFor="updatedAt">Fecha Actualizacion</Label>
                <p>{moment(store.updatedAt).format('LLLL')}</p>
              </div>
            )}
          </div>

          <div className="flex flex-wrap justify-center md:justify-end gap-2">
            <Button size="sm" variant="outline" startIcon={<BiArrowBack />} onClick={goBack}>
              Volver
            </Button>
            <Button
              size="sm"
              variant="primary"
              startIcon={<BiEdit />}
              onClick={() => oneditBranche()}
            >
              Editar
            </Button>
          </div>
        </div>
      </div>
      <EditStore store={store} isOpen={isOpen} closeModal={closeModal} error={error!} />
    </>
  );
};
