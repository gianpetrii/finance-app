'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Send, Loader2, Bot, User, Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/hooks/useAuth';
import { createTransaction, getTransactions } from '@/lib/firebase/collections';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useSpeechRecognition } from '@/lib/hooks/useSpeechRecognition';
import { toast } from 'sonner';

interface Message {
  role: 'user' | 'assistant' | 'function';
  content: string;
  timestamp: Date;
}

interface Transaction {
  id: string;
  date: any;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  [key: string]: any;
}

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatPanel({ isOpen, onClose }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: '¡Hola! 👋 Soy tu asistente financiero. Puedo ayudarte a registrar gastos, consultar tu presupuesto, analizar tus finanzas y responder cualquier pregunta. Puedes escribir o usar el micrófono para hablar. ¿En qué puedo ayudarte hoy?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  // Speech Recognition
  const {
    transcript,
    isListening,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
    error: speechError,
  } = useSpeechRecognition({
    continuous: true,
    language: 'es-ES',
  });

  // Auto-scroll al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Sincronizar transcript con input
  useEffect(() => {
    if (transcript) {
      setInput(transcript);
    }
  }, [transcript]);

  // Mostrar errores de reconocimiento de voz
  useEffect(() => {
    if (speechError) {
      toast.error(speechError);
    }
  }, [speechError]);

  // Mostrar mensaje de bienvenida si no hay soporte
  useEffect(() => {
    if (isOpen && !isSupported) {
      toast.error('Tu navegador no soporta reconocimiento de voz. Usa Chrome, Edge o Safari para esta función.');
    }
  }, [isOpen, isSupported]);

  // Ejecutar funciones llamadas por la IA
  const executeFunction = async (functionName: string, args: any) => {
    if (!user) return null;

    try {
      switch (functionName) {
        case 'get_transactions': {
          const transactions = await getTransactions(user.uid) as Transaction[];
          let filtered = transactions;

          if (args.startDate) {
            filtered = filtered.filter(t => new Date(t.date) >= new Date(args.startDate));
          }
          if (args.endDate) {
            filtered = filtered.filter(t => new Date(t.date) <= new Date(args.endDate));
          }
          if (args.type) {
            filtered = filtered.filter(t => t.type === args.type);
          }

          return {
            count: filtered.length,
            total: filtered.reduce((sum, t) => sum + t.amount, 0),
            transactions: filtered.slice(0, 10).map(t => ({
              date: format(new Date(t.date), 'dd/MM/yyyy'),
              type: t.type,
              amount: t.amount,
              category: t.category,
              description: t.description,
            })),
          };
        }

        case 'create_transaction': {
          const transactionId = await createTransaction(user.uid, {
            type: args.type,
            amount: args.amount,
            category: args.category,
            description: args.description,
            date: args.date || new Date().toISOString(),
            paymentMethod: 'cash',
          });
          return {
            success: true,
            transaction: {
              id: transactionId,
              ...args,
            },
          };
        }

        case 'get_budget_summary': {
          const transactions = await getTransactions(user.uid) as Transaction[];
          const now = new Date();
          const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
          
          const monthTransactions = transactions.filter(
            t => new Date(t.date) >= startOfMonth
          );

          const expenses = monthTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

          const income = monthTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

          return {
            month: format(now, 'MMMM yyyy', { locale: es }),
            totalIncome: income,
            totalExpenses: expenses,
            balance: income - expenses,
            transactionCount: monthTransactions.length,
          };
        }

        case 'get_savings_goals': {
          // Por ahora retornamos un mensaje, luego conectamos con Firestore
          return {
            message: 'Funcionalidad de metas de ahorro en desarrollo',
          };
        }

        case 'analyze_spending': {
          const transactions = await getTransactions(user.uid) as Transaction[];
          const now = new Date();
          let startDate: Date;

          switch (args.period) {
            case 'week':
              startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
              break;
            case 'month':
              startDate = new Date(now.getFullYear(), now.getMonth(), 1);
              break;
            case 'year':
              startDate = new Date(now.getFullYear(), 0, 1);
              break;
            default:
              startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          }

          const periodTransactions = transactions.filter(
            t => t.type === 'expense' && new Date(t.date) >= startDate
          );

          const byCategory = periodTransactions.reduce((acc, t) => {
            acc[t.category] = (acc[t.category] || 0) + t.amount;
            return acc;
          }, {} as Record<string, number>);

          const topCategories = Object.entries(byCategory)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5);

          return {
            period: args.period,
            totalSpent: periodTransactions.reduce((sum, t) => sum + t.amount, 0),
            transactionCount: periodTransactions.length,
            averagePerTransaction: periodTransactions.length > 0
              ? periodTransactions.reduce((sum, t) => sum + t.amount, 0) / periodTransactions.length
              : 0,
            topCategories: topCategories.map(([cat, amount]) => ({
              category: cat,
              amount,
            })),
          };
        }

        default:
          return { error: 'Función no reconocida' };
      }
    } catch (error) {
      console.error('Error ejecutando función:', error);
      return { error: 'Error al ejecutar la función' };
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading || !user) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Preparar mensajes para la API
      const apiMessages = messages.map(m => ({
        role: m.role,
        content: m.content,
      }));
      apiMessages.push({ role: 'user', content: input });

      // Llamar a la API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: apiMessages,
          userId: user.uid,
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Si la IA quiere llamar a una función
      if (data.needsFunctionCall) {
        const functionResult = await executeFunction(
          data.functionCall.name,
          data.functionCall.arguments
        );

        // Llamar de nuevo a la API con el resultado de la función
        const secondResponse = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [
              ...apiMessages,
              data.message,
              {
                role: 'function',
                name: data.functionCall.name,
                content: JSON.stringify(functionResult),
              },
            ],
            userId: user.uid,
          }),
        });

        const secondData = await secondResponse.json();
        
        const assistantMessage: Message = {
          role: 'assistant',
          content: secondData.message.content,
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, assistantMessage]);
      } else {
        // Respuesta normal sin función
        const assistantMessage: Message = {
          role: 'assistant',
          content: data.message.content,
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error('Error en chat:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Lo siento, hubo un error al procesar tu mensaje. Por favor intenta de nuevo.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleMicrophone = () => {
    if (isListening) {
      stopListening();
    } else {
      resetTranscript();
      setInput('');
      startListening();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-0 right-0 w-full sm:w-96 sm:bottom-6 sm:right-6 h-[600px] sm:h-[700px] bg-background border sm:rounded-lg shadow-2xl z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-primary text-primary-foreground sm:rounded-t-lg">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          <h2 className="font-semibold">Asistente Financiero</h2>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-primary-foreground hover:bg-primary-foreground/20 h-8 w-8"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          message.role !== 'function' && (
            <div
              key={index}
              className={`flex gap-3 ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.role === 'assistant' && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <Bot className="h-4 w-4 text-primary-foreground" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {format(message.timestamp, 'HH:mm')}
                </p>
              </div>
              {message.role === 'user' && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          )
        ))}
        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <Bot className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="bg-muted rounded-lg p-3">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t bg-background">
        {/* Indicador de grabación */}
        {isListening && (
          <div className="mb-2 flex items-center gap-2 text-sm text-primary animate-pulse">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="font-medium">Escuchando... Habla ahora</span>
          </div>
        )}
        
        <div className="flex gap-2">
          {/* Botón de micrófono */}
          {isSupported && (
            <Button
              onClick={toggleMicrophone}
              disabled={isLoading}
              size="icon"
              variant={isListening ? "destructive" : "outline"}
              className={isListening ? "animate-pulse" : ""}
              title={isListening ? "Detener grabación" : "Grabar mensaje de voz"}
            >
              {isListening ? (
                <MicOff className="h-4 w-4" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </Button>
          )}

          {/* Input de texto */}
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isListening ? "Transcribiendo..." : "Escribe o usa el micrófono..."}
            disabled={isLoading || isListening}
            className="flex-1"
          />

          {/* Botón de enviar */}
          <Button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            size="icon"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

