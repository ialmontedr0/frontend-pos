import { Label } from '../UI/Label/Label';
import { Switch } from '../UI/Switch/Switch';
import { BiBell } from 'react-icons/bi';

type NotificationToggleProps = {
  value: boolean;
  onChange: (value: boolean) => void;
};

export const NotificationToggle: React.FC<NotificationToggleProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <BiBell className="h-5 w-5" />
        <h3 className="text-lg font-medium">Notificaciones</h3>
      </div>
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="notificaciones">Activar notificaciones</Label>
          <p className="text-sm text-muted-foreground">
            Recibe ciertas actualizaciones y eventos importantes.
          </p>
        </div>
        <Switch id="" checked={value} onCheckedChange={onChange} />
      </div>
    </div>
  );
};
