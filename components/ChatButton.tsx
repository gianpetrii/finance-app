'use client';

import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ChatPanel from './ChatPanel';

export default function ChatButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Botón flotante */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-24 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all z-40"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {/* Panel del chat */}
      <ChatPanel isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}

