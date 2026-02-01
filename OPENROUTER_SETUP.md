# 🤖 Configuración de OpenRouter para el Chatbot

Este proyecto usa OpenRouter para el chatbot de asistencia financiera, lo que permite acceder a múltiples modelos de IA (incluyendo opciones gratuitas).

## 📋 Pasos de Configuración

### 1. Obtener tu API Key de OpenRouter

1. Ve a [OpenRouter](https://openrouter.ai/)
2. Crea una cuenta o inicia sesión
3. Ve a la sección de API Keys
4. Genera una nueva API Key
5. Copia la key (guárdala en un lugar seguro)

### 2. Configurar Variables de Entorno

Crea o edita tu archivo `.env.local` en la raíz del proyecto:

```bash
# Firebase Configuration (ya existente)
NEXT_PUBLIC_FIREBASE_API_KEY=tu_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=tu_measurement_id

# OpenRouter Configuration (NUEVO)
OPENROUTER_API_KEY=tu_openrouter_api_key_aqui
OPENROUTER_MODEL=deepseek/deepseek-r1-0528:free
OPENROUTER_SUPPORTS_TOOLS=false
```

**Nota sobre `OPENROUTER_SUPPORTS_TOOLS`:**
- `false`: El modelo solo responde preguntas (sin acceso a funciones de la app)
- `true`: El modelo puede ejecutar funciones como crear transacciones, consultar datos, etc.
  - Solo funciona con modelos que soporten tool calling (generalmente modelos de pago)

### 3. Modelos Disponibles

#### Modelos Gratuitos Recomendados:
- `deepseek/deepseek-r1-0528:free` - Modelo gratuito de DeepSeek (recomendado, **NO soporta tools**)
- `meta-llama/llama-3.2-3b-instruct:free` - Llama 3.2 gratuito (**NO soporta tools**)
- `google/gemma-2-9b-it:free` - Gemma 2 gratuito (**NO soporta tools**)

**Nota**: Los modelos gratuitos generalmente NO soportan tool calling. Esto significa que el chatbot puede responder preguntas y dar consejos, pero no puede ejecutar acciones en la app (como crear transacciones o consultar datos).

#### Modelos de Pago con Tool Calling:
Si necesitas que el chatbot ejecute funciones (crear transacciones, consultar datos, etc.), necesitas un modelo que soporte tool calling:

- `openai/gpt-4o-mini` - Modelo económico de OpenAI (**Soporta tools**, ~$0.15/1M tokens)
- `anthropic/claude-3-haiku` - Claude Haiku (**Soporta tools**, ~$0.25/1M tokens)
- `meta-llama/llama-3.1-70b-instruct` - Llama 3.1 70B (**Soporta tools**, ~$0.80/1M tokens)

Para ver todos los modelos y sus capacidades: [OpenRouter Models](https://openrouter.ai/models)

**Para habilitar tool calling con estos modelos:**
```bash
OPENROUTER_MODEL=openai/gpt-4o-mini
OPENROUTER_SUPPORTS_TOOLS=true
```

### 4. Cambiar de Modelo

Para cambiar el modelo, simplemente actualiza la variable `OPENROUTER_MODEL` en tu `.env.local`:

```bash
# Ejemplo: Cambiar a Llama 3.2
OPENROUTER_MODEL=meta-llama/llama-3.2-3b-instruct:free

# Ejemplo: Cambiar a GPT-4o Mini (de pago)
OPENROUTER_MODEL=openai/gpt-4o-mini
```

### 5. Reiniciar el Servidor

Después de configurar las variables de entorno, reinicia el servidor de desarrollo:

```bash
npm run dev
```

## 🔍 Verificación

Para verificar que todo funciona:

1. Inicia sesión en la aplicación
2. Abre el chatbot
3. Envía un mensaje de prueba como "Hola"
4. Deberías recibir una respuesta del asistente

## 💡 Notas Importantes

- **API Key Segura**: Nunca compartas tu API key ni la subas a repositorios públicos
- **Límites Gratuitos**: Los modelos gratuitos tienen límites de uso. Revisa [OpenRouter Limits](https://openrouter.ai/docs#limits)
- **Costos**: Si usas modelos de pago, revisa los precios en [OpenRouter Pricing](https://openrouter.ai/docs#pricing)
- **Function Calling**: No todos los modelos soportan function calling. Los modelos recomendados arriba sí lo soportan.

## 🆘 Solución de Problemas

### Error: "API Key no válida"
- Verifica que copiaste correctamente la API key
- Asegúrate de que la variable se llame `OPENROUTER_API_KEY`
- Reinicia el servidor después de agregar la key

### Error: "Modelo no encontrado"
- Verifica que el nombre del modelo esté correcto
- Consulta la lista de modelos disponibles en OpenRouter
- Algunos modelos pueden requerir acceso especial

### El chatbot no responde
- Revisa la consola del navegador para errores
- Verifica que el servidor esté corriendo
- Asegúrate de estar autenticado en la aplicación

## 📚 Recursos

- [OpenRouter Documentation](https://openrouter.ai/docs)
- [OpenRouter Models](https://openrouter.ai/models)
- [OpenRouter API Reference](https://openrouter.ai/docs#api-reference)
