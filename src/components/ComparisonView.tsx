
import React, { useState, useEffect } from 'react';
import { Trophy, RotateCcw, Zap, Crown } from 'lucide-react';
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
      <div className="text-center py-16">
        <div className="bg-white border-2 border-black w-32 h-32 mx-auto mb-6 flex items-center justify-center">
          <Trophy className="text-black" size={64} />
        </div>
        <h2 className="text-3xl font-bold text-black mb-4">Ready for Competition</h2>
        <p className="text-xl text-black mb-8">Upload at least 2 bikes to start head-to-head comparisons!</p>
        <div className="bg-white border-2 border-black p-6 max-w-md mx-auto">
          <p className="text-lg font-semibold text-black">Current entries: {bikes.length}/2</p>
        </div>
      </div>
    );
  }

  if (!currentPair) {
    return (
      <div className="text-center py-16">
        <div className="relative">
          <div className="animate-spin mx-auto w-16 h-16 border-4 border-black border-t-transparent mb-6"></div>
          <Zap className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-black" size={24} />
        </div>
        <p className="text-xl text-black">Preparing next matchup...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Crown className="text-black" size={32} />
          <h2 className="text-3xl font-bold text-black">
            Left or Right - Vote for a Bike
          </h2>
          <Crown className="text-black" size={32} />
        </div>
        <p className="text-xl text-black">Choose your winner! Each vote affects the Elo rankings.</p>
      </div>

      <div className={`transition-all duration-500 ${isAnimating ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}>
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {currentPair.map((bike, index) => (
            <Card 
              key={bike.id}
              className="group cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 border-2 border-black bg-white overflow-hidden"
              onClick={() => handleVote(bike.id, currentPair[1 - index].id)}
            >
              <CardContent className="p-0">
                <div className="relative overflow-hidden">
                  <img
                    src={bike.imageUrl}
                    alt="Bike for comparison"
                    className="w-full h-72 object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute top-4 right-4 bg-white border-2 border-black px-4 py-2">
                    <span className="text-sm font-bold text-black">
                      ⭐ {bike.rating}
                    </span>
                  </div>
                  <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 text-xs font-semibold">
                    ELO RATED
                  </div>
                </div>
                
                <div className="p-6 bg-white border-t-2 border-black">
                  <div className="flex justify-between items-center text-sm text-black mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-black"></div>
                      <span className="font-semibold">Wins: {bike.wins}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-black"></div>
                      <span className="font-semibold">Losses: {bike.losses}</span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full bg-black text-white hover:bg-white hover:text-black border-2 border-black font-bold py-3 transition-all duration-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleVote(bike.id, currentPair[1 - index].id);
                    }}
                  >
                    <Trophy size={18} className="mr-2" />
                    Select Winner
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="text-center space-y-4">
        <Button 
          variant="outline" 
          onClick={loadNewPair}
          className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-black hover:bg-black hover:text-white transition-all duration-300 text-black"
          disabled={isAnimating}
        >
          <RotateCcw size={18} />
          Skip Matchup
        </Button>

        <div className="bg-white border-2 border-black p-4 max-w-md mx-auto">
          <p className="text-black">
            <span className="font-semibold">{bikes.length}</span> bikes competing with Elo ratings
          </p>
        </div>
      </div>
    </div>
  );
};

export default ComparisonView;
