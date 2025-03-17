'use client';

import { useEffect } from 'react';
import { analytics } from '../lib/firebase';

export function FirebaseInitializer() {
  useEffect(() => {
    // Firebase ya está inicializado en el archivo firebase.ts
    // Este componente solo se asegura de que se cargue en el cliente
    console.log('Firebase initialized', analytics);
  }, []);

  return null; // Este componente no renderiza nada
} 