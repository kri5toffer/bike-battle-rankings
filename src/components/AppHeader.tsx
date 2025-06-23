
import React from 'react';
import { Bike } from 'lucide-react';

const AppHeader = () => {
  return (
    <div className="flex items-center justify-center gap-3 sm:gap-4 mb-6 sm:mb-8">
      <div className="p-2 sm:p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl sm:rounded-2xl shadow-lg">
        <Bike className="text-white w-6 h-6 sm:w-7 sm:h-7" />
      </div>
      <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent text-center">
        Velocity Rankings
      </h1>
    </div>
  );
};

export default AppHeader;
