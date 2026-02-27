import { useState, useCallback } from 'react';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const RESPONSES: { keywords: string[]; response: string }[] = [
  {
    keywords: ['spending', 'spend', 'expense', 'expenses', 'analyze', 'analysis'],
    response: `📊 **Spending Analysis**\n\nBased on your recent transactions:\n\n• 🍔 Food & Dining: ₹4,800 (21%) — slightly above average\n• 🛍️ Shopping: ₹5,600 (24%) — your highest category\n• 🚗 Transport: ₹3,200 (14%) — within normal range\n• 🎬 Entertainment: ₹2,100 (9%) — consider reducing\n\n💡 **Tip:** Your shopping spend is 24% of total — try setting a ₹4,000 monthly cap to save ₹1,600/month.`,
  },
  {
    keywords: ['invest', 'investment', 'mutual fund', 'stocks', 'equity', 'portfolio'],
    response: `📈 **Investment Recommendations**\n\nBased on your profile:\n\n1. **SIP in Index Funds** — Start with ₹2,000/month in Nifty 50 index fund. Low cost, market returns.\n\n2. **ELSS Tax Saver** — Invest ₹1,500/month to save up to ₹46,800 in taxes under 80C.\n\n3. **Liquid Fund** — Park your emergency fund (3-6 months expenses) in a liquid fund for better returns than savings account.\n\n💡 Start small, stay consistent. Even ₹500/month compounded over 20 years = ₹5+ lakhs!`,
  },
  {
    keywords: ['sip', 'systematic', 'monthly investment'],
    response: `💰 **SIP Guide**\n\nSIP (Systematic Investment Plan) is the smartest way to invest:\n\n• **How it works:** Fixed amount invested monthly in mutual funds\n• **Power of compounding:** ₹1,000/month for 15 years at 12% = ₹5 lakhs\n• **Best SIP funds for beginners:**\n  - Mirae Asset Large Cap Fund\n  - Axis Bluechip Fund\n  - Parag Parikh Flexi Cap Fund\n\n📱 Start your SIP directly from FinMate with zero commission!`,
  },
  {
    keywords: ['save', 'saving', 'savings', 'reduce', 'cut'],
    response: `💡 **Smart Savings Tips**\n\nHere's how to save more each month:\n\n1. **50-30-20 Rule:** 50% needs, 30% wants, 20% savings\n2. **Automate savings:** Set up auto-debit on salary day\n3. **Cancel unused subscriptions:** Check for OTT, gym, apps\n4. **Cook at home:** Save ₹2,000-3,000/month on food\n5. **Use cashback cards:** Earn 1-5% back on every purchase\n\n🎯 **Your goal:** Increase savings rate from 32% to 40% = ₹3,600 more saved monthly!`,
  },
  {
    keywords: ['budget', 'budgeting', 'plan', 'planning', 'limit'],
    response: `📋 **Budget Planning**\n\nRecommended monthly budget for you:\n\n| Category | Recommended | Your Spend |\n|----------|-------------|------------|\n| Food | ₹4,000 | ₹4,800 ⚠️ |\n| Transport | ₹3,500 | ₹3,200 ✅ |\n| Shopping | ₹4,000 | ₹5,600 ⚠️ |\n| Entertainment | ₹2,000 | ₹2,100 ✅ |\n\n💡 Set spending limits in FinMate to get real-time alerts when you're close to your budget!`,
  },
  {
    keywords: ['credit', 'cibil', 'score', 'credit score', 'loan'],
    response: `🏦 **Credit Score Guidance**\n\nYour estimated CIBIL score: **742/900** (Good)\n\n**To improve your score:**\n1. ✅ Pay all EMIs on time (35% of score)\n2. 📉 Keep credit utilization below 30%\n3. 🕐 Don't close old credit cards\n4. 🚫 Avoid multiple loan applications\n5. 📊 Maintain a mix of credit types\n\n**Score ranges:**\n• 750-900: Excellent (best loan rates)\n• 700-749: Good (your range)\n• 650-699: Fair\n• Below 650: Poor\n\n💡 Paying bills on time for 6 months can boost your score by 20-30 points!`,
  },
  {
    keywords: ['student', 'education', 'college', 'loan', 'study'],
    response: `🎓 **Student Loan Guide**\n\nFinMate offers education loans with:\n• **Amount:** Up to ₹50 lakhs\n• **Interest rate:** 8.5% p.a. (lowest in market)\n• **Repayment:** Starts 6 months after course completion\n• **Tax benefit:** Interest deduction under Section 80E\n\n**Documents needed:**\n- Admission letter\n- Fee structure\n- Income proof of co-applicant\n- Academic records\n\n📱 Apply directly in FinMate — approval in 24 hours!`,
  },
  {
    keywords: ['trading', 'trade', 'stock', 'share', 'nse', 'bse'],
    response: `📊 **Trading Tips for Beginners**\n\n**Getting started:**\n1. Open a Demat account (free on FinMate)\n2. Start with large-cap stocks (less volatile)\n3. Never invest more than you can afford to lose\n4. Use stop-loss orders to limit losses\n\n**Golden rules:**\n• 📚 Research before buying\n• 🎯 Set clear entry & exit targets\n• 💼 Diversify across sectors\n• 😌 Don't panic sell during dips\n\n⚠️ **Warning:** Day trading is risky. Start with long-term investing!`,
  },
  {
    keywords: ['hello', 'hi', 'hey', 'help', 'start'],
    response: `👋 **Hello! I'm your FinMate AI Analyst**\n\nI can help you with:\n\n• 📊 Spending analysis & insights\n• 💰 Investment recommendations\n• 💡 Savings tips & strategies\n• 📋 Budget planning\n• 🏦 Credit score guidance\n• 🎓 Student loan information\n• 📈 Trading basics\n\nWhat would you like to explore today?`,
  },
];

const DEFAULT_RESPONSE = `🤔 I understand you're asking about your finances. Here are some quick insights:\n\n• Your spending this month is on track\n• Consider increasing your SIP by ₹500/month\n• Your credit score is in the "Good" range\n\nTry asking me about: spending analysis, investment tips, savings strategies, budget planning, or credit score advice!`;

function generateResponse(input: string): string {
  const lower = input.toLowerCase();
  for (const { keywords, response } of RESPONSES) {
    if (keywords.some(k => lower.includes(k))) {
      return response;
    }
  }
  return DEFAULT_RESPONSE;
}

export function useAIChatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = useCallback((content: string) => {
    const userMsg: ChatMessage = { role: 'user', content };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    const delay = 800 + Math.random() * 800;
    setTimeout(() => {
      const response = generateResponse(content);
      const assistantMsg: ChatMessage = { role: 'assistant', content: response };
      setMessages(prev => [...prev, assistantMsg]);
      setIsTyping(false);
    }, delay);
  }, []);

  return { messages, sendMessage, isTyping };
}
