# Finance App (`financial-app`)

## Descripción del proyecto

App web de **finanzas personales o presupuesto**: registro de movimientos, categorías y visualización del estado de las cuentas, con Next.js y Firebase.

## Problema que resuelve

Ayuda a quien no quiere depender solo de bancos o Excel para entender en qué se gasta y si se cumplen metas: ofrece una interfaz dedicada para seguimiento y ajuste de hábitos financieros.

## Stack

- Next.js 14, React, TypeScript, Tailwind  
- Firebase  

## Requisitos

- Node.js LTS  

## Instalación

```bash
npm install
npm run dev
```

Otros scripts útiles: `dev:mobile` (dev accesible en red), `dev:turbo`, `dev:clean`, `build:clean`, `clean`.

## Variables de entorno

Creá `.env.local` con las variables `NEXT_PUBLIC_FIREBASE_*` que use `lib/firebase` o el código.
