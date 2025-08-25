'use client';

import { useEffect } from 'react';

export function FirebaseInitializer() {
  useEffect(() => {
    // Inicializar Firebase Analytics solo en el cliente
    const initializeFirebase = async () => {
      if (typeof window !== 'undefined') {
        try {
          const { analytics } = await import('../lib/firebase');
          console.log('Firebase initialized', analytics);
        } catch (error) {
          console.log('Firebase analytics not available:', error);
        }
      }
    };
    
    initializeFirebase();
  }, []);

  return null; // Este componente no renderiza nada
} 