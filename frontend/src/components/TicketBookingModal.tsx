import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Bus, Train, Plane, CheckCircle, ExternalLink, ArrowRight } from 'lucide-react';
import PinConfirmationModal from './PinConfirmationModal';

interface TicketBookingModalProps {
  open: boolean;
  onClose: () => void;
}

type BookingStep = 'search' | 'seats' | 'pin' | 'success';

const BUS_ROUTES = [
  { id: 1, from: 'Mumbai', to: 'Pune', time: '06:00', duration: '3h', price: 350, seats: 12 },
  { id: 2, from: 'Mumbai', to: 'Pune', time: '09:00', duration: '3.5h', price: 280, seats: 5 },
  { id: 3, from: 'Mumbai', to: 'Pune', time: '14:00', duration: '3h', price: 400, seats: 20 },
];

const TRAIN_ROUTES = [
  { id: 1, name: 'Shatabdi Express', number: '12027', from: 'Mumbai', to: 'Pune', time: '07:10', duration: '3h 20m', price: 520, seats: 8 },
  { id: 2, name: 'Deccan Queen', number: '12123', from: 'Mumbai', to: 'Pune', time: '17:10', duration: '3h 30m', price: 480, seats: 15 },
];

const FLIGHT_ROUTES = [
  { id: 1, airline: 'IndiGo', from: 'DEL', to: 'BOM', time: '06:00', duration: '2h 10m', price: 3499, seats: 4 },
  { id: 2, airline: 'Air India', from: 'DEL', to: 'BOM', time: '10:30', duration: '2h 15m', price: 4200, seats: 10 },
  { id: 3, airline: 'SpiceJet', from: 'DEL', to: 'BOM', time: '15:45', duration: '2h 05m', price: 2999, seats: 2 },
];

export default function TicketBookingModal({ open, onClose }: TicketBookingModalProps) {
  const [step, setStep] = useState<BookingStep>('search');
  const [activeTab, setActiveTab] = useState('bus');
  const [fromCity, setFromCity] = useState('');
  const [toCity, setToCity] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [selectedRoute, setSelectedRoute] = useState<any>(null);
  const [pinOpen, setPinOpen] = useState(false);

  const handleClose = () => {
    setStep('search');
    setSelectedRoute(null);
    onClose();
  };

  const handleSelectRoute = (route: any) => {
    setSelectedRoute(route);
    setPinOpen(true);
  };

  const handlePinSuccess = () => {
    setPinOpen(false);
    setStep('success');
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-sm mx-auto max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <img src="/assets/generated/ticket-booking-icon.dim_96x96.png" alt="" className="w-5 h-5 object-contain" />
              Ticket Booking
            </DialogTitle>
          </DialogHeader>

          {step === 'search' && (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="bus" className="flex items-center gap-1 text-xs">
                  <Bus className="w-3 h-3" /> Bus
                </TabsTrigger>
                <TabsTrigger value="train" className="flex items-center gap-1 text-xs">
                  <Train className="w-3 h-3" /> Train
                </TabsTrigger>
                <TabsTrigger value="flight" className="flex items-center gap-1 text-xs">
                  <Plane className="w-3 h-3" /> Flight
                </TabsTrigger>
              </TabsList>

              {/* Bus Tab */}
              <TabsContent value="bus" className="space-y-3 mt-3">
                <Input placeholder="From City" value={fromCity} onChange={e => setFromCity(e.target.value)} />
                <Input placeholder="To City" value={toCity} onChange={e => setToCity(e.target.value)} />
                <Input type="date" value={travelDate} onChange={e => setTravelDate(e.target.value)} />
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Available Buses</p>
                  {BUS_ROUTES.map(route => (
                    <button
                      key={route.id}
                      onClick={() => handleSelectRoute(route)}
                      className="w-full p-3 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-all text-left"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-sm">{route.time} • {route.duration}</p>
                          <p className="text-xs text-muted-foreground">{route.seats} seats left</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-primary">₹{route.price}</p>
                          <p className="text-xs text-muted-foreground">per seat</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </TabsContent>

              {/* Train Tab */}
              <TabsContent value="train" className="space-y-3 mt-3">
                <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-3 flex items-center gap-2">
                  <Train className="w-4 h-4 text-blue-600" />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-blue-700 dark:text-blue-300">Book via IRCTC</p>
                    <p className="text-xs text-blue-600/70 dark:text-blue-400/70">For official train booking</p>
                  </div>
                  <a
                    href="https://www.irctc.co.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-blue-600 font-medium hover:underline"
                  >
                    IRCTC <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <Input placeholder="From Station" value={fromCity} onChange={e => setFromCity(e.target.value)} />
                <Input placeholder="To Station" value={toCity} onChange={e => setToCity(e.target.value)} />
                <Input type="date" value={travelDate} onChange={e => setTravelDate(e.target.value)} />
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Available Trains</p>
                  {TRAIN_ROUTES.map(route => (
                    <button
                      key={route.id}
                      onClick={() => handleSelectRoute(route)}
                      className="w-full p-3 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-all text-left"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-sm">{route.name}</p>
                          <p className="text-xs text-muted-foreground">{route.number} • {route.time} • {route.duration}</p>
                          <p className="text-xs text-muted-foreground">{route.seats} seats left</p>
                        </div>
                        <p className="font-bold text-primary">₹{route.price}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </TabsContent>

              {/* Flight Tab */}
              <TabsContent value="flight" className="space-y-3 mt-3">
                <Input placeholder="From (e.g. DEL)" value={fromCity} onChange={e => setFromCity(e.target.value)} />
                <Input placeholder="To (e.g. BOM)" value={toCity} onChange={e => setToCity(e.target.value)} />
                <Input type="date" value={travelDate} onChange={e => setTravelDate(e.target.value)} />
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Available Flights</p>
                  {FLIGHT_ROUTES.map(route => (
                    <button
                      key={route.id}
                      onClick={() => handleSelectRoute(route)}
                      className="w-full p-3 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-all text-left"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-sm">{route.airline}</p>
                          <p className="text-xs text-muted-foreground">{route.from} <ArrowRight className="w-3 h-3 inline" /> {route.to} • {route.time}</p>
                          <p className="text-xs text-muted-foreground">{route.duration} • {route.seats} seats left</p>
                        </div>
                        <p className="font-bold text-primary">₹{route.price}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          )}

          {step === 'success' && selectedRoute && (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Booking Confirmed!</h3>
                <p className="text-muted-foreground text-sm mt-1">Your ticket has been booked successfully</p>
              </div>
              <div className="bg-muted rounded-xl p-4 text-left space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Amount Paid</span>
                  <span className="font-semibold">₹{selectedRoute.price}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">PNR / Booking ID</span>
                  <span className="font-semibold font-mono">FM{Math.random().toString(36).slice(2,8).toUpperCase()}</span>
                </div>
              </div>
              <Button onClick={handleClose} className="w-full">Done</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <PinConfirmationModal
        open={pinOpen}
        onClose={() => setPinOpen(false)}
        onSuccess={handlePinSuccess}
        title="Confirm Booking"
        description={`Enter PIN to pay ₹${selectedRoute?.price}`}
      />
    </>
  );
}
