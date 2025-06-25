
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { BikePhoto } from '@/pages/Index';
import { BikeDetails } from '@/components/BikeDetailsForm';

export const useBikes = () => {
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
        description: bike.description,
        mostOftenRiddenRoute: bike.most_often_ridden_route
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
          description: details.description || null,
          most_often_ridden_route: details.mostOftenRiddenRoute || null
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
        description: data.description,
        mostOftenRiddenRoute: data.most_often_ridden_route
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

  return {
    bikes,
    isLoading,
    addBike,
    updateBikeRatings
  };
};
