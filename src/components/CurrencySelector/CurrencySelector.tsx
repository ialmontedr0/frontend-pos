import { Label } from '../UI/Label/Label';
import { RadioGroup, RadioGroupItem } from '../UI/RadioGroup/RadioGroup';
import { BiDollar } from 'react-icons/bi';

type CurrencySelectorProps = {
  value: 'DOP' | 'USD';
  onChange: (value: 'DOP' | 'USD') => void;
};

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-3">
      <div>
        <BiDollar />
        <h3></h3>
      </div>
      <RadioGroup value={value} onValueChange={onChange as (value: string) => void} className="">
        <div className="">
          <RadioGroupItem value="DOP" id="moneda-dop" />
          <Label htmlFor="moneda-dop">Peso Dominicano (RD$)</Label>
        </div>

        <div className="">
          <RadioGroupItem value="USD" id="moneda-usd" />
          <Label htmlFor="moneda-usd">Dolar Estadounidense (USD$)</Label>
        </div>
      </RadioGroup>
    </div>
  );
};
