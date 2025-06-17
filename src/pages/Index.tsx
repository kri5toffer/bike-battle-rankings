
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
      className={`flex items-center gap-2 transition-all duration-200 ${
        isActive ? 'bg-blue-600 hover:bg-blue-700' : 'hover:bg-blue-50'
      }`}
    >
      <Icon size={18} />
      {label}
    </Button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Bike className="text-white" size={24} />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
              Bike Battle
            </h1>
          </div>
          
          {/* Navigation Tabs */}
          <div className="flex flex-wrap gap-3">
            <TabButton 
              tab="upload" 
              icon={Upload} 
              label="Upload Bike" 
              isActive={activeTab === 'upload'} 
            />
            <TabButton 
              tab="compare" 
              icon={Trophy} 
              label="Compare Bikes" 
              isActive={activeTab === 'compare'} 
            />
            <TabButton 
              tab="search" 
              icon={Search} 
              label="Search Your Bike" 
              isActive={activeTab === 'search'} 
            />
            <TabButton 
              tab="leaderboard" 
              icon={Trophy} 
              label="Leaderboard" 
              isActive={activeTab === 'leaderboard'} 
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
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
