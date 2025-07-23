import React from 'react';
import type { User as UserInterface } from '../interfaces/UserInterface';

import Button from '../../../components/UI/Button/Button';
import { Modal } from '../../../components/UI/Modal/Modal';
import { BiX } from 'react-icons/bi';
import { Label } from '../../../components/UI/Label/Label';
import { parseTextSizeName } from '../../../utils/commonFunctions';

interface SettingsModalProps {
  user: UserInterface;
  isOpen: boolean;
  closeModal: () => void;
  error?: string;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  user,
  isOpen,
  closeModal,
  error,
}) => {
  const close = () => {
    closeModal();
  };

  if (!user) return;

  return (
    <>
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px]">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-black dark:text-gray-200">
              Configuracion
            </h4>
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-200">
              Configuracion de {user.nombre} {user.apellido}
            </p>
          </div>
          <div className="flex flex-col">
            <div className="custom-scrollbar h-[300px] overflow-y-auto px-2 pb-3">
              <div className="mt-2">
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div className="">
                    <Label htmlFor="tema">Tema</Label>
                    <p>
                      {user.configuracion.tema.charAt(0).toUpperCase() +
                        user.configuracion.tema.slice(1)}
                    </p>
                  </div>

                  <div>
                    <Label>Idioma</Label>
                    <p>{user.configuracion.idioma}</p>
                  </div>

                  <div>
                    <Label>Moneda</Label>
                    <p>{user.configuracion.moneda}</p>
                  </div>

                  <div>
                    <Label>Zona Horaria</Label>
                    <p>{user.configuracion.zonaHoraria}</p>
                  </div>

                  <div>
                    <Label>Tamano Texto</Label>
                    <p>{parseTextSizeName(user.configuracion.tamanoTexto)}</p>
                  </div>

                  <div>
                    <Label>Notificaciones</Label>
                    <p>{user.configuracion.notificaciones ? 'Si' : 'No'}</p>
                  </div>
                </div>
              </div>
            </div>

            {error && <div className="text-sm text-red-500">Error: {error}</div>}
            <div className="flex items-center gap-3 px-2 mt-6 justify-center lg:justify-end">
              <Button size="sm" variant="outline" startIcon={<BiX size={20} />} onClick={close}>
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};
