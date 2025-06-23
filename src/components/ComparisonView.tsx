
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
        <div className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full w-32 h-32 mx-auto mb-6 flex items-center justify-center">
          <Trophy className="text-orange-500" size={64} />
        </div>
        <h2 className="text-3xl font-bold text-gray-100 mb-4">Ready for Competition</h2>
        <p className="text-xl text-gray-300 mb-8">Upload at least 2 bikes to start head-to-head comparisons!</p>
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-md mx-auto border border-gray-600">
          <p className="text-lg font-semibold text-gray-200">Current entries: {bikes.length}/2</p>
        </div>
      </div>
    );
  }

  if (!currentPair) {
    return (
      <div className="text-center py-16">
        <div className="relative">
          <div className="animate-spin mx-auto w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full mb-6"></div>
          <Zap className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-purple-500" size={24} />
        </div>
        <p className="text-xl text-gray-300">Preparing next matchup...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Crown className="text-yellow-500" size={32} />
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Head-to-Head Showdown
          </h2>
          <Crown className="text-yellow-500" size={32} />
        </div>
        <p className="text-xl text-gray-300">Choose your winner! Each vote affects the Elo rankings.</p>
      </div>

      <div className={`transition-all duration-500 ${isAnimating ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}>
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {currentPair.map((bike, index) => (
            <Card 
              key={bike.id}
              className="group cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 border-0 bg-white/10 backdrop-blur-sm overflow-hidden hover:bg-white/20"
              onClick={() => handleVote(bike.id, currentPair[1 - index].id)}
            >
              <CardContent className="p-0">
                <div className="relative overflow-hidden">
                  <img
                    src={bike.imageUrl}
                    alt="Bike for comparison"
                    className="w-full h-72 object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                    <span className="text-sm font-bold text-white">
                      ⭐ {bike.rating}
                    </span>
                  </div>
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    ELO RATED
                  </div>
                </div>
                
                <div className="p-6 bg-gradient-to-br from-gray-800/90 to-gray-900/90">
                  <div className="flex justify-between items-center text-sm text-gray-300 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="font-semibold">Wins: {bike.wins}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="font-semibold">Losses: {bike.losses}</span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 shadow-lg hover:shadow-xl transition-all duration-300"
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
          className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 border-gray-600 hover:border-purple-400 transition-all duration-300 text-gray-200"
          disabled={isAnimating}
        >
          <RotateCcw size={18} />
          Skip Matchup
        </Button>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 max-w-md mx-auto border border-gray-600">
          <p className="text-gray-300">
            <span className="font-semibold text-purple-400">{bikes.length}</span> bikes competing with Elo ratings
          </p>
        </div>
      </div>
    </div>
  );
};

export default ComparisonView;
