# 🚀 Guía de Configuración - FinanzApp

Esta guía te ayudará a configurar Firebase Authentication y Firestore para tu aplicación.

## 📋 Requisitos Previos

- Node.js 18+ instalado
- Cuenta de Firebase
- Cuenta de Vercel (para deployment)

## 🔥 Configuración de Firebase

### 1. Crear Proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com)
2. Haz clic en "Add project" o "Agregar proyecto"
3. Ingresa el nombre del proyecto (ej: `finance-app`)
4. Sigue los pasos del asistente

### 2. Habilitar Authentication

1. En el menú lateral, ve a **Build** → **Authentication**
2. Haz clic en "Get started"
3. Habilita los siguientes métodos de autenticación:
   - **Email/Password**: Actívalo
   - **Google**: Actívalo y configura el email de soporte

### 3. Configurar Dominios Autorizados

1. En **Authentication** → **Settings** → **Authorized domains**
2. Agrega los siguientes dominios:
   - `localhost` (ya viene por defecto)
   - Tu dominio de Vercel (ej: `finance-app-three-steel.vercel.app`)

### 4. Crear Base de Datos Firestore

1. En el menú lateral, ve a **Build** → **Firestore Database**
2. Haz clic en "Create database"
3. Selecciona el modo:
   - **Production mode** (recomendado para producción)
   - **Test mode** (solo para desarrollo)
4. Selecciona la ubicación (ej: `us-central1`)

### 5. Configurar Reglas de Seguridad de Firestore

Reemplaza las reglas por defecto con estas:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir lectura/escritura solo a usuarios autenticados
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
    
    // Reglas específicas para colecciones de usuarios
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 6. Obtener Credenciales de Firebase

1. Ve a **Project Settings** (⚙️ en el menú lateral)
2. En la sección **General**, baja hasta **Your apps**
3. Si no tienes una app web, haz clic en el ícono `</>`
4. Registra la app con un nombre (ej: "FinanzApp Web")
5. Copia la configuración que aparece:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123",
  measurementId: "G-XXXXXXXXXX"
};
```

## 🔐 Configuración de Variables de Entorno

### Desarrollo Local

1. Crea un archivo `.env.local` en la raíz del proyecto:

```bash
cp .env.local.example .env.local
```

2. Edita `.env.local` y agrega tus credenciales de Firebase:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_proyecto_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=tu_measurement_id
```

### Producción (Vercel)

1. Ve a tu proyecto en [Vercel Dashboard](https://vercel.com/dashboard)
2. Ve a **Settings** → **Environment Variables**
3. Agrega cada variable de entorno:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
   - `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`
4. Selecciona los ambientes: **Production**, **Preview**, **Development**
5. Haz clic en "Save"

## 🚀 Instalación y Ejecución

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Ejecutar en Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

### 3. Build para Producción

```bash
npm run build
npm start
```

## 📱 Deployment en Vercel

### Opción 1: Desde GitHub (Recomendado)

1. Sube tu código a GitHub
2. Ve a [Vercel](https://vercel.com)
3. Haz clic en "Add New Project"
4. Importa tu repositorio de GitHub
5. Vercel detectará automáticamente que es un proyecto Next.js
6. Agrega las variables de entorno (ver sección anterior)
7. Haz clic en "Deploy"

### Opción 2: Desde CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel
```

## ✅ Verificar la Configuración

1. Abre la aplicación
2. Haz clic en "Sign Up" o "Register"
3. Crea una cuenta con email y contraseña
4. Verifica que puedas iniciar sesión
5. Prueba el login con Google
6. Verifica que tu información aparezca en el Sidebar

## 🔍 Troubleshooting

### Error: "Firebase: Error (auth/unauthorized-domain)"

**Solución**: Agrega tu dominio a los dominios autorizados en Firebase Console → Authentication → Settings → Authorized domains

### Error: "Missing or insufficient permissions"

**Solución**: Verifica las reglas de seguridad de Firestore. Asegúrate de que los usuarios autenticados tengan permisos de lectura/escritura.

### Las variables de entorno no se cargan

**Solución**: 
- Verifica que el archivo `.env.local` esté en la raíz del proyecto
- Reinicia el servidor de desarrollo (`npm run dev`)
- Asegúrate de que las variables empiecen con `NEXT_PUBLIC_`

### Error al hacer login con Google en producción

**Solución**: Verifica que tu dominio de Vercel esté agregado a los dominios autorizados en Firebase.

## 📚 Recursos Adicionales

- [Documentación de Firebase](https://firebase.google.com/docs)
- [Documentación de Next.js](https://nextjs.org/docs)
- [Documentación de Vercel](https://vercel.com/docs)

## 🎉 ¡Listo!

Tu aplicación ahora tiene autenticación completa con Firebase y está lista para ser desplegada en Vercel.

