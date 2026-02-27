import React, { useState, useRef, useEffect } from 'react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { Send, Bot, User, TrendingUp, TrendingDown, DollarSign, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAIChatbot } from '../hooks/useAIChatbot';

const PERIOD_OPTIONS = ['Weekly', 'Monthly', 'Yearly'] as const;
type Period = typeof PERIOD_OPTIONS[number];

const CATEGORY_COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6'];

const DEMO_DATA: Record<Period, { pie: { name: string; value: number }[]; bar: { month: string; spending: number; income: number }[] }> = {
  Weekly: {
    pie: [
      { name: 'Food', value: 1200 },
      { name: 'Transport', value: 800 },
      { name: 'Shopping', value: 600 },
      { name: 'Entertainment', value: 400 },
      { name: 'Utilities', value: 300 },
      { name: 'Health', value: 200 },
    ],
    bar: [
      { month: 'Mon', spending: 450, income: 0 },
      { month: 'Tue', spending: 320, income: 0 },
      { month: 'Wed', spending: 580, income: 2000 },
      { month: 'Thu', spending: 290, income: 0 },
      { month: 'Fri', spending: 720, income: 0 },
      { month: 'Sat', spending: 890, income: 0 },
      { month: 'Sun', spending: 340, income: 0 },
    ],
  },
  Monthly: {
    pie: [
      { name: 'Food', value: 4800 },
      { name: 'Transport', value: 3200 },
      { name: 'Shopping', value: 5600 },
      { name: 'Entertainment', value: 2100 },
      { name: 'Utilities', value: 1800 },
      { name: 'Health', value: 900 },
      { name: 'College', value: 3500 },
      { name: 'Other', value: 1200 },
    ],
    bar: [
      { month: 'Jan', spending: 18000, income: 45000 },
      { month: 'Feb', spending: 22000, income: 45000 },
      { month: 'Mar', spending: 19500, income: 47000 },
      { month: 'Apr', spending: 25000, income: 45000 },
      { month: 'May', spending: 21000, income: 48000 },
      { month: 'Jun', spending: 23500, income: 45000 },
    ],
  },
  Yearly: {
    pie: [
      { name: 'Food', value: 58000 },
      { name: 'Transport', value: 38000 },
      { name: 'Shopping', value: 67000 },
      { name: 'Entertainment', value: 25000 },
      { name: 'Utilities', value: 21000 },
      { name: 'Health', value: 11000 },
      { name: 'College', value: 42000 },
      { name: 'Other', value: 14000 },
    ],
    bar: [
      { month: '2020', spending: 180000, income: 420000 },
      { month: '2021', spending: 210000, income: 480000 },
      { month: '2022', spending: 245000, income: 520000 },
      { month: '2023', spending: 228000, income: 560000 },
      { month: '2024', spending: 265000, income: 600000 },
      { month: '2025', spending: 290000, income: 640000 },
    ],
  },
};

const QUICK_REPLIES = [
  'Analyze my spending',
  'Investment tips',
  'How to save more?',
  'Credit score advice',
  'Budget planning',
  'SIP recommendations',
];

function formatINR(val: number) {
  if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
  if (val >= 1000) return `₹${(val / 1000).toFixed(1)}K`;
  return `₹${val}`;
}

