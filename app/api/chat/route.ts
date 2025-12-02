import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Definir las funciones que la IA puede llamar
const functions = [
  {
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
  {
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
  {
    name: 'get_budget_summary',
    description: 'Obtiene un resumen del presupuesto y gastos actuales del usuario',
    parameters: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_savings_goals',
    description: 'Obtiene las metas de ahorro del usuario',
    parameters: {
      type: 'object',
      properties: {},
    },
  },
  {
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
      content: `Eres un asistente financiero personal inteligente y amigable. Tu nombre es "Asesor Financiero".

Ayudas a los usuarios a:
- Registrar gastos e ingresos de forma conversacional
- Consultar su información financiera
- Analizar sus patrones de gasto
- Dar consejos y recomendaciones personalizadas
- Responder preguntas sobre sus finanzas

Características importantes:
- Hablas en español de forma natural y cercana
- Eres proactivo sugiriendo mejoras
- Confirmas las acciones antes de ejecutarlas
- Explicas los análisis de forma clara
- Usas emojis ocasionalmente para ser más amigable (💰 💵 📊 📈 ✅)

Cuando el usuario te pida registrar un gasto o ingreso:
1. Extrae la información (monto, categoría, descripción)
2. Si falta información, pregunta de forma natural
3. Confirma antes de crear la transacción
4. Usa la función create_transaction cuando tengas todo

Categorías válidas para gastos: food, transport, entertainment, health, education, shopping, bills, other
Categorías válidas para ingresos: salary, freelance, investment, gift, other

Siempre sé útil, claro y positivo.`,
    };

    // Llamar a OpenAI con function calling
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [systemMessage, ...messages],
      functions: functions,
      function_call: 'auto',
      temperature: 0.7,
      max_tokens: 500,
    });

    const assistantMessage = response.choices[0].message;

    // Si la IA quiere llamar a una función
    if (assistantMessage.function_call) {
      return NextResponse.json({
        message: assistantMessage,
        needsFunctionCall: true,
        functionCall: {
          name: assistantMessage.function_call.name,
          arguments: JSON.parse(assistantMessage.function_call.arguments),
        },
      });
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
