
import React, { useState, useEffect } from 'react';
import { Trophy, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BikePhoto } from '@/pages/Index';

interface ComparisonViewProps {
  bikes: BikePhoto[];
  onVote: (winnerId: string, loserId: string) => void;
}

const ComparisonView: React.FC<ComparisonViewProps> = ({ bikes, onVote }) => {
  const [currentPair, setCurrentPair] = useState<[BikePhoto, BikePhoto] | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const getRandomPair = () => {
    if (bikes.length < 2) return null;
    
    const shuffled = [...bikes].sort(() => Math.random() - 0.5);
    return [shuffled[0], shuffled[1]] as [BikePhoto, BikePhoto];
  };

  const loadNewPair = () => {
    const newPair = getRandomPair();
    setCurrentPair(newPair);
  };

  useEffect(() => {
    loadNewPair();
  }, [bikes]);

  const handleVote = (winnerId: string, loserId: string) => {
    setIsAnimating(true);
    onVote(winnerId, loserId);
    
    setTimeout(() => {
      loadNewPair();
      setIsAnimating(false);
    }, 500);
  };

  if (bikes.length < 2) {
    return (
      <div className="text-center py-12">
        <Trophy className="mx-auto text-gray-400 mb-4" size={64} />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Not Enough Bikes to Compare</h2>
        <p className="text-gray-600 mb-6">Upload at least 2 bikes to start the comparison battle!</p>
        <p className="text-sm text-gray-500">Current bikes: {bikes.length}</p>
      </div>
    );
  }

  if (!currentPair) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin mx-auto w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div>
        <p className="text-gray-600">Loading comparison...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Which Bike is Better?</h2>
        <p className="text-gray-600">Click on the bike you think looks better!</p>
      </div>

      <div className={`transition-all duration-500 ${isAnimating ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {currentPair.map((bike, index) => (
            <Card 
              key={bike.id}
              className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105"
              onClick={() => handleVote(bike.id, currentPair[1 - index].id)}
            >
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    src={bike.imageUrl}
                    alt="Bike for comparison"
                    className="w-full h-64 object-cover rounded-t-lg"
                  />
                  <div className="absolute top-4 right-4 bg-white bg-opacity-90 px-3 py-1 rounded-full">
                    <span className="text-sm font-semibold text-gray-700">
                      Rating: {bike.rating}
                    </span>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <span>Wins: {bike.wins}</span>
                    <span>Losses: {bike.losses}</span>
                  </div>
                  
                  <Button 
                    className="w-full mt-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleVote(bike.id, currentPair[1 - index].id);
                    }}
                  >
                    Vote for This Bike
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="text-center">
        <Button 
          variant="outline" 
          onClick={loadNewPair}
          className="flex items-center gap-2"
          disabled={isAnimating}
        >
          <RotateCcw size={16} />
          Skip This Pair
        </Button>
      </div>

      <div className="text-center text-sm text-gray-500">
        <p>Total bikes in competition: {bikes.length}</p>
      </div>
    </div>
  );
};

export default ComparisonView;
