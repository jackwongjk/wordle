'use client';
import React, { useState } from 'react';

export default function useLetterInputHook() {
  const [input, setInput] = useState([]);

  const backspaceInput = () => {
    setInput((prevInput) => prevInput.slice(0, -1));
  };

  const addInput = (letter) => {
    setInput((prevInput) => [...prevInput, letter]);
  };

  const clearInput = () => {
    setInput([]);
  };

  return { input, backspaceInput, addInput, clearInput };
}
