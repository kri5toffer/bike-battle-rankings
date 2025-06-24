
import React from 'react';
import { Upload, Search, Trophy, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

type TabType = 'upload' | 'compare' | 'search' | 'leaderboard' | 'contact';

interface NavigationTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const TabButton = ({ 
  tab, 
  icon: Icon, 
  label, 
  isActive,
  onClick 
}: { 
  tab: TabType, 
  icon: any, 
  label: string, 
  isActive: boolean,
  onClick: (tab: TabType) => void;
}) => (
  <Button
    onClick={() => onClick(tab)}
    variant={isActive ? "default" : "outline"}
    className={`flex items-center gap-2 px-3 sm:px-6 py-2 sm:py-3 text-sm sm:text-base transition-all duration-300 rounded-none border-2 ${
      isActive 
        ? 'bg-white text-black border-white hover:bg-gray-100' 
        : 'bg-black text-white border-white hover:bg-white hover:text-black'
    }`}
  >
    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
    <span className="hidden sm:inline">{label}</span>
  </Button>
);

const NavigationTabs: React.FC<NavigationTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex flex-wrap gap-2 sm:gap-4 justify-center">
      <TabButton 
        tab="upload" 
        icon={Upload} 
        label="Submit Entry" 
        isActive={activeTab === 'upload'} 
        onClick={onTabChange}
      />
      <TabButton 
        tab="compare" 
        icon={Trophy} 
        label="Head-to-Head" 
        isActive={activeTab === 'compare'} 
        onClick={onTabChange}
      />
      <TabButton 
        tab="search" 
        icon={Search} 
        label="Gallery" 
        isActive={activeTab === 'search'} 
        onClick={onTabChange}
      />
      <TabButton 
        tab="leaderboard" 
        icon={Trophy}
        label="Rankings" 
        isActive={activeTab === 'leaderboard'} 
        onClick={onTabChange}
      />
      <TabButton 
        tab="contact" 
        icon={MessageCircle} 
        label="Contact" 
        isActive={activeTab === 'contact'} 
        onClick={onTabChange}
      />
    </div>
  );
};

export default NavigationTabs;
