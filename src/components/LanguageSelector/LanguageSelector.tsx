import { Label } from '../UI/Label/Label';
import { RadioGroup, RadioGroupItem } from '../UI/RadioGroup/RadioGroup';
import { BiGlobe } from 'react-icons/bi';

type LanguageSelectorProps = {
  value: 'EN' | 'ES';
  onChange: (value: 'EN' | 'ES') => void;
};

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <BiGlobe className="h-5 w-5" />
        <h3 className="text-lg font-medium">Idioma</h3>
      </div>
      <RadioGroup
        value={value}
        onValueChange={onChange as (value: string) => void}
        className="grid grid-cols-2 gap-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="EN" id="lang-en" />
          <Label htmlFor="lang-en">Ingles</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="ES" id="lang-es" />
          <Label htmlFor="lang-es">Espanol</Label>
        </div>
      </RadioGroup>
    </div>
  );
};
