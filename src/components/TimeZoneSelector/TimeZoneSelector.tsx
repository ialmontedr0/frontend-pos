import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../Select/Select';
import { Label } from '../UI/Label/Label';
import { BiTimer } from 'react-icons/bi';

type TimeZoneSelectorProps = {
  value: string;
  onChange: (value: string) => void;
};

export const TimeZoneSelector: React.FC<TimeZoneSelectorProps> = ({ value, onChange }) => {
  const timeZones = [
    { value: 'America/Santo_Domingo', label: 'Santo Domingo (GMT-4)' },
    { value: 'America/New_York', label: 'New York (GMT-5)' },
    { value: 'America/Chicago', label: 'Chicago (GMT-6)' },
    { value: 'America/Denver', label: 'Denver (GMT-7)' },
    { value: 'America/Los_Angeles', label: 'Los Angeles (GMT-8)' },
    { value: 'Europe/London', label: 'London (GMT+0)' },
    { value: 'Europe/Paris', label: 'Paris (GMT+1)' },
    { value: 'Asia/Tokyo', label: 'Tokyo (GMT+9)' },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <BiTimer className="h-5 w-5" />
        <h3 className="text-lg font-medium">Zona Horaria</h3>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="timezone">Selecciona tu Zona Horaria</Label>
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger id="timezone" className="w-full">
            <SelectValue placeholder="Selecciona una zona horaria" />
          </SelectTrigger>
          <SelectContent>
            {timeZones.map((timeZone) => (
              <SelectItem key={timeZone.value} value={timeZone.value}>
                {timeZone.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
