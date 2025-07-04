import { useState, useEffect } from 'react';

import { useAppDispatch } from '../../hooks/hooks';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../UI/NewCard/Card';
import Button from '../UI/Button/Button';
import { ThemeSelector } from '../ThemeSelector/ThemeSelector';
import { LanguageSelector } from '../LanguageSelector/LanguageSelector';
import { CurrencySelector } from '../CurrencySelector/CurrencySelector';
import { TimeZoneSelector } from '../TimeZoneSelector/TimeZoneSelector';
import { NotificationToggle } from '../NotificationToggle/NotificationToggle';
import { Separator } from '../UI/Separator/Separator';
import { toast } from '../UI/Toast/hooks/useToast';
import { TextSizeSelector } from '../TextSizeSelector/TextSizeSelector';
import { useTheme } from '../../contexts/ThemeContext';
import { setUserTheme } from '../../features/users/slices/usersSlice';
import { BiReset, BiSave } from 'react-icons/bi';

export type UserSettings = {
  theme: 'claro' | 'oscuro' | 'sistema';
  language: 'EN' | 'ES';
  currency: 'DOP' | 'USD';
  timeZone: string;
  textSize: 'sm' | 'md' | 'lg';
  notifications: boolean;
};

export function UserSettingsForm() {
  const dispatch = useAppDispatch();
  const { theme: ctxTheme, setTheme } = useTheme();

  const [settings, setSettings] = useState<Omit<UserSettings, 'theme'>>({
    language: 'ES',
    currency: 'DOP',
    timeZone: 'America/Santo_Domingo',
    textSize: 'md',
    notifications: true,
  });

  useEffect(() => {
    setSettings((prev) => ({ ...prev, theme: ctxTheme }));
  }, [ctxTheme]);

  const handleReset = () => {
    dispatch(setUserTheme(ctxTheme))
      .unwrap()
      .then(() => {
        toast({ title: 'Tema actualizado', description: 'Tema guardado con exito' });
      })
      .catch((error: any) => {
        toast({
          title: `Error`,
          description: `Error: ${error.response?.data?.message || error.message}`,
        });
      });

    setSettings({
      language: 'ES',
      currency: 'DOP',
      timeZone: 'America/Santo_Domingo',
      textSize: 'md',
      notifications: true,
    });
    toast({
      title: 'Configuracion Restablecida',
      description: 'Tus preferencias se han restablecido con exito.',
      variant: 'destructive',
    });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Preferencias</CardTitle>
          <CardDescription>
            Configura tus preferencias de visualizacion y notificaciones
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ThemeSelector value={ctxTheme} onChange={setTheme} />

          <Separator />

          <LanguageSelector
            value={settings.language}
            onChange={(language) => setSettings({ ...settings, language })}
          />

          <Separator />

          <CurrencySelector
            value={settings.currency}
            onChange={(currency) => setSettings({ ...settings, currency })}
          />

          <Separator />

          <TimeZoneSelector
            value={settings.timeZone}
            onChange={(timeZone) => setSettings({ ...settings, timeZone })}
          />

          <Separator />

          <TextSizeSelector
            value={settings.textSize}
            onChange={(textSize) => setSettings({ ...settings, textSize })}
          />

          <Separator />

          <NotificationToggle
            value={settings.notifications}
            onChange={(notifications) => setSettings({ ...settings, notifications })}
          />
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button size="sm" type="button" variant="primary" startIcon={<BiSave />}>
            Guardar cambios
          </Button>
          <Button
            size="sm"
            startIcon={<BiReset size={20} />}
            variant="outline"
            onClick={handleReset}
          >
            Restablecer
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
