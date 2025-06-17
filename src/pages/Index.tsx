
import React, { useState, useEffect } from 'react';
import { Upload, Search, Trophy, Bike } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import UploadSection from '@/components/UploadSection';
import ComparisonView from '@/components/ComparisonView';
import SearchSection from '@/components/SearchSection';
import Leaderboard from '@/components/Leaderboard';

export interface BikePhoto {
  id: string;
  imageUrl: string;
  rating: number;
  wins: number;
  losses: number;
  uploadedAt: Date;
}

const Index = () => {
  const [activeTab, setActiveTab] = useState<'upload' | 'compare' | 'search' | 'leaderboard'>('upload');
  const [bikes, setBikes] = useState<BikePhoto[]>([]);

  useEffect(() => {
    // Load bikes from localStorage on component mount
    const savedBikes = localStorage.getItem('bikePhotos');
    if (savedBikes) {
      try {
        const parsedBikes = JSON.parse(savedBikes).map((bike: any) => ({
          ...bike,
          uploadedAt: new Date(bike.uploadedAt)
        }));
        setBikes(parsedBikes);
      } catch (error) {
        console.error('Error loading saved bikes:', error);
      }
    }
  }, []);

  const saveBikes = (updatedBikes: BikePhoto[]) => {
    setBikes(updatedBikes);
    localStorage.setItem('bikePhotos', JSON.stringify(updatedBikes));
  };

  const addBike = (imageUrl: string) => {
    const newBike: BikePhoto = {
      id: Date.now().toString(),
      imageUrl,
      rating: 1200, // Starting ELO rating
      wins: 0,
      losses: 0,
      uploadedAt: new Date()
    };
    const updatedBikes = [...bikes, newBike];
    saveBikes(updatedBikes);
  };

  const updateBikeRatings = (winnerId: string, loserId: string) => {
    const updatedBikes = bikes.map(bike => {
      if (bike.id === winnerId) {
        const K = 32; // ELO K-factor
        const loserRating = bikes.find(b => b.id === loserId)?.rating || 1200;
        const expectedScore = 1 / (1 + Math.pow(10, (loserRating - bike.rating) / 400));
        const newRating = Math.round(bike.rating + K * (1 - expectedScore));
        return {
          ...bike,
          rating: newRating,
          wins: bike.wins + 1
        };
      } else if (bike.id === loserId) {
        const K = 32;
        const winnerRating = bikes.find(b => b.id === winnerId)?.rating || 1200;
        const expectedScore = 1 / (1 + Math.pow(10, (winnerRating - bike.rating) / 400));
        const newRating = Math.round(bike.rating + K * (0 - expectedScore));
        return {
          ...bike,
          rating: Math.max(newRating, 800), // Minimum rating of 800
          losses: bike.losses + 1
        };
      }
      return bike;
    });
    saveBikes(updatedBikes);
  };

  const TabButton = ({ 
    tab, 
    icon: Icon, 
    label, 
    isActive 
  }: { 
    tab: typeof activeTab, 
    icon: any, 
    label: string, 
    isActive: boolean 
  }) => (
    <Button
      onClick={() => setActiveTab(tab)}
      variant={isActive ? "default" : "outline"}
      className={`flex items-center gap-2 px-6 py-3 transition-all duration-300 ${
        isActive 
          ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg' 
          : 'hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:border-blue-300 border-gray-200'
      }`}
    >
      <Icon size={18} />
      {label}
    </Button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg shadow-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg">
              <Bike className="text-white" size={28} />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-700 via-purple-600 to-pink-500 bg-clip-text text-transparent">
              Bike Battle Arena
            </h1>
          </div>
          
          {/* Navigation Tabs */}
          <div className="flex flex-wrap gap-4">
            <TabButton 
              tab="upload" 
              icon={Upload} 
              label="Upload Bike" 
              isActive={activeTab === 'upload'} 
            />
            <TabButton 
              tab="compare" 
              icon={Trophy} 
              label="Battle Arena" 
              isActive={activeTab === 'compare'} 
            />
            <TabButton 
              tab="search" 
              icon={Search} 
              label="Find My Bike" 
              isActive={activeTab === 'search'} 
            />
            <TabButton 
              tab="leaderboard" 
              icon={Trophy} 
              label="Champions Board" 
              isActive={activeTab === 'leaderboard'} 
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        {activeTab === 'upload' && (
          <UploadSection onBikeUploaded={addBike} />
        )}
        
        {activeTab === 'compare' && (
          <ComparisonView 
            bikes={bikes} 
            onVote={updateBikeRatings} 
          />
        )}
        
        {activeTab === 'search' && (
          <SearchSection bikes={bikes} />
        )}
        
        {activeTab === 'leaderboard' && (
          <Leaderboard bikes={bikes} />
        )}
      </div>
    </div>
  );
};

export default Index;
