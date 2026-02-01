# 🤖 Configuración Rápida del Chatbot

Esta guía te ayuda a configurar el chatbot de forma simple, eligiendo entre dos modos según tus necesidades.

## 🎯 Dos Modos de Operación

### 🆓 Modo Desarrollo (Gratuito)
**Ideal para**: Desarrollo, pruebas, demos, uso personal

**Características**:
- ✅ Costo: $0 (completamente gratis)
- ✅ Consejos financieros inteligentes
- ✅ Responde preguntas sobre finanzas
- ✅ Explica conceptos financieros
- ✅ Sugiere estrategias de ahorro
- ❌ NO puede crear transacciones automáticamente
- ❌ NO puede consultar tus datos de la app

**Configuración en `.env.local`**:
```bash
OPENROUTER_API_KEY=tu_api_key_aqui
OPENROUTER_MODEL=deepseek/deepseek-r1-0528:free
OPENROUTER_SUPPORTS_TOOLS=false
```

---

### 💰 Modo Producción (De Pago)
**Ideal para**: Aplicación en producción con usuarios reales

**Características**:
- ✅ Todo lo del modo gratuito MÁS:
- ✅ Crear transacciones por voz/texto
- ✅ Consultar tus gastos e ingresos
- ✅ Analizar patrones de gasto
- ✅ Obtener resúmenes de presupuesto
- ✅ Consultar metas de ahorro
- 💵 Costo: ~$0.01-0.02 por 100 mensajes

**Configuración en `.env.local`**:
```bash
OPENROUTER_API_KEY=tu_api_key_aqui
OPENROUTER_MODEL=openai/gpt-4o-mini
OPENROUTER_SUPPORTS_TOOLS=true
```

---

## 🚀 Guía de Configuración Paso a Paso

### Paso 1: Obtener tu API Key

1. Ve a [OpenRouter](https://openrouter.ai/)
2. Crea una cuenta o inicia sesión
3. Ve a la sección de API Keys
4. Genera una nueva API Key
5. Copia la key

### Paso 2: Configurar el Modo

Edita tu archivo `.env.local` en la raíz del proyecto:

#### Para Modo Desarrollo (Gratis):
```bash
# Firebase (ya lo tienes configurado)
NEXT_PUBLIC_FIREBASE_API_KEY=...
# ... resto de Firebase

# Chatbot - Modo Desarrollo
OPENROUTER_API_KEY=tu_api_key_aqui
OPENROUTER_MODEL=deepseek/deepseek-r1-0528:free
OPENROUTER_SUPPORTS_TOOLS=false
```

#### Para Modo Producción (De Pago):
```bash
# Firebase (ya lo tienes configurado)
NEXT_PUBLIC_FIREBASE_API_KEY=...
# ... resto de Firebase

# Chatbot - Modo Producción
OPENROUTER_API_KEY=tu_api_key_aqui
OPENROUTER_MODEL=openai/gpt-4o-mini
OPENROUTER_SUPPORTS_TOOLS=true
```

### Paso 3: Reiniciar el Servidor

```bash
npm run dev
```

### Paso 4: Probar el Chatbot

1. Inicia sesión en la aplicación
2. Abre el chatbot (botón en la esquina inferior derecha)
3. Prueba con mensajes como:
   - "Hola, ¿cómo puedo ahorrar más dinero?"
   - "¿Qué es la regla 50/30/20?"
   - "Dame consejos para crear un presupuesto"

---

## 🔄 Cambiar Entre Modos

Para cambiar de modo, simplemente edita las 2 líneas en tu `.env.local`:

```bash
# Cambiar de Desarrollo a Producción:
# ANTES:
OPENROUTER_MODEL=deepseek/deepseek-r1-0528:free
OPENROUTER_SUPPORTS_TOOLS=false

# DESPUÉS:
OPENROUTER_MODEL=openai/gpt-4o-mini
OPENROUTER_SUPPORTS_TOOLS=true
```

Luego reinicia el servidor con `npm run dev`.

---

## 💡 Recomendaciones

### Para Desarrollo:
- ✅ Usa el modo gratuito
- ✅ Es perfecto para probar la interfaz del chatbot
- ✅ Los usuarios pueden recibir consejos útiles sin costo

### Para Producción:
- ✅ Evalúa si necesitas tool calling (crear transacciones automáticamente)
- ✅ Si solo necesitas consejos, el modo gratuito es suficiente
- ✅ Si quieres la experiencia completa, usa el modo de pago

### Estrategia Híbrida:
- 🎯 Lanza con el modo gratuito
- 🎯 Evalúa el uso y feedback de usuarios
- 🎯 Migra a modo de pago cuando veas valor en las funciones avanzadas

---

## 💰 Estimación de Costos (Modo Producción)

Con `gpt-4o-mini`:
- **10 usuarios activos**: ~$1-2/mes
- **100 usuarios activos**: ~$10-20/mes
- **1000 usuarios activos**: ~$100-200/mes

*Basado en ~50 mensajes por usuario por mes*

---

## 🆘 Solución de Problemas

### El chatbot no responde
1. Verifica que `OPENROUTER_API_KEY` esté configurada correctamente
2. Reinicia el servidor después de cambiar `.env.local`
3. Revisa la consola del navegador para errores

### Error: "No endpoints found that support tool use"
- Estás usando un modelo gratuito con `OPENROUTER_SUPPORTS_TOOLS=true`
- Solución: Cambia a `OPENROUTER_SUPPORTS_TOOLS=false`

### El chatbot no puede crear transacciones
- Esto es normal en modo desarrollo (gratuito)
- Para habilitar esta función, cambia a modo producción

---

## 📚 Más Información

Para detalles técnicos completos, consulta: [OPENROUTER_SETUP.md](./OPENROUTER_SETUP.md)
