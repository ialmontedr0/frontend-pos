import React, { useEffect, useRef } from 'react';
import { Label } from '../UI/Label/Label';
import { RadioGroup, RadioGroupItem } from '../UI/RadioGroup/RadioGroup';
import { BiSun, BiMoon, BiLaptop } from 'react-icons/bi';
import { useTheme } from '../../contexts/ThemeContext';
import { type Theme } from '../../contexts/ThemeContext';

type ThemeSelectorProps = {
  value: Theme;
  onChange: (value: Theme) => void;
};

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ value, onChange }) => {
  const { setTheme } = useTheme();

  // refs para cada opcion
  const refClaro = useRef<HTMLLabelElement>(null);
  const refOscuro = useRef<HTMLLabelElement>(null);
  const refSistema = useRef<HTMLLabelElement>(null);

  // Al cambiar value hacer focus al correspondiente
  useEffect(() => {
    switch (value) {
      case 'claro':
        refClaro.current?.focus();
        break;
      case 'oscuro':
        refOscuro.current?.focus();
        break;
      case 'sistema':
        refSistema.current?.focus();
        break;
    }
  }, [value]);

  const handleValueChange = (newVal: Theme) => {
    onChange(newVal);
    setTheme(newVal);
  };

  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-lg font-medium">Tema</h3>
        <p className="text-sm text-muted-foreground">
          Selecciona el tema de visualizacion de la aplicacion
        </p>
      </div>
      <RadioGroup
        value={value}
        onValueChange={handleValueChange as (value: string) => void}
        className="grid grid-cols-3 gap-4"
      >
        <div>
          <RadioGroupItem value="claro" id="claro" className="peer sr-only" />
          <Label
            ref={refClaro}
            htmlFor="claro"
            className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-gray-100 dark:hover:bg-gray-100/9 hover:text-gray-800 peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary transition-all`}
          >
            <BiSun className="mb-3 h-6 w-6" />
            <span className="text-sm font-semibold">Claro</span>
          </Label>
        </div>
        <div>
          <RadioGroupItem value="oscuro" id="oscuro" className="peer sr-only" />
          <Label
            ref={refOscuro}
            htmlFor="oscuro"
            className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-gray-100 dark:hover:bg-gray-100/9 hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary transition-all`}
          >
            <BiMoon className="mb-3 h-6 w-6" />
            <span className="text-sm font-semibold">Oscuro</span>
          </Label>
        </div>
        <div>
          <RadioGroupItem value="sistema" id="sistema" className="peer sr-only" />
          <Label
            ref={refSistema}
            htmlFor="sistema"
            className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-gray-100 dark:hover:bg-gray-100/9 hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary transition-all`}
          >
            <BiLaptop className="mb-3 h-6 w-6" />
            <span className="text-sm font-semibold">Sistema</span>
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
};
