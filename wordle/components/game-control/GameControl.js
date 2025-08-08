'use client';

import React from 'react';

export default function GameControl({ roundEnd = false, gameReset }) {
  return (
    <div className="flex justify-end w-full min-h-10 mb-6">
      {roundEnd && (
        <button
          onClick={gameReset}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Retry
        </button>
      )}
    </div>
  );
}
