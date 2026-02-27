import { useState } from 'react';
import BottomNav from '../components/BottomNav';
import Home from './Home';
import History from './History';
import Analytics from './Analytics';
import Profile from './Profile';

export type TabType = 'home' | 'history' | 'analytics' | 'profile';

export default function MainApp() {
  const [activeTab, setActiveTab] = useState<TabType>('home');

  const renderPage = () => {
    switch (activeTab) {
      case 'home': return <Home />;
      case 'history': return <History />;
      case 'analytics': return <Analytics />;
      case 'profile': return <Profile onLock={() => {}} />;
      default: return <Home />;
    }
  };

  return (
    <div className="relative min-h-screen bg-background">
      <main className="pb-20">
        {renderPage()}
      </main>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
