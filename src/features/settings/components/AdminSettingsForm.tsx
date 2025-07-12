import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import type { RootState } from '../../../store/store';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import { getAppSettings, updateAppSettings } from '../slices/settingsSlice';
import Button from '../../../components/UI/Button/Button';
import { Label } from '../../../components/UI/Label/Label';
import Input from '../../../components/UI/Input/Input';
import { BiArrowBack, BiCog, BiSave } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import { LanguageSelector } from '../../../components/LanguageSelector/LanguageSelector';
import { CurrencySelector } from '../../../components/CurrencySelector/CurrencySelector';
import { TextSizeSelector } from '../../../components/TextSizeSelector/TextSizeSelector';
import { myAlertError, myAlertSuccess } from '../../../utils/commonFunctions';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../../components/UI/NewCard/Card';
import { Separator } from '../../../components/UI/Separator/Separator';
import type { UpdateSettingsDTO } from '../dtos/update-settings.dto';

export type AppSettings = {
  idioma: 'ES' | 'EN';
  moneda: 'DOP' | 'USD';
  tamanoTexto: 'sm' | 'md' | 'lg';
  itbisFee: number;
};

export const AdminSettingsForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const myAlert = withReactContent(Swal);
  const [appSettingsForm, setAppSettingsForm] = useState<UpdateSettingsDTO>({
    idioma: 'ES',
    moneda: 'DOP',
    tamanoTexto: 'md',
    itbisFee: 18,
  });
  const { settings, loading } = useAppSelector((state: RootState) => state.settings);

  const sanitizedSettingsForm = (s: any): UpdateSettingsDTO => {
    const { idioma, moneda, tamanoTexto, itbisFee } = s;
    return {
      idioma,
      moneda,
      tamanoTexto,
      itbisFee,
    };
  };

  const { reset } = useForm<UpdateSettingsDTO>({
    defaultValues: {
      idioma: 'ES',
      moneda: 'DOP',
      tamanoTexto: 'md',
      itbisFee: 18,
    },
  });

  useEffect(() => {
    if (settings) {
      reset(sanitizedSettingsForm(settings));
    }
  }, [settings, reset]);

  useEffect(() => {
    dispatch(getAppSettings());
  }, [dispatch]);

  const handleChange = (k: keyof AppSettings, v: any) => {
    setAppSettingsForm((prev) => ({ ...prev, [k]: v }));
  };

  const handleSubmit = () => {
    myAlert
      .fire({
        title: 'Guardar Ajustes',
        text: `Estas seguro que deseas guardar los cambios en la configuracion?`,
        iconHtml: <BiCog />,
        customClass: {
          icon: 'no-default-icon-border',
        },
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        cancelButtonText: 'Cancelar',
      })
      .then((result) => {
        if (result.isConfirmed) {
          dispatch(updateAppSettings({ dto: appSettingsForm }))
            .unwrap()
            .then(() => {
              myAlertSuccess(
                `Configuracion Actualizada`,
                `Se ha actualizado la configuracion exitosamente.`
              );
            })
            .catch((error: any) => {
              myAlertError(`Error`, `Error: ${error}`);
            });
        }
      });
  };

  const back = () => {
    navigate(-1);
  };

  /*  <div className="m-2 md:mx-auto max-w-lg p-4 shadow-theme-xs space-y-6 bg-white dark:bg-gray-900 text-black dark:text-gray-200 rounded-lg border-2 border-black">
      <div className="my-4">
        <h2 className="text-2xl md:text-3xl font-regular">Panel Administrador</h2>
      </div>

      {error && <div className="text-red-500">Error: {error}</div>}
      <div>
        <div className="space-y-6">
          <div>
            <LanguageSelector
              value={appSettingsForm.idioma}
              onChange={(idioma) => setAppSettingsForm({ ...appSettingsForm, idioma })}
            />
          </div>

          <div>
            <CurrencySelector
              value={appSettingsForm.moneda}
              onChange={(moneda) => setAppSettingsForm({ ...appSettingsForm, moneda })}
            />
          </div>

          <div>
            <TextSizeSelector
              value={appSettingsForm.tamanoTexto}
              onChange={(tamanoTexto) => setAppSettingsForm({ ...appSettingsForm, tamanoTexto })}
            />
          </div>

          <div>
            <Label>ITBIS (Aplicacion)</Label>
            <Input
              type="number"
              id="itbisFee"
              value={appSettingsForm.itbisFee}
              onChange={(e) => handleChange('itbisFee', parseFloat(e.target.value))}
            />
          </div>
        </div>

        <div className="flex gap-2 justify-center md:justify-end my-4">
          <Button size="sm" variant="outline" startIcon={<BiArrowBack size={20} />} onClick={back}>
            Volver
          </Button>
          <Button
            onClick={handleSubmit}
            size="sm"
            variant="primary"
            startIcon={<BiSave size={20} />}
            disabled={loading}
          >
            Guardar
          </Button>
        </div>
      </div>
    </div> */

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Panel Administrador</CardTitle>
          <CardDescription>Actualiza la configuracion de la aplicacion</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <LanguageSelector
            value={appSettingsForm.idioma}
            onChange={(idioma) => setAppSettingsForm({ ...appSettingsForm, idioma })}
          />

          <Separator />

          <CurrencySelector
            value={appSettingsForm.moneda}
            onChange={(moneda) => setAppSettingsForm({ ...appSettingsForm, moneda })}
          />

          <Separator />

          <TextSizeSelector
            value={appSettingsForm.tamanoTexto}
            onChange={(tamanoTexto) => setAppSettingsForm({ ...appSettingsForm, tamanoTexto })}
          />

          <Separator />

          <div>
            <Label>ITBIS (Aplicacion)</Label>
            <Input
              type="number"
              id="itbisFee"
              value={appSettingsForm.itbisFee}
              onChange={(e) => handleChange('itbisFee', parseFloat(e.target.value))}
            />
          </div>

          <Separator />
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button
            size="sm"
            type="button"
            variant="outline"
            startIcon={<BiArrowBack size={20} />}
            onClick={back}
          >
            Volver
          </Button>
          <Button
            size="sm"
            type="button"
            variant="primary"
            startIcon={<BiSave size={20} />}
            onClick={handleSubmit}
            disabled={loading}
          >
            Guardar
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};
