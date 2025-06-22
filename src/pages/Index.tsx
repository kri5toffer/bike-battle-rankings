
import React, { useState, useEffect } from 'react';
import { Upload, Search, Trophy, Bike, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import UploadSection from '@/components/UploadSection';
import ComparisonView from '@/components/ComparisonView';
import SearchSection from '@/components/SearchSection';
import Leaderboard from '@/components/Leaderboard';
import ContactForm from '@/components/ContactForm';
import { supabase } from '@/integrations/supabase/client';
import { BikeDetails } from '@/components/BikeDetailsForm';

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
}

const Index = () => {
  const [activeTab, setActiveTab] = useState<'upload' | 'compare' | 'search' | 'leaderboard' | 'contact'>('upload');
  const [bikes, setBikes] = useState<BikePhoto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadBikes();
  }, []);

  const loadBikes = async () => {
    try {
      const { data, error } = await supabase
        .from('bikes')
        .select('*')
        .order('rating', { ascending: false });

      if (error) {
        console.error('Error loading bikes:', error);
        return;
      }

      const formattedBikes: BikePhoto[] = data.map((bike: any) => ({
        id: bike.id,
        imageUrl: bike.image_url,
        rating: bike.rating,
        wins: bike.wins,
        losses: bike.losses,
        uploadedAt: new Date(bike.uploaded_at),
        bikeName: bike.bike_name,
        bikeType: bike.bike_type,
        brand: bike.brand,
        model: bike.model,
        year: bike.year,
        description: bike.description
      }));

      setBikes(formattedBikes);
    } catch (error) {
      console.error('Error loading bikes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addBike = async (imageUrl: string, details: BikeDetails) => {
    try {
      const { data, error } = await supabase
        .from('bikes')
        .insert({
          image_url: imageUrl,
          bike_name: details.bikeName,
          bike_type: details.bikeType,
          brand: details.brand || null,
          model: details.model || null,
          year: details.year || null,
          description: details.description || null
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding bike:', error);
        throw error;
      }

      const newBike: BikePhoto = {
        id: data.id,
        imageUrl: data.image_url,
        rating: data.rating,
        wins: data.wins,
        losses: data.losses,
        uploadedAt: new Date(data.uploaded_at),
        bikeName: data.bike_name,
        bikeType: data.bike_type,
        brand: data.brand,
        model: data.model,
        year: data.year,
        description: data.description
      };

      setBikes(prev => [newBike, ...prev]);
    } catch (error) {
      console.error('Error adding bike:', error);
      throw error;
    }
  };

  const updateBikeRatings = async (winnerId: string, loserId: string) => {
    try {
      const winner = bikes.find(b => b.id === winnerId);
      const loser = bikes.find(b => b.id === loserId);
      
      if (!winner || !loser) return;

      const K = 32; // ELO K-factor
      const expectedScoreWinner = 1 / (1 + Math.pow(10, (loser.rating - winner.rating) / 400));
      const expectedScoreLoser = 1 / (1 + Math.pow(10, (winner.rating - loser.rating) / 400));
      
      const newWinnerRating = Math.round(winner.rating + K * (1 - expectedScoreWinner));
      const newLoserRating = Math.max(Math.round(loser.rating + K * (0 - expectedScoreLoser)), 800);

      // Update both bikes in database
      await Promise.all([
        supabase
          .from('bikes')
          .update({ 
            rating: newWinnerRating, 
            wins: winner.wins + 1 
          })
          .eq('id', winnerId),
        supabase
          .from('bikes')
          .update({ 
            rating: newLoserRating, 
            losses: loser.losses + 1 
          })
          .eq('id', loserId)
      ]);

      // Record the vote
      await supabase
        .from('votes')
        .insert({
          winner_id: winnerId,
          loser_id: loserId
        });

      // Update local state
      setBikes(prev => prev.map(bike => {
        if (bike.id === winnerId) {
          return { ...bike, rating: newWinnerRating, wins: bike.wins + 1 };
        } else if (bike.id === loserId) {
          return { ...bike, rating: newLoserRating, losses: bike.losses + 1 };
        }
        return bike;
      }));
    } catch (error) {
      console.error('Error updating bike ratings:', error);
    }
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
      className={`flex items-center gap-2 px-3 sm:px-6 py-2 sm:py-3 text-sm sm:text-base transition-all duration-300 ${
        isActive 
          ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg' 
          : 'bg-gray-800/50 border-gray-600 text-gray-200 hover:bg-gradient-to-r hover:from-blue-900/50 hover:to-purple-900/50 hover:border-blue-500'
      }`}
    >
      <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
      <span className="hidden sm:inline">{label}</span>
    </Button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Header */}
      <div className="bg-gray-900/80 backdrop-blur-lg shadow-xl border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex items-center justify-center gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="p-2 sm:p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl sm:rounded-2xl shadow-lg">
              <Bike className="text-white w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent text-center">
              Bike Battle Arena
            </h1>
          </div>
          
          {/* Navigation Tabs - Centered and Mobile Responsive */}
          <div className="flex flex-wrap gap-2 sm:gap-4 justify-center">
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
            <TabButton 
              tab="contact" 
              icon={MessageCircle} 
              label="Contact" 
              isActive={activeTab === 'contact'} 
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <>
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
        )}
      </div>
    </div>
  );
};

export default Index;
