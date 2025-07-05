import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../components/UI/Tabs/Tabs';
import { UserSettingsForm } from '../../../../components/Forms/UserSettingsForm';
import { SecuritySettingsForm } from '../components/SecuritySettingsForm';
import { Toaster } from '../../../../components/UI/Toaster/Toaster';
import { BiShield, BiPaint } from 'react-icons/bi';
import { useState } from 'react';
import { useAutoTranslate } from '../../../../hooks/useAutoTranslate';

const originals = {
  title: 'Configuracion',
  description: 'Administra tus preferencias y seguridad de la cuenta',
};

export const SettingsPage: React.FC = () => {
  const [texts, setTexts] = useState(originals);

  useAutoTranslate(originals, (key, tr) => setTexts((prev) => ({ ...prev, [key]: tr })));

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl text-black dark:text-gray-300">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-regular tracking-tight">{texts.title}</h1>
          <p className="text-muted-foreground mt-2">{texts.description}</p>
        </div>

        <Tabs defaultValue="visual" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="visual" className="flex items-center gap-2">
              <BiPaint className="h-4 w-4" />
              <span>Visual y Notificaciones</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <BiShield className="h-4 w-4" />
              <span>Seguridad</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="visual" className="space-y-4">
            <UserSettingsForm />
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <SecuritySettingsForm />
          </TabsContent>
        </Tabs>
      </div>
      <Toaster />
    </div>
  );
};
