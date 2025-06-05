import React from 'react';
import { UserInfo } from '../components/UserProfile/UserInfo';
import { UserPreferences } from '../components/UserProfile/UserPreferences';
import { UserSecurity } from '../components/UserProfile/UserSecurity';

export const UserProfile: React.FC = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <UserInfo />
      <UserPreferences />
      <UserSecurity />
    </div>
  );
};
