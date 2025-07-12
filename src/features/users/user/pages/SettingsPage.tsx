import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../components/UI/Tabs/Tabs';
import { UserSettingsForm } from '../../../../components/Forms/UserSettingsForm';
import { SecuritySettingsForm } from '../components/SecuritySettingsForm';
import { AdminSettingsForm } from '../../../settings/components/AdminSettingsForm';
import { Toaster } from '../../../../components/UI/Toaster/Toaster';
import { BiShield, BiPaint, BiCog } from 'react-icons/bi';
import { useAppSelector } from '../../../../hooks/hooks';
import type { RootState } from '../../../../store/store';

export const SettingsPage: React.FC = () => {
  const { user } = useAppSelector((state: RootState) => state.auth);
  const isAdmin = user?.rol === 'admin';

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl text-black dark:text-gray-300">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-regular tracking-tight">Configuracion</h1>
          <p className="text-muted-foreground mt-2">
            Administra tus preferencias y seguridad de la cuenta.
          </p>
        </div>

        <Tabs defaultValue="visual" className="w-full">
          <TabsList className={`grid w-full mb-8 ${isAdmin ? 'grid-cols-3' : 'grid-cols-2'}`}>
            <TabsTrigger value="visual" className="flex items-center gap-2">
              <BiPaint className="h-4 w-4" />
              <span>Visual y Notificaciones</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <BiShield className="h-4 w-4" />
              <span>Seguridad</span>
            </TabsTrigger>
            {isAdmin && (
              <TabsTrigger value="admin-panel" className="flex items-center gap-2">
                <BiCog className="h-4 w-4" />
                <span>Panel Admin</span>
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="visual" className="space-y-4">
            <UserSettingsForm />
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <SecuritySettingsForm />
          </TabsContent>

          <TabsContent value="admin-panel" className="space-y-4">
            <AdminSettingsForm />
          </TabsContent>
        </Tabs>
      </div>
      <Toaster />
    </div>
  );
};
