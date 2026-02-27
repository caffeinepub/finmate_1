import React from 'react';
import { Star, MessageSquare } from 'lucide-react';
import { useGetAllFeedback, useIsCallerAdmin } from '../hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminFeedbackSection() {
  const { data: isAdmin } = useIsCallerAdmin();
  const { data: feedbacks, isLoading } = useGetAllFeedback();

  if (!isAdmin) return null;

  return (
    <div className="bg-card rounded-2xl p-5 border border-border space-y-4">
      <div className="flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-primary" />
        <h3 className="font-semibold">Customer Feedback (Admin)</h3>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full rounded-lg" />)}
        </div>
      ) : feedbacks && feedbacks.length > 0 ? (
        <div className="space-y-3">
          {feedbacks.map(fb => (
            <div key={fb.id.toString()} className="p-3 bg-muted rounded-lg space-y-1">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${i < Number(fb.rating) ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground'}`}
                  />
                ))}
                <span className="text-xs text-muted-foreground ml-2">
                  {new Date(Number(fb.timestamp) / 1_000_000).toLocaleDateString()}
                </span>
              </div>
              {fb.message && <p className="text-sm">{fb.message}</p>}
              <p className="text-xs text-muted-foreground font-mono truncate">
                {fb.submittedBy.toString().slice(0, 20)}...
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground text-sm text-center py-4">No feedback submitted yet.</p>
      )}
    </div>
  );
}
