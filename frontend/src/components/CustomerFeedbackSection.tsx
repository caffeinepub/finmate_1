import React, { useState } from 'react';
import { Star, Send, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useSubmitFeedback } from '../hooks/useQueries';

export default function CustomerFeedbackSection() {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const submitFeedback = useSubmitFeedback();

  const handleSubmit = async () => {
    if (rating === 0) return;
    try {
      await submitFeedback.mutateAsync({ rating: BigInt(rating), message });
      setSubmitted(true);
    } catch (e) {
      // ignore
    }
  };

  if (submitted) {
    return (
      <div className="bg-card rounded-2xl border border-border p-6 text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto">
          <CheckCircle className="w-7 h-7 text-green-500" />
        </div>
        <h3 className="font-bold text-foreground">Thank You!</h3>
        <p className="text-sm text-muted-foreground">Your feedback helps us improve FinMate for everyone.</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl border border-border p-4 space-y-4">
      <div>
        <h3 className="font-bold text-foreground">Share Your Experience</h3>
        <p className="text-xs text-muted-foreground mt-0.5">How are we doing? Your feedback matters!</p>
      </div>

      {/* Star Rating */}
      <div className="flex gap-2 justify-center">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => setRating(star)}
            className="transition-transform hover:scale-110 active:scale-95"
          >
            <Star
              className={`w-8 h-8 transition-colors ${
                star <= (hoverRating || rating)
                  ? 'fill-amber-400 text-amber-400'
                  : 'text-muted-foreground/30'
              }`}
            />
          </button>
        ))}
      </div>

      {rating > 0 && (
        <p className="text-center text-sm text-muted-foreground">
          {rating === 1 ? '😞 Very Poor' : rating === 2 ? '😕 Poor' : rating === 3 ? '😐 Average' : rating === 4 ? '😊 Good' : '🤩 Excellent!'}
        </p>
      )}

      <Textarea
        placeholder="Write your review here... (optional)"
        value={message}
        onChange={e => setMessage(e.target.value)}
        className="resize-none"
        rows={3}
      />

      <Button
        onClick={handleSubmit}
        disabled={rating === 0 || submitFeedback.isPending}
        className="w-full"
      >
        {submitFeedback.isPending ? (
          <span className="flex items-center gap-2"><span className="animate-spin">⏳</span> Submitting...</span>
        ) : (
          <span className="flex items-center gap-2"><Send className="w-4 h-4" /> Submit Feedback</span>
        )}
      </Button>
    </div>
  );
}
