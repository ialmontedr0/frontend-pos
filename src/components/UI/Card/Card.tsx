import React from 'react';
import { cn } from '../../../lib/utils';

export type CardItem = {
  id: string;
  imageUrl: string;
  title: string;
  subtitle?: string;
  fields: {
    label: string;
    value: string | React.ReactNode;
  }[];
  actions?: { icon: React.ReactNode; onClick: () => void; toolTip?: string }[];
};

interface CardProps {
  item: CardItem;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ item, className }) => {
  return (
    <div className={cn('bg-white dark:bg-gray-800 rounded-xl shadow p-4 flex-col', className)}>
      <div className="w-full h-40 mb-4 overflow-hidden rounded-md bg-gray-100">
        {item.imageUrl ? (
          <img src={item.imageUrl || ''} alt={item.title} className="object-cover w-full h-full" />
        ) : (
          <div className="w-full h-full bg-gray-200" />
        )}
      </div>

      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{item.title}</h3>
        {item.subtitle && (
          <p className="text-sm text-gray-600 dark:text-gray-300">{item.subtitle}</p>
        )}
        <div className="mt-2 space-y-1">
          {item.fields.map((f, i) => (
            <div key={i} className="text-sm text-gray-700 dark:text-gray-300">
              <span className="font-medium">{f.label}: </span>
              <span>{f.value}</span>
            </div>
          ))}
        </div>
      </div>

      {item.actions && item.actions.length > 0 && (
        <div className="mt-4 flex space-x-2">
          {item.actions.map((a, i) => (
            <button
              key={i}
              onClick={a.onClick}
              title={a.toolTip}
              className="cursor-pointer p-2 bg-gray-100/50 dark:bg-gray-700 dark:text-white rounded-md hover:bg-gray-200/50 dark:hover:bg-gray-600 transition"
            >
              {a.icon}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
