# 💰 Finance App

Aplicación web de gestión financiera personal construida con Next.js, Firebase y Vercel.

## 🚀 Características Actuales

- ✅ Autenticación con Firebase (Email/Password y Google OAuth)
- ✅ Dashboard con KPIs y gráficos
- ✅ Registro de gastos e ingresos
- ✅ Gastos divididos entre personas
- ✅ Control de presupuesto diario con balance acumulado
- ✅ Metas de ahorro
- ✅ Gestión de billetera (cuentas y tarjetas)
- ✅ Sistema de deudas (me deben / debo)
- ✅ Configuración financiera personalizada
- ✅ Diseño responsive y moderno

## 📋 Funcionalidades Pendientes

### 🔴 Alta Prioridad
- [ ] **Arreglar alineación del calendario en filtro personalizado**
- [ ] **Conectar con datos reales de Firebase en todas las páginas**
  - Transacciones reales
  - Metas de ahorro funcionales
  - Gastos divididos persistentes
  - Balance y reportes con datos reales
  
### 🟡 Media Prioridad
- [ ] **Sistema de Notificaciones**
  - Vencimiento de servicios (luz, agua, internet, etc.)
  - Deudas pendientes de cobro
  - Deudas pendientes de pago
  - Alertas de presupuesto diario excedido
  - Recordatorios personalizados
  - Notificaciones push

- [ ] **Asistente Personal por Voz**
  - Comunicación por voz
  - Acceso a toda la información financiera del usuario
  - Registro de gastos e ingresos mediante voz
  - Consultas sobre balance, presupuesto y metas
  - Integración con IA (GPT-4 / Claude)

- [ ] **Completar funcionalidad de Gastos Divididos**
  - Marcar pagos individuales
  - Enviar recordatorios automáticos
  - Historial de pagos por persona
  - Estadísticas de gastos compartidos

- [ ] **Reportes Avanzados**
  - Exportar a PDF/Excel
  - Comparativas mes a mes
  - Proyecciones financieras
  - Análisis de tendencias

### 🟢 Baja Prioridad
- [ ] Gestión completa de tarjetas (CRUD, alertas de vencimiento)
- [ ] Gestión completa de cuentas bancarias
- [ ] Transferencias entre cuentas
- [ ] Perfil de usuario con foto
- [ ] Historial de configuración financiera
- [ ] Modo oscuro personalizado
- [ ] Exportación de datos

## 🛠 Tecnologías

- **Framework**: Next.js 14 (App Router)
- **Autenticación**: Firebase Auth
- **Base de Datos**: Firebase Firestore
- **Almacenamiento**: Firebase Storage
- **Hosting**: Vercel
- **UI**: Tailwind CSS + Shadcn UI
- **Gráficos**: Recharts
- **Notificaciones**: Sonner

## 💻 Desarrollo

### Instalación

```bash
npm install
```

### Variables de Entorno

Crear un archivo `.env.local` con:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### Comandos

```bash
# Desarrollo
npm run dev

# Build
npm run build

# Producción
npm start

# Linting
npm run lint
```

## 📱 Estructura del Proyecto

```
finance-app/
├── app/                    # Rutas y páginas
│   ├── dashboard/         # Dashboard principal
│   ├── daily-expenses/    # Gastos diarios
│   ├── goals/             # Metas de ahorro
│   ├── wallet/            # Billetera (cuentas + tarjetas)
│   ├── transactions/      # Historial de transacciones
│   ├── reports/           # Reportes y análisis
│   ├── settings/          # Configuración financiera
│   └── profile/           # Perfil de usuario
├── components/            # Componentes reutilizables
│   ├── ui/               # Componentes de Shadcn UI
│   └── ...               # Componentes personalizados
├── lib/                   # Utilidades y configuración
│   ├── firebase/         # Configuración de Firebase
│   └── hooks/            # Custom hooks
└── public/               # Archivos estáticos
```

## 🚢 Deploy en Vercel

La aplicación se despliega automáticamente en Vercel al hacer push a la rama principal.

1. Conectar el repositorio de GitHub con Vercel
2. Configurar las variables de entorno en Vercel
3. Deploy automático en cada push

## 📝 Notas de Desarrollo

- El calendario del filtro personalizado necesita ajustes de alineación
- Los datos actuales son simulados (mock data)
- El sistema de notificaciones está planificado pero no implementado
- El asistente por voz es una funcionalidad futura prioritaria

## 🤝 Contribuciones

Este es un proyecto personal, pero las sugerencias son bienvenidas.

## 📄 Licencia

Proyecto privado - Todos los derechos reservados
