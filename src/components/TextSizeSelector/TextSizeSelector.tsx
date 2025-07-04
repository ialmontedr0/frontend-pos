import { Label } from '../UI/Label/Label';
import { RadioGroup, RadioGroupItem } from '../UI/RadioGroup/RadioGroup';
import { BiText } from 'react-icons/bi';

type TextSizeSelectorProps = {
  value: 'sm' | 'md' | 'lg';
  onChange: (value: 'sm' | 'md' | 'lg') => void;
};

export const TextSizeSelector: React.FC<TextSizeSelectorProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <BiText className="h-5 w-5" />
        <h3 className="text-lg font-medium">Tamano del Texto</h3>
      </div>
      <RadioGroup
        value={value}
        onValueChange={onChange as (value: string) => void}
        className="grid grid-cols-3 gap-4"
      >
        <div>
          <RadioGroupItem value="sm" id="text-size-sm" className="peer sr-only" />
          <Label
            htmlFor="text-size-sm"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
          >
            <span className="text-xs font-medium">Aa</span>
            <span className="text-xs mt-1">Pequeno</span>
          </Label>
        </div>
        <div>
          <RadioGroupItem value="md" id="text-size-md" className="peer sr-only" />
          <Label
            htmlFor="text-size-md"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
          >
            <span className="text-sm font-medium">Aa</span>
            <span className="text-xs mt-1">Mediano</span>
          </Label>
        </div>
        <div>
          <RadioGroupItem value="lg" id="text-size-lg" className="peer sr-only" />
          <Label
            htmlFor="text-size-lg"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
          >
            <span className="text-base font-medium">Aa</span>
            <span className="text-xs mt-1">Grande</span>
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
};
