import React from 'react';

// This is the dedicated component for our loading spinner.
const LoadingFallback = () => (
  <div className="w-full h-screen flex justify-center items-center">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-600"></div>
  </div>
);

export default LoadingFallback;