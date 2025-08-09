'use client';
import React, { useState } from 'react';

export default function useWordTryHook() {
  const [tries, setTries] = useState([]);

  const addTries = (input, round) => {
    setTries((prevInput) => {
      let newTries = [...prevInput];
      newTries[round] = input;
      return newTries;
    });
  };

  const clearTries = () => {
    setTries([]);
  };

  return { tries, addTries, clearTries };
}
