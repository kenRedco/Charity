import React from 'react';

export default function LoadingFallback() {
  return (
    <div className="w-full min-h-[60vh] px-6 py-16 max-w-4xl mx-auto" aria-busy="true" aria-label="Loading page content">
      {/* Hero skeleton */}
      <div className="h-8 w-2/3 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse mb-4" />
      <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700 animate-pulse mb-2" />
      <div className="h-4 w-5/6 rounded bg-gray-200 dark:bg-gray-700 animate-pulse mb-8" />

      {/* Card row skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        {[0, 1, 2].map((i) => (
          <div key={i} className="rounded-2xl bg-gray-200 dark:bg-gray-700 animate-pulse h-32" style={{ animationDelay: `${i * 80}ms` }} />
        ))}
      </div>

      {/* Block skeleton */}
      <div className="rounded-2xl bg-gray-200 dark:bg-gray-700 animate-pulse h-48 mb-6" />
      <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700 animate-pulse mb-2" />
      <div className="h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
    </div>
  );
}
