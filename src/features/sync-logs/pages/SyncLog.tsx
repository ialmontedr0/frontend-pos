import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import moment from 'moment/min/moment-with-locales';

import type { RootState } from '../../../store/store';
import { useAppDispatch } from '../../../hooks/hooks';

import type { SyncLog as SyncLogInterface } from '../interfaces/SyncLogInterface';
import { Label } from '../../../components/UI/Label/Label';
import Button from '../../../components/UI/Button/Button';
import PageMeta from '../../../components/common/PageMeta';
import { BiArrowBack, BiTrash } from 'react-icons/bi';
import Spinner from '../../../components/UI/Spinner/Spinner';
import { NotFound } from '../../../pages/NotFound';
import PageBreadcrum from '../../../components/common/PageBreadCrumb';
import { FileIcon } from '../../../assets/icons';

export const SyncLog: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const myAlert = withReactContent(Swal);

  const { syncLogId } = useParams<{ syncLogId: string }>();
  const loading: boolean = false;
  const error: string | null = null;

  const syncLog: SyncLogInterface = {
    _id: '1',
    acciones: {},
    clienteTempId: '1',
    resuelto: false,
    createdBy: { _id: '1', usuario: 'test' },
    resolvedBy: { _id: '1', usuario: 'test' },
    createdAt: '2025-07-05T17:54:29.724Z',
  };

  const resolveSyncLog = useCallback((syncLogId: string) => {
    myAlert
      .fire({
        title: `Resolver Sync Log`,
        text: `Estas seguro que deseas resolver este Sync Log?`,
        icon: 'question',
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: 'Resolver',
        cancelButtonText: 'Cancelar',
      })
      .then((result) => {
        if (result.isConfirmed) {
          alert(`Sync log ${syncLogId} se ha resuelto.`);
        }
      });
  }, []);

  const onDelSyncLog = (syncLogId: string) => {
    myAlert
      .fire({
        title: 'Eliminar Sync Log',
        text: 'Estas seguro que deseas eliminar este Sync Log?',
        icon: 'question',
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar',
      })
      .then((result) => {
        if (result.isConfirmed) {
          alert(`Sync Log ${syncLogId} Eliminado`);
        }
      });
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!error && loading) {
    return <Spinner />;
  }

  if (!error && !loading && !syncLog) {
    return <NotFound node="Sync Log" />;
  }

  return (
    <>
      <PageMeta title="Sync Log - PoS v2" description="Sync Log" />
      <PageBreadcrum pageTitle="Sync Log" />
      <div className="h-auto m-2 md:mx-auto rounded-xl bg-white dark:bg-gray-900 text-black dark:text-gray-200 p-4 space-y-6">
        <div>
          <h2 className="text-2xl font-regular md:text-3xl">Sync Log</h2>
        </div>

        {/** Sync log cuerpo */}
        <div className="space-y-2 grid grid-cols-2">
          <div>
            <Label htmlFor="cliente">Cliente</Label>
            <p>{syncLog.clienteTempId}</p>
          </div>

          <div>
            <Label>Estado</Label>
            {syncLog.resuelto === true ? 'Resuelto' : 'Sin Resolver'}
          </div>

          {syncLog.resolvedBy && (
            <div>
              <Label>Resuelto por</Label>
              <p>{syncLog.resolvedBy.usuario}</p>
            </div>
          )}

          <div>
            <Label>Creado por</Label>
            <p>{syncLog.createdBy.usuario}</p>
          </div>

          <div>
            <Label>Fecha</Label>
            <p>{moment(syncLog.createdAt).format('LLLL')}</p>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap justify-center md:justify-end my-4">
          <Button
            onClick={() => navigate('/sync-logs')}
            size="sm"
            variant="outline"
            startIcon={<BiArrowBack size={24} />}
          >
            Volver
          </Button>
          <Button
            onClick={() => onDelSyncLog(syncLog._id)}
            size="sm"
            variant="destructive"
            startIcon={<BiTrash size={24} />}
          >
            Eliminar
          </Button>
          {syncLog.resuelto !== true ? (
            <Button
              onClick={() => resolveSyncLog(syncLog._id)}
              size="sm"
              variant="primary"
              startIcon={<FileIcon />}
            >
              Resolver
            </Button>
          ) : (
            ''
          )}
        </div>
      </div>
    </>
  );
};
