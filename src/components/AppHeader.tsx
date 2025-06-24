
import React from 'react';
import { Bike } from 'lucide-react';

const AppHeader = () => {
  return (
    <div className="flex items-center justify-center gap-3 sm:gap-4 mb-6 sm:mb-8">
      <div className="p-2 sm:p-3 bg-white border-2 border-white">
        <Bike className="text-black w-6 h-6 sm:w-7 sm:h-7" />
      </div>
      <h1 className="text-2xl sm:text-4xl font-bold text-white text-center">
        Velocity Rankings
      </h1>
    </div>
  );
};

export default AppHeader;
