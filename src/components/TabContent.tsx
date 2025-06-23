
import React from 'react';
import UploadSection from '@/components/UploadSection';
import ComparisonView from '@/components/ComparisonView';
import SearchSection from '@/components/SearchSection';
import Leaderboard from '@/components/Leaderboard';
import ContactForm from '@/components/ContactForm';
import { BikePhoto } from '@/pages/Index';
import { BikeDetails } from '@/components/BikeDetailsForm';

type TabType = 'upload' | 'compare' | 'search' | 'leaderboard' | 'contact';

interface TabContentProps {
  activeTab: TabType;
  bikes: BikePhoto[];
  onBikeUploaded: (imageUrl: string, details: BikeDetails) => Promise<void>;
  onVote: (winnerId: string, loserId: string) => Promise<void>;
}

const TabContent: React.FC<TabContentProps> = ({ 
  activeTab, 
  bikes, 
  onBikeUploaded, 
  onVote 
}) => {
  return (
    <>
      {activeTab === 'upload' && (
        <UploadSection onBikeUploaded={onBikeUploaded} />
      )}
      
      {activeTab === 'compare' && (
        <ComparisonView 
          bikes={bikes} 
          onVote={onVote} 
        />
      )}
      
      {activeTab === 'search' && (
        <SearchSection bikes={bikes} />
      )}
      
      {activeTab === 'leaderboard' && (
        <Leaderboard bikes={bikes} />
      )}

      {activeTab === 'contact' && (
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-100 mb-4">
              Get in Touch
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Have questions, suggestions, or just want to chat about bikes? 
              I'd love to hear from you!
            </p>
          </div>
          <ContactForm />
        </div>
      )}
    </>
  );
};

export default TabContent;
