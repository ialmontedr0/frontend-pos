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
import { getBrancheById } from '../slices/branchesSlice';
import Spinner from '../../../components/UI/Spinner/Spinner';
import { EditBranche } from '../components/EditBranche';
import { useModal } from '../../../hooks/useModal';

export const Branche: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { brancheId } = useParams<{ brancheId: string }>();
  const { isOpen, openModal, closeModal } = useModal();
  moment.locale('es');

  const { branche, loading, error } = useAppSelector((state: RootState) => state.branches);

  useEffect(() => {
    if (brancheId) {
      dispatch(getBrancheById(brancheId));
    }
  }, [dispatch]);

  const goBack = () => {
    navigate(-1);
  };

  const oneditBranche = () => {
    openModal()
  }

  if (!branche) {
    return <NotFound node="Sucursal" />;
  }

  if (loading && !error) return <Spinner />;

  return (
    <>
      <PageMeta title="Sucursal - PoS v2" description="Sucursal" />
      <div className="space-y-6 p-4 text-black dark:text-gray-200">
        <div className="space-y-4">
          <div className="my-2">
            <h2 className="text-2xl md:text-3xl font-medium">
              Sucursal {branche.nombre}
            </h2>
          </div>

          <div className="space-y-2 grid grid-cols-2 space-x-3">
            <div>
              <Label htmlFor="nombre">Nombre</Label>
              <p>{branche.nombre}</p>
            </div>

            <div>
              <Label>Direccion</Label>
              <p>
                <strong>Calle: </strong>
                {branche.direccion.calle}
              </p>
              <p>
                <strong>Ciudad: </strong>
                {branche.direccion.ciudad}
              </p>
            </div>

            <div>
              <Label htmlFor="telefono">Telefono</Label>
              <p>{branche.telefono}</p>
            </div>

            <div>
              <Label htmlFor="createdBy">Creada Por</Label>
              <p>{branche.createdBy.usuario}</p>
            </div>

            <div>
              <Label htmlFor="createdAt">Fecha Creacion</Label>
              <p>{moment(branche.createdAt).format('LLLL')}</p>
            </div>

            {branche.updatedBy && (
              <div>
                <Label htmlFor="updatedBy">Actualizado Por</Label>
                <p>{branche.updatedBy.usuario}</p>
              </div>
            )}
            {branche.updatedAt && (
              <div>
                <Label htmlFor="updatedAt">Fecha Actualizacion</Label>
                <p>{moment(branche.updatedAt).format('LLLL')}</p>
              </div>
            )}
          </div>

          <div className="flex flex-wrap justify-center md:justify-end gap-2">
            <Button size="sm" variant="outline" startIcon={<BiArrowBack />} onClick={goBack}>
              Volver
            </Button>
            <Button size="sm" variant="primary" startIcon={<BiEdit />} onClick={() => oneditBranche()}>
              Editar
            </Button>
          </div>
        </div>
      </div>
      <EditBranche branche={branche} isOpen={isOpen} closeModal={closeModal} error={error!}/>
    </>
  );
};
