import React, { useState } from 'react';
import { BiGlobe } from 'react-icons/bi';
import { BiSun } from 'react-icons/bi';
import { BiSolidYinYang } from 'react-icons/bi';

interface ToggleThemeProps {
  enabled: boolean;
  onClick: () => void;
}

export const ThemeToggle: React.FC<ToggleThemeProps> = ({ enabled, onClick }) => {
  return (
    <button
      onClick={onClick}
      aria-label="Cambiar tema"
      className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full transition-colors duration-200 ease-in-out ${enabled ? 'bg-gray-600' : 'bg-yellow-400'}`}
    >
      <span
        className={`
        absolute inset-0 flex items-center justify-center transition-opacity
        ${enabled ? 'opacity-0 duration-100 ease-out' : 'opacity-100 duration-200 ease-in'}`}
      >
        <BiSun className="h-4 w-4 text-white" />
      </span>
      <span
        className={`
        absolute inset-0 flex items-center justify-center transition-opacity
        ${enabled ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out'}`}
      >
        <BiSolidYinYang className="h-4 w-4 text-white" />
      </span>
      <span
        className={`
        pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow
        transition-transform duration-200 ease-in-out
        ${enabled ? 'translate-x-5' : 'translate-x-0'}`}
      />
    </button>
  );
};
