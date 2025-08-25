'use client';

import dynamic from 'next/dynamic';

// Cargar Firebase dinámicamente solo en el cliente
const FirebaseInitializer = dynamic(
  () => import('./FirebaseInitializer').then(mod => mod.FirebaseInitializer),
  { ssr: false }
);

export function ClientWrapper() {
  return <FirebaseInitializer />;
} 