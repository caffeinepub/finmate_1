import React, { useState } from 'react';
import { ChevronDown, ChevronUp, MessageCircle, Ticket, CheckCircle } from 'lucide-react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useSubmitSupportTicket } from '../hooks/useQueries';

const FAQS = [
  { q: 'How do I add a bank account?', a: 'Go to Profile → Bank Accounts → tap the + button. Enter your bank details and verify with your PIN.' },
  { q: 'How do I reset my PIN?', a: 'Go to Profile → Security → Change PIN. You\'ll need to verify your current PIN first.' },
  { q: 'Is my data secure?', a: 'Yes! FinMate uses end-to-end encryption and stores data on the Internet Computer blockchain, which is tamper-proof.' },
  { q: 'How do I earn DigiPoints?', a: 'Complete challenges, refer friends, and make transactions to earn DigiPoints. Check the Leaderboard to see your rank!' },
  { q: 'Can I link multiple bank accounts?', a: 'Yes, you can link up to 5 bank accounts. Go to Profile → Bank Accounts to manage them.' },
  { q: 'How do I check my CIBIL score?', a: 'Go to Profile → CIBIL Score section. Your simulated score is updated monthly based on your financial behavior.' },
];

export default function GetHelpSection() {
  const [expanded, setExpanded] = useState(false);
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const submitTicket = useSubmitSupportTicket();

  const handleSubmitTicket = async () => {
    if (!subject || !description) return;
    try {
      await submitTicket.mutateAsync({ subject, description });
      setSubmitted(true);
      setSubject('');
      setDescription('');
    } catch (e) {
      // ignore
    }
  };

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950/50 flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-blue-600" />
          </div>
          <span className="font-semibold text-foreground">Get Help</span>
        </div>
        {expanded ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-border pt-4">
          {/* FAQ */}
          <div>
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">Frequently Asked Questions</p>
            <Accordion type="single" collapsible className="space-y-1">
              {FAQS.map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="border border-border rounded-xl px-3">
                  <AccordionTrigger className="text-sm font-medium py-3 hover:no-underline">{faq.q}</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground pb-3">{faq.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Chat Support */}
          <button className="w-full flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-muted/50 transition-colors">
            <MessageCircle className="w-5 h-5 text-primary" />
            <div className="text-left">
              <p className="text-sm font-medium">Live Chat Support</p>
              <p className="text-xs text-muted-foreground">Available 9 AM – 9 PM IST</p>
            </div>
            <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Online</span>
          </button>

          {/* Support Ticket */}
          <div>
            <button
              onClick={() => setShowTicketForm(!showTicketForm)}
              className="w-full flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-muted/50 transition-colors"
            >
              <Ticket className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">Submit Support Ticket</span>
              {showTicketForm ? <ChevronUp className="w-4 h-4 ml-auto text-muted-foreground" /> : <ChevronDown className="w-4 h-4 ml-auto text-muted-foreground" />}
            </button>

            {showTicketForm && (
              <div className="mt-3 space-y-3">
                {submitted ? (
                  <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950/30 rounded-xl">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <p className="text-sm text-green-700 dark:text-green-300">Ticket submitted! We'll respond within 24 hours.</p>
                  </div>
                ) : (
                  <>
                    <Input placeholder="Subject" value={subject} onChange={e => setSubject(e.target.value)} />
                    <Textarea
                      placeholder="Describe your issue..."
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      rows={3}
                      className="resize-none"
                    />
                    <Button
                      onClick={handleSubmitTicket}
                      disabled={!subject || !description || submitTicket.isPending}
                      className="w-full"
                      size="sm"
                    >
                      {submitTicket.isPending ? 'Submitting...' : 'Submit Ticket'}
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
