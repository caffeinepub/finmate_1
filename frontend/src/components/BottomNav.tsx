import { Home, Clock, BarChart2, User } from 'lucide-react';
import { TabType } from '../pages/MainApp';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const tabs = [
  { id: 'home' as TabType, label: 'Home', icon: Home },
  { id: 'history' as TabType, label: 'History', icon: Clock },
  { id: 'analytics' as TabType, label: 'Analytics', icon: BarChart2 },
  { id: 'profile' as TabType, label: 'Profile', icon: User },
];

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-t border-border/50 shadow-lg">
      <div className="max-w-md mx-auto flex items-center justify-around px-2 py-1">
        {tabs.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`nav-tab flex-1 ${isActive ? 'active' : ''}`}
            >
              <div className={`relative p-2 rounded-xl transition-all duration-200 ${isActive ? 'bg-primary/10' : ''}`}>
                <Icon
                  size={22}
                  className={`transition-all duration-200 ${isActive ? 'text-primary' : 'text-muted-foreground'}`}
                  strokeWidth={isActive ? 2.5 : 1.8}
                />
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                )}
              </div>
              <span className={`text-xs font-medium transition-all duration-200 ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
