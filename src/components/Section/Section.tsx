import React from 'react';

type SectionProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
};

export const Section: React.FC<SectionProps> = ({ title, description, children }) => (
  <div className="bg-white dark:bg-[#101828] rounded-lg shadow p-6">
    <h2 className="text-xl font-medium mb-2">{title}</h2>
    {description && <p className="text-sm text-gray-500 dark:gray-200 mb-4">{description}</p>}
    {children}
  </div>
);