export default function Analytics() {
  const [period, setPeriod] = useState<Period>('Monthly');
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, isTyping } = useAIChatbot();

  const data = DEMO_DATA[period];
  const totalSpending = data.pie.reduce((s, d) => s + d.value, 0);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!chatInput.trim()) return;
    sendMessage(chatInput.trim());
    setChatInput('');
  };

  const handleQuickReply = (text: string) => {
    sendMessage(text);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-primary text-primary-foreground px-4 pt-12 pb-6">
        <h1 className="text-xl font-bold">Analytics</h1>
        <p className="text-primary-foreground/70 text-sm mt-1">Track your financial health</p>

        {/* Period Selector */}
        <div className="flex gap-2 mt-4">
          {PERIOD_OPTIONS.map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                period === p
                  ? 'bg-primary-foreground text-primary'
                  : 'bg-primary-foreground/10 text-primary-foreground/80 hover:bg-primary-foreground/20'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-4 space-y-5">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-card rounded-2xl border border-border p-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingDown className="w-4 h-4 text-destructive" />
              <span className="text-xs text-muted-foreground">Total Spent</span>
            </div>
            <p className="text-xl font-bold text-foreground">{formatINR(totalSpending)}</p>
            <p className="text-xs text-destructive mt-1">↑ 8.2% vs last period</p>
          </div>
          <div className="bg-card rounded-2xl border border-border p-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-xs text-muted-foreground">Savings Rate</span>
            </div>
            <p className="text-xl font-bold text-foreground">32%</p>
            <p className="text-xs text-green-500 mt-1">↑ 3.1% vs last period</p>
          </div>
          <div className="bg-card rounded-2xl border border-border p-4">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground">Avg Daily Spend</span>
            </div>
            <p className="text-xl font-bold text-foreground">
              {formatINR(Math.round(totalSpending / (period === 'Weekly' ? 7 : period === 'Monthly' ? 30 : 365)))}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Per day average</p>
          </div>
          <div className="bg-card rounded-2xl border border-border p-4">
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-4 h-4 text-amber-500" />
              <span className="text-xs text-muted-foreground">Budget Used</span>
            </div>
            <p className="text-xl font-bold text-foreground">68%</p>
            <p className="text-xs text-amber-500 mt-1">{formatINR(Math.round(totalSpending * 0.32))} remaining</p>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-card rounded-2xl border border-border p-4">
          <h3 className="font-semibold text-foreground mb-3">Spending by Category</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={data.pie}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
              >
                {data.pie.map((_, index) => (
                  <Cell key={index} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(val: number) => formatINR(val)} />
              <Legend iconType="circle" iconSize={8} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="bg-card rounded-2xl border border-border p-4">
          <h3 className="font-semibold text-foreground mb-3">
            {period === 'Weekly' ? 'Daily' : period === 'Monthly' ? 'Monthly' : 'Yearly'} Trend
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data.bar} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={formatINR} />
              <Tooltip formatter={(val: number) => formatINR(val)} />
              <Bar dataKey="spending" fill="#6366f1" radius={[4, 4, 0, 0]} name="Spending" />
              {period !== 'Weekly' && (
                <Bar dataKey="income" fill="#22c55e" radius={[4, 4, 0, 0]} name="Income" />
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Breakdown */}
        <div className="bg-card rounded-2xl border border-border p-4">
          <h3 className="font-semibold text-foreground mb-3">Category Analysis</h3>
          <div className="space-y-3">
            {data.pie.map((cat, i) => {
              const pct = Math.round((cat.value / totalSpending) * 100);
              return (
                <div key={cat.name}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-foreground">{cat.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{pct}%</span>
                      <span className="text-sm font-semibold text-foreground">{formatINR(cat.value)}</span>
                    </div>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: CATEGORY_COLORS[i % CATEGORY_COLORS.length] }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Chatbot */}
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <div className="bg-primary px-4 py-3 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-primary-foreground/20 flex items-center justify-center">
              <img src="/assets/generated/ai-avatar.dim_96x96.png" alt="AI" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-primary-foreground font-semibold text-sm">FinMate AI Analyst</p>
              <p className="text-primary-foreground/60 text-xs">Powered by smart insights</p>
            </div>
            <div className="ml-auto w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          </div>

          {/* Messages */}
          <ScrollArea className="h-64 px-4 py-3">
            <div className="space-y-3">
              {messages.length === 0 && (
                <div className="flex gap-2">
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                  <div className="bg-muted rounded-2xl rounded-tl-none px-3 py-2 max-w-[80%]">
                    <p className="text-sm text-foreground">Hi! I'm your AI Financial Analyst. Ask me about your spending, investments, savings, or credit score. How can I help you today?</p>
                  </div>
                </div>
              )}
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-primary' : 'bg-primary/10'}`}>
                    {msg.role === 'user' ? <User className="w-4 h-4 text-primary-foreground" /> : <Bot className="w-4 h-4 text-primary" />}
                  </div>
                  <div className={`rounded-2xl px-3 py-2 max-w-[80%] ${msg.role === 'user' ? 'bg-primary text-primary-foreground rounded-tr-none' : 'bg-muted text-foreground rounded-tl-none'}`}>
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-2">
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                  <div className="bg-muted rounded-2xl rounded-tl-none px-3 py-2">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          </ScrollArea>

          {/* Quick Replies */}
          <div className="px-4 pb-2">
            <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
              {QUICK_REPLIES.map(qr => (
                <button
                  key={qr}
                  onClick={() => handleQuickReply(qr)}
                  className="flex-shrink-0 text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-full hover:bg-primary/20 transition-colors"
                >
                  {qr}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="px-4 pb-4 flex gap-2">
            <Input
              placeholder="Ask about your finances..."
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              className="flex-1 text-sm"
            />
            <Button onClick={handleSend} disabled={!chatInput.trim()} size="icon" className="flex-shrink-0">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
