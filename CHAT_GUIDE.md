# 🤖 Guía del Chat con Asistente Financiero

## 📋 Descripción

El asistente financiero es un chatbot inteligente impulsado por OpenAI GPT-4o-mini que te ayuda a gestionar tus finanzas de manera conversacional. Puede acceder a todos tus datos financieros, registrar transacciones, analizar patrones de gasto y darte recomendaciones personalizadas.

## 🎯 Funcionalidades Principales

### 1. Consultar Transacciones
El asistente puede buscar y filtrar tus transacciones por fecha, tipo o categoría.

**Ejemplos:**
- "¿Cuáles fueron mis gastos de esta semana?"
- "Muéstrame mis ingresos del mes pasado"
- "¿Cuánto gasté en comida este mes?"

### 2. Crear Transacciones
Puedes registrar gastos e ingresos de forma conversacional.

**Ejemplos:**
- "Registra un gasto de $500 en comida de hoy"
- "Anota un ingreso de $2000 por freelance"
- "Gasté $150 en transporte ayer"

**Categorías válidas:**
- **Gastos**: food, transport, entertainment, health, education, shopping, bills, other
- **Ingresos**: salary, freelance, investment, gift, other

### 3. Consultar Resumen de Presupuesto
Obtén un resumen de tus ingresos, gastos y balance actual.

**Ejemplos:**
- "¿Cómo va mi presupuesto este mes?"
- "¿Cuánto he gastado en total?"
- "¿Cuál es mi balance actual?"

### 4. Analizar Patrones de Gasto
El asistente puede analizar tus gastos en diferentes períodos.

**Ejemplos:**
- "Analiza mis gastos de la última semana"
- "¿En qué categoría gasto más?"
- "¿Cuál es mi promedio de gasto diario?"

### 5. Consultar Metas de Ahorro
(Funcionalidad en desarrollo)

**Ejemplos:**
- "¿Cómo van mis metas de ahorro?"
- "¿Cuánto me falta para mi meta de vacaciones?"

## 💬 Ejemplos de Conversaciones

### Ejemplo 1: Registrar un Gasto
```
Usuario: Hola, gasté $250 en el supermercado hoy
Asistente: ¡Entendido! Voy a registrar un gasto de $250 en comida para hoy. ¿Es correcto?
Usuario: Sí, perfecto
Asistente: ✅ Listo! He registrado tu gasto de $250 en comida para hoy.
```

### Ejemplo 2: Consultar Gastos
```
Usuario: ¿Cuánto he gastado este mes?
Asistente: Este mes has gastado $4,500 en total, distribuido de la siguiente manera:
- Comida: $1,200
- Transporte: $800
- Entretenimiento: $600
- Servicios: $1,500
- Otros: $400

Tu balance actual es de $2,500 (ingresos: $7,000 - gastos: $4,500).
```

### Ejemplo 3: Análisis de Gastos
```
Usuario: Analiza mis gastos de la última semana
Asistente: En la última semana has gastado $1,150:

📊 Categorías principales:
1. Comida: $450 (39%)
2. Transporte: $300 (26%)
3. Entretenimiento: $250 (22%)
4. Otros: $150 (13%)

💡 Recomendación: Tus gastos en comida están por encima del promedio. Considera planificar tus comidas para reducir gastos innecesarios.
```

## 🎨 Interfaz del Chat

### Ubicación
El chat aparece como un **botón flotante** con un ícono de mensaje en la **esquina inferior derecha** de la pantalla.

### Características de la UI
- **Panel deslizable**: Se abre desde la derecha en desktop, pantalla completa en móvil
- **Historial de mensajes**: Mantiene el contexto de la conversación
- **Indicador de escritura**: Muestra cuando el asistente está procesando
- **Timestamps**: Cada mensaje muestra la hora de envío
- **Auto-scroll**: Se desplaza automáticamente al último mensaje
- **🎤 Reconocimiento de voz**: Botón de micrófono para hablar directamente
- **Transcripción en tiempo real**: Muestra lo que estás diciendo mientras hablas
- **Indicador de grabación**: Animación visual cuando está escuchando

## ⚙️ Configuración Técnica

