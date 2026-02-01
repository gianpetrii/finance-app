import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    'X-Title': 'Finance App',
  },
});

// Definir las herramientas (tools) que la IA puede llamar
const tools = [
  {
    type: 'function' as const,
    function: {
      name: 'get_transactions',
      description: 'Obtiene las transacciones del usuario filtradas por fecha o categoría',
      parameters: {
        type: 'object',
        properties: {
          startDate: {
            type: 'string',
            description: 'Fecha de inicio en formato ISO (opcional)',
          },
          endDate: {
            type: 'string',
            description: 'Fecha de fin en formato ISO (opcional)',
          },
          type: {
            type: 'string',
            enum: ['expense', 'income'],
            description: 'Tipo de transacción (opcional)',
          },
        },
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'create_transaction',
      description: 'Crea una nueva transacción (gasto o ingreso)',
      parameters: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            enum: ['expense', 'income'],
            description: 'Tipo de transacción',
          },
          amount: {
            type: 'number',
            description: 'Monto de la transacción',
          },
          category: {
            type: 'string',
            description: 'Categoría de la transacción',
          },
          description: {
            type: 'string',
            description: 'Descripción de la transacción',
          },
          date: {
            type: 'string',
            description: 'Fecha de la transacción en formato ISO (opcional, por defecto hoy)',
          },
        },
        required: ['type', 'amount', 'category', 'description'],
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'get_budget_summary',
      description: 'Obtiene un resumen del presupuesto y gastos actuales del usuario',
      parameters: {
        type: 'object',
        properties: {},
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'get_savings_goals',
      description: 'Obtiene las metas de ahorro del usuario',
      parameters: {
        type: 'object',
        properties: {},
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'analyze_spending',
      description: 'Analiza los patrones de gasto del usuario en un período',
      parameters: {
        type: 'object',
        properties: {
          period: {
            type: 'string',
            enum: ['week', 'month', 'year'],
            description: 'Período a analizar',
          },
        },
        required: ['period'],
      },
    },
  },
];

export async function POST(req: NextRequest) {
  try {
    const { messages, userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'Usuario no autenticado' },
        { status: 401 }
      );
    }

    // Crear el mensaje del sistema con contexto
    const systemMessage = {
      role: 'system',
      content: `Eres un asistente financiero personal inteligente y amigable llamado "Asesor Financiero".

Tu propósito es ayudar a los usuarios con sus finanzas personales:
- Responder preguntas sobre finanzas personales
- Dar consejos sobre ahorro y presupuesto
- Explicar conceptos financieros de forma clara
- Sugerir estrategias para mejorar la salud financiera
- Ayudar a planificar metas financieras

Características importantes:
- Hablas en español de forma natural y cercana
- Eres proactivo sugiriendo mejoras y consejos
- Explicas conceptos complejos de forma simple
- Usas emojis ocasionalmente para ser más amigable (💰 💵 📊 📈 ✅ 🎯)
- Eres positivo y motivador

Cuando el usuario te pregunte sobre:
- **Ahorro**: Sugiere la regla 50/30/20, fondos de emergencia, etc.
- **Presupuesto**: Recomienda categorizar gastos, establecer límites, revisar mensualmente
- **Deudas**: Aconseja métodos como bola de nieve o avalancha
- **Inversión**: Explica conceptos básicos, diversificación, riesgo vs retorno
- **Metas**: Ayuda a establecer metas SMART (específicas, medibles, alcanzables, relevantes, temporales)

Nota: Actualmente no puedes acceder a los datos financieros del usuario ni crear transacciones directamente. 
Guía al usuario para que use las funciones de la app (Dashboard, Transacciones, Metas, etc.) mientras le das consejos útiles.

Siempre sé útil, claro, positivo y educativo.`,
    };

    // Verificar si el modelo soporta tool calling
    const modelSupportsTools = process.env.OPENROUTER_SUPPORTS_TOOLS === 'true';

    // Llamar a OpenRouter
    const response = await openai.chat.completions.create({
      model: process.env.OPENROUTER_MODEL || 'deepseek/deepseek-r1-0528:free',
      messages: [systemMessage, ...messages],
      ...(modelSupportsTools && { tools: tools, tool_choice: 'auto' }),
      temperature: 0.7,
      max_tokens: 500,
    });

    const assistantMessage = response.choices[0].message;

    // Si el modelo soporta tools y la IA quiere llamar a una herramienta
    if (modelSupportsTools && assistantMessage.tool_calls && assistantMessage.tool_calls.length > 0) {
      const toolCall = assistantMessage.tool_calls[0];
      // Verificar que sea un tool call de función
      if (toolCall.type === 'function' && 'function' in toolCall) {
        return NextResponse.json({
          message: assistantMessage,
          needsFunctionCall: true,
          functionCall: {
            name: toolCall.function.name,
            arguments: JSON.parse(toolCall.function.arguments),
          },
        });
      }
    }

    // Respuesta normal
    return NextResponse.json({
      message: assistantMessage,
      needsFunctionCall: false,
    });
  } catch (error) {
    console.error('Error en chat API:', error);
    return NextResponse.json(
      { error: 'Error al procesar el mensaje' },
      { status: 500 }
    );
  }
}
