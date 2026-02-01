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
- ✅ **Chat con Asistente Financiero IA** (OpenRouter)
  - 💬 Conversación natural en español
  - 🆓 Modo gratuito: Consejos y educación financiera
  - 💰 Modo de pago: Function calling para acciones reales
  - 🔄 Fácil cambio entre modelos

## 📋 Funcionalidades Pendientes

### 🔴 Alta Prioridad
- [ ] **Arreglar alineación del calendario en filtro personalizado**
- [x] **Conectar con datos reales de Firebase** (Completado parcialmente)
  - ✅ Dashboard (KPIs, gráficos, transacciones recientes)
  - ✅ Gastos Diarios (calendario, resumen, lista de transacciones)
  - ✅ Metas de Ahorro (lista y detalle)
  - ✅ Configuración Financiera (crear/editar settings)
  - ✅ Transacciones (lista completa, filtros, eliminar)
  - ⏳ Billetera (cuentas, tarjetas, deudas) - **Pendiente**
  - ✅ Reportes (usa datos reales de transacciones)
  
### 🟡 Media Prioridad
- [ ] **Sistema de Notificaciones**
  - Vencimiento de servicios (luz, agua, internet, etc.)
  - Deudas pendientes de cobro
  - Deudas pendientes de pago
  - Alertas de presupuesto diario excedido
  - Recordatorios personalizados
  - Notificaciones push

- [x] **Asistente Financiero con IA** ✅
  - Chat conversacional con OpenAI GPT-4o-mini
  - Acceso a toda la información financiera del usuario
  - Registro de gastos e ingresos mediante chat
  - Consultas sobre balance, presupuesto y metas
  - Análisis de patrones de gasto
  - Recomendaciones personalizadas
  - [ ] Comunicación por voz (pendiente)

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
- **IA**: OpenRouter (Chat Financiero con múltiples modelos)

## 💻 Desarrollo

### Instalación

```bash
npm install
```

### Variables de Entorno

Crear un archivo `.env.local` con:

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# OpenRouter (para el chat con IA)
OPENROUTER_API_KEY=your_openrouter_api_key
OPENROUTER_MODEL=deepseek/deepseek-r1-0528:free
OPENROUTER_SUPPORTS_TOOLS=false
```

Ver [CHATBOT_CONFIG.md](./CHATBOT_CONFIG.md) para configuración detallada del chatbot.

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

## 🤖 Chat con Asistente Financiero

El asistente financiero con IA te permite:

### Funcionalidades
- 🎤 **Reconocimiento de voz**: Habla directamente con el asistente (Web Speech API)
- 💬 **Conversación natural**: Interactúa como lo harías con un asesor financiero
- 💰 **Registrar transacciones**: "Registra un gasto de $500 en comida"
- 📊 **Consultar información**: "¿Cuánto gasté este mes?"
- 📈 **Análisis de gastos**: "Analiza mis gastos de la última semana"
- 💡 **Recomendaciones**: Recibe consejos personalizados basados en tus finanzas
- 🎯 **Consultar metas**: "¿Cómo va mi meta de ahorro?"
- ⚡ **Transcripción en tiempo real**: Ve lo que dices mientras hablas

### Ejemplos de uso

**Por voz 🎤:**
```
Usuario: [Presiona micrófono] "Gasté quinientos pesos en comida hoy"
Asistente: "✅ Perfecto! He registrado tu gasto de $500 en comida para hoy."

Usuario: [Presiona micrófono] "Cuánto he gastado este mes"
Asistente: "Este mes has gastado $4,500 en total, distribuido en..."
```

**Por texto ⌨️:**
```
Usuario: "Hola, ¿cuánto he gastado este mes?"
Asistente: "Este mes has gastado $X en total, distribuido en..."

Usuario: "Registra un gasto de $150 en transporte de hoy"
Asistente: "¿Podrías darme más detalles? Por ejemplo, ¿fue taxi, Uber, o gasolina?"

Usuario: "Analiza mis gastos de la última semana"
Asistente: "En la última semana gastaste $X, siendo las categorías principales..."
```

### Configuración Rápida

**Modo Desarrollo (Gratis)**:
```bash
OPENROUTER_API_KEY=tu_api_key
OPENROUTER_MODEL=deepseek/deepseek-r1-0528:free
OPENROUTER_SUPPORTS_TOOLS=false
```

**Modo Producción (De Pago)**:
```bash
OPENROUTER_API_KEY=tu_api_key
OPENROUTER_MODEL=openai/gpt-4o-mini
OPENROUTER_SUPPORTS_TOOLS=true
```

📖 **Guía Completa**: Ver [CHATBOT_CONFIG.md](./CHATBOT_CONFIG.md) para instrucciones detalladas

### Diferencias Entre Modos

| Característica | Modo Gratis | Modo Pago |
|---|---|---|
| Consejos financieros | ✅ | ✅ |
| Responder preguntas | ✅ | ✅ |
| Explicar conceptos | ✅ | ✅ |
| Crear transacciones | ❌ | ✅ |
| Consultar datos | ❌ | ✅ |
| Análisis de gastos | ❌ | ✅ |
| Costo | $0 | ~$0.01/100 msgs |

## 📝 Notas de Desarrollo

- El calendario del filtro personalizado necesita ajustes de alineación
- El sistema de notificaciones está planificado pero no implementado
- La funcionalidad de voz para el asistente está pendiente

## 🤝 Contribuciones

Este es un proyecto personal, pero las sugerencias son bienvenidas.

## 📄 Licencia

Proyecto privado - Todos los derechos reservados
