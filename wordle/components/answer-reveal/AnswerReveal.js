'use client';

import React from 'react';

export default function AnswerReveal({ answer, roundEnd }) {
  return (
    <div className={`mb-4 min-h-7`}>
      <h2 className={`text-lg ${roundEnd ? 'visible' : 'hidden'}`}>
        The answer is:
        <b> {answer.toUpperCase()}</b>
      </h2>
    </div>
  );
}