### Variables de Entorno Requeridas
```env
# Solo en servidor (más seguro)
OPENAI_API_KEY=sk-your-openai-api-key
```

**Nota de Seguridad**: La API key ahora solo se usa en el servidor (API routes), no se expone al cliente.

### Obtener API Key de OpenAI
1. Ve a https://platform.openai.com/signup
2. Crea una cuenta o inicia sesión
3. Ve a https://platform.openai.com/api-keys
4. Haz clic en "Create new secret key"
5. Copia la key y agrégala a tu `.env.local`

### Modelo Utilizado
- **Modelo**: GPT-4o-mini
- **Costo aproximado**: ~$0.15 por millón de tokens de entrada
- **Temperatura**: 0.7 (balance entre creatividad y precisión)
- **Max tokens**: 500 por respuesta

## 🔒 Seguridad y Privacidad

- ✅ Solo accede a los datos del usuario autenticado
- ✅ No comparte información entre usuarios
- ✅ Las conversaciones no se almacenan permanentemente
- ✅ Requiere autenticación de Firebase para funcionar
- ✅ La API key está protegida en el servidor (no expuesta al cliente)
- ✅ Todas las llamadas a OpenAI se hacen desde el backend

## 🎤 Cómo Usar el Reconocimiento de Voz

### Paso a Paso
1. **Abre el chat** haciendo clic en el botón flotante
2. **Haz clic en el botón del micrófono** 🎤 (a la izquierda del input)
3. **Habla claramente** tu mensaje (ej: "Gasté quinientos pesos en comida hoy")
4. **Observa la transcripción** aparecer en tiempo real en el input
5. **Haz clic de nuevo en el micrófono** para detener la grabación
6. **Haz clic en enviar** o edita el texto si es necesario

### Consejos para Mejor Precisión
- 🎯 Habla de forma clara y pausada
- 🔇 Evita ambientes ruidosos
- 📱 Usa Chrome, Edge o Safari (mejor soporte)
- 🇪🇸 El sistema está optimizado para español
- ✅ Puedes editar el texto transcrito antes de enviar

### Indicadores Visuales
- **Botón gris** 🎤: Listo para grabar
- **Botón rojo pulsante** 🔴: Grabando activamente
- **Texto "Escuchando..."**: Confirmación de que está grabando
- **Input deshabilitado**: Mientras graba, no puedes escribir

## 🚀 Próximas Mejoras

- [x] Soporte para comandos por voz ✅
- [ ] Historial de conversaciones persistente
- [ ] Sugerencias automáticas de ahorro
- [ ] Notificaciones proactivas
- [ ] Integración con metas de ahorro
- [ ] Análisis predictivo de gastos
- [ ] Exportación de conversaciones
- [ ] Modo offline con respuestas básicas
- [ ] Respuestas por voz (Text-to-Speech)

## 🐛 Solución de Problemas

### El chat no responde
1. Verifica que la API key de OpenAI esté configurada correctamente
2. Revisa la consola del navegador para errores
3. Asegúrate de estar autenticado en la aplicación

### Errores de API
- **401 Unauthorized**: API key inválida o expirada
- **429 Too Many Requests**: Has excedido el límite de requests de OpenAI
- **500 Server Error**: Error en el servidor, intenta de nuevo

### El asistente no entiende mis comandos
- Sé más específico en tus solicitudes
- Usa frases completas en lugar de palabras sueltas
- Especifica fechas, montos y categorías claramente

### El micrófono no funciona
- **No aparece el botón**: Tu navegador no soporta Web Speech API. Usa Chrome, Edge o Safari
- **Pide permisos**: Acepta los permisos de micrófono cuando el navegador lo solicite
- **No transcribe**: Verifica que tu micrófono esté funcionando en otras apps
- **Transcripción incorrecta**: Habla más despacio y claro, evita ruido de fondo
- **Error "not-allowed"**: Ve a configuración del navegador y permite el acceso al micrófono para este sitio

## 📞 Soporte

Para reportar problemas o sugerir mejoras, contacta al equipo de desarrollo.

---

**Última actualización**: Noviembre 2025
**Versión**: 1.0.0

