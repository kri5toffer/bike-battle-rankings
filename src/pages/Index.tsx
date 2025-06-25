
import React, { useState } from 'react';
import AppHeader from '@/components/AppHeader';
import NavigationTabs from '@/components/NavigationTabs';
import TabContent from '@/components/TabContent';
import { useBikes } from '@/hooks/useBikes';

export interface BikePhoto {
  id: string;
  imageUrl: string;
  rating: number;
  wins: number;
  losses: number;
  uploadedAt: Date;
  bikeName?: string;
  bikeType?: string;
  brand?: string;
  model?: string;
  year?: number;
  description?: string;
  mostOftenRiddenRoute?: string;
}

type TabType = 'upload' | 'compare' | 'search' | 'leaderboard' | 'contact';

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabType>('upload');
  const { bikes, isLoading, addBike, updateBikeRatings } = useBikes();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-black border-b-2 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <AppHeader />
          <NavigationTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-2 border-black border-t-transparent animate-spin"></div>
          </div>
        ) : (
          <TabContent 
            activeTab={activeTab}
            bikes={bikes}
            onBikeUploaded={addBike}
            onVote={updateBikeRatings}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
