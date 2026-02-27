import React from 'react';
import { Ticket } from 'lucide-react';
import { useGetAllSupportTickets, useIsCallerAdmin } from '../hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

export default function AdminSupportTicketsSection() {
  const { data: isAdmin } = useIsCallerAdmin();
  const { data: tickets, isLoading } = useGetAllSupportTickets();

  if (!isAdmin) return null;

  return (
    <div className="bg-card rounded-2xl p-5 border border-border space-y-4">
      <div className="flex items-center gap-2">
        <Ticket className="w-5 h-5 text-primary" />
        <h3 className="font-semibold">Support Tickets (Admin)</h3>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full rounded-lg" />)}
        </div>
      ) : tickets && tickets.length > 0 ? (
        <div className="space-y-3">
          {tickets.map(ticket => (
            <div key={ticket.id.toString()} className="p-3 bg-muted rounded-lg space-y-1">
              <div className="flex items-center justify-between">
                <p className="font-medium text-sm">{ticket.subject}</p>
                <Badge variant="outline" className="text-xs">
                  #{ticket.id.toString()}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{ticket.description}</p>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground font-mono truncate max-w-[180px]">
                  {ticket.raisedBy.toString().slice(0, 20)}...
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(Number(ticket.timestamp) / 1_000_000).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground text-sm text-center py-4">No support tickets yet.</p>
      )}
    </div>
  );
}
