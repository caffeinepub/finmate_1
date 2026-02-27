import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot } from 'lucide-react';
import { useAIChatbot } from '../hooks/useAIChatbot';

interface AIChatbotOverlayProps {
  onClose: () => void;
}

const QUICK_REPLIES = [
  { label: '📊 Spending Insights', query: 'Show my spending insights' },
  { label: '💰 Investment Tips', query: 'Give me investment suggestions' },
  { label: '⚠️ Budget Check', query: 'Check my budget status' },
  { label: '🎯 Goal Tracking', query: 'Show my financial goals' },
  { label: '📈 Credit Score', query: 'How can I improve my credit score?' },
  { label: '💵 Income Analysis', query: 'Analyze my income and savings' },
];

function renderContent(content: string) {
  const lines = content.split('\n');
  return lines.map((line, idx) => {
    if (line === '') return <br key={idx} />;
    const parts = line.split(/\*\*(.*?)\*\*/g);
    return (
      <p key={idx} className="leading-relaxed">
        {parts.map((part, i) =>
          i % 2 === 1 ? <strong key={i}>{part}</strong> : part
        )}
      </p>
    );
  });
}

export default function AIChatbotOverlay({ onClose }: AIChatbotOverlayProps) {
  const [input, setInput] = useState('');
  const { messages, isTyping, sendMessage } = useAIChatbot();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const msg = input.trim();
    setInput('');
    await sendMessage(msg);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end p-4 pointer-events-none">
      <div
        className="w-full max-w-sm bg-card border border-border/50 rounded-3xl shadow-2xl flex flex-col pointer-events-auto"
        style={{ height: '520px', maxHeight: 'calc(100vh - 120px)' }}
      >
        {/* Header */}
        <div
          className="flex items-center gap-3 p-4 border-b border-border/50 rounded-t-3xl flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #7C3AED, #3B82F6)' }}
        >
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center overflow-hidden flex-shrink-0">
            <img
              src="/assets/generated/ai-avatar.dim_96x96.png"
              alt="AI"
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          </div>
          <div className="flex-1">
            <h3 className="text-white font-semibold text-sm">FinMate AI</h3>
            <p className="text-white/70 text-xs">Your finance assistant</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <X size={16} className="text-white" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} gap-2`}
            >
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot size={14} className="text-primary" />
                </div>
              )}
              <div className={msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-bot'}>
                <div className="text-sm space-y-0.5">
                  {renderContent(msg.content)}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start gap-2">
              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Bot size={14} className="text-primary" />
              </div>
              <div className="chat-bubble-bot flex items-center gap-1 py-3">
                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Replies */}
        <div className="px-4 pb-2 flex-shrink-0">
          <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
            {QUICK_REPLIES.map(q => (
              <button
                key={q.label}
                onClick={() => sendMessage(q.query)}
                className="flex-shrink-0 text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-full hover:bg-primary/20 transition-colors font-medium"
              >
                {q.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="p-4 pt-2 border-t border-border/50 flex-shrink-0">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about your finances..."
              className="flex-1 bg-secondary rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30 transition-all"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="w-10 h-10 rounded-xl flex items-center justify-center disabled:opacity-50 transition-all active:scale-95"
              style={{ background: 'linear-gradient(135deg, #7C3AED, #3B82F6)' }}
            >
              <Send size={16} className="text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
