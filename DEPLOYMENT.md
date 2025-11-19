# 🚀 Guía Rápida de Deployment

## Pre-requisitos ✅

Antes de hacer el deployment, asegúrate de tener:

- [x] Proyecto de Firebase creado
- [x] Authentication habilitado (Email/Password y Google)
- [x] Firestore Database creado
- [x] Variables de entorno en `.env.local`
- [x] Dominio de Vercel autorizado en Firebase

## 🔥 Configuración de Firebase

### 1. Dominios Autorizados

Ve a **Firebase Console** → **Authentication** → **Settings** → **Authorized domains**

Agrega:
```
finance-app-three-steel.vercel.app
```

### 2. Reglas de Firestore

Ve a **Firestore Database** → **Rules**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 🌐 Deployment en Vercel

### Opción A: Desde el Dashboard de Vercel

1. Ve a https://vercel.com/dashboard
2. Click en **"Add New Project"**
3. Importa tu repositorio de GitHub
4. **Framework Preset**: Next.js (detectado automáticamente)
5. **Root Directory**: `./`
6. **Build Command**: `npm run build` (por defecto)
7. **Output Directory**: `.next` (por defecto)

### Configurar Variables de Entorno en Vercel

1. En tu proyecto de Vercel, ve a **Settings** → **Environment Variables**
2. Agrega cada variable:

| Variable | Valor | Environments |
|----------|-------|--------------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Tu API Key | Production, Preview, Development |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Tu Auth Domain | Production, Preview, Development |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Tu Project ID | Production, Preview, Development |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Tu Storage Bucket | Production, Preview, Development |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Tu Sender ID | Production, Preview, Development |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Tu App ID | Production, Preview, Development |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | Tu Measurement ID | Production, Preview, Development |

3. Click en **"Save"** para cada variable

### Deploy

1. Click en **"Deploy"**
2. Espera a que termine el build (2-3 minutos)
3. ¡Tu app estará en vivo! 🎉

### Opción B: Desde la Terminal (Vercel CLI)

```bash
# 1. Instalar Vercel CLI (si no lo tienes)
npm i -g vercel

# 2. Login
vercel login

# 3. Deploy a preview
vercel

# 4. Deploy a producción
vercel --prod
```

## 🔄 Configuración de Auto-Deploy

### GitHub Integration

Si conectaste tu repo de GitHub a Vercel:

- **Push a `main`** → Deploy automático a producción
- **Push a otras ramas** → Deploy automático a preview
- **Pull Requests** → Deploy preview automático

### Configurar Branch de Producción

1. Ve a **Settings** → **Git**
2. **Production Branch**: `main` (o tu rama principal)
3. **Deploy Hooks**: Opcional, para triggers externos

## ✅ Verificación Post-Deployment

### 1. Verificar que la App Carga

```
https://tu-app.vercel.app
```

### 2. Probar Autenticación

- [ ] Ir a `/register`
- [ ] Crear una cuenta con email
- [ ] Verificar que aparece en Firebase Console → Authentication
- [ ] Hacer logout
- [ ] Login nuevamente
- [ ] Probar login con Google

### 3. Verificar Firestore

- [ ] Ir a Firebase Console → Firestore Database
- [ ] Verificar que se pueden crear documentos (si implementaste guardado)

### 4. Verificar Variables de Entorno

Si algo no funciona, verifica en Vercel:

```bash
# En tu proyecto local
vercel env pull .env.local

# Esto descargará las variables de entorno de Vercel
```

## 🐛 Troubleshooting

### Error: "Firebase: Error (auth/unauthorized-domain)"

**Causa**: Tu dominio de Vercel no está autorizado en Firebase

**Solución**:
1. Ve a Firebase Console → Authentication → Settings → Authorized domains
2. Agrega tu dominio de Vercel (ej: `tu-app.vercel.app`)
3. Espera 1-2 minutos para que se propague

### Error: "Configuration object is not valid"

**Causa**: Variables de entorno no configuradas correctamente

**Solución**:
1. Ve a Vercel → Settings → Environment Variables
2. Verifica que todas las variables estén presentes
3. Asegúrate de que empiecen con `NEXT_PUBLIC_`
4. Redeploy el proyecto

### Error: "Build failed"

**Causa**: Error en el código o dependencias

**Solución**:
1. Ejecuta `npm run build` localmente
2. Corrige los errores
3. Haz commit y push
4. Vercel hará redeploy automáticamente

### Google Sign-In no funciona en producción

**Causa**: Dominio no autorizado o configuración incorrecta

**Solución**:
1. Ve a Firebase Console → Authentication → Sign-in method → Google
2. Verifica que esté habilitado
3. Agrega tu dominio de Vercel a dominios autorizados
4. En Google Cloud Console, verifica los orígenes autorizados

## 📊 Monitoreo

### Vercel Analytics

Vercel proporciona analytics básicos gratis:
- Visitas
- Tiempo de carga
- Errores

Ve a tu proyecto → **Analytics**

### Firebase Analytics

Si configuraste `measurementId`, Firebase Analytics está activo:
- Ve a Firebase Console → Analytics
- Verás usuarios activos, eventos, etc.

## 🔒 Seguridad

### Checklist de Seguridad

- [ ] Variables de entorno no expuestas en el código
- [ ] Reglas de Firestore configuradas correctamente
- [ ] Dominios autorizados limitados a los necesarios
- [ ] HTTPS habilitado (automático en Vercel)
- [ ] `.env.local` en `.gitignore`

## 🎯 Siguientes Pasos

1. **Custom Domain**: Conecta tu dominio personalizado en Vercel
2. **Email Verification**: Habilita verificación de email en Firebase
3. **Monitoring**: Configura alertas en Vercel y Firebase
4. **Backup**: Configura backups automáticos de Firestore
5. **CDN**: Vercel usa CDN global automáticamente

## 📞 Soporte

- **Vercel Docs**: https://vercel.com/docs
- **Firebase Docs**: https://firebase.google.com/docs
- **Next.js Docs**: https://nextjs.org/docs

---

**¡Tu aplicación está lista para producción!** 🚀

