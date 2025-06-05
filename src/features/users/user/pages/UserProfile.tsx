import React from 'react';
import { UserInfo } from '../components/UserProfile/UserInfo';
import { UserSecurity } from '../components/UserProfile/UserSecurity';

export const UserProfile: React.FC = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <UserInfo />
      <UserSecurity />
    </div>
  );
};
