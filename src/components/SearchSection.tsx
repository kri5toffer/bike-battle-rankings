
import React, { useState } from 'react';
import { Search, Trophy, TrendingUp, TrendingDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BikePhoto } from '@/pages/Index';

interface SearchSectionProps {
  bikes: BikePhoto[];
}

const SearchSection: React.FC<SearchSectionProps> = ({ bikes }) => {
  const [selectedBike, setSelectedBike] = useState<BikePhoto | null>(null);

  const sortedBikes = [...bikes].sort((a, b) => b.rating - a.rating);

  const getBikeRank = (bikeId: string) => {
    return sortedBikes.findIndex(bike => bike.id === bikeId) + 1;
  };

  const getRatingTrend = (bike: BikePhoto) => {
    const totalGames = bike.wins + bike.losses;
    if (totalGames === 0) return 'new';
    const winRate = bike.wins / totalGames;
    return winRate > 0.5 ? 'rising' : 'falling';
  };

  if (bikes.length === 0) {
    return (
      <div className="text-center py-12">
        <Search className="mx-auto text-gray-400 mb-4" size={64} />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">No Bikes to Search</h2>
        <p className="text-gray-600">Upload some bikes first to use the search feature!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Find Your Bike</h2>
        <p className="text-gray-600">Click on any bike to see its ranking and stats</p>
      </div>

      {/* Bike Gallery */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {bikes.map((bike) => (
          <Card 
            key={bike.id}
            className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105"
            onClick={() => setSelectedBike(bike)}
          >
            <CardContent className="p-0">
              <img
                src={bike.imageUrl}
                alt="Uploaded bike"
                className="w-full h-32 object-cover rounded-t-lg"
              />
              <div className="p-2">
                <div className="text-xs text-gray-500 text-center">
                  Rank #{getBikeRank(bike.id)}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Selected Bike Details */}
      {selectedBike && (
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <img
                  src={selectedBike.imageUrl}
                  alt="Selected bike"
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
              
              <div className="space-y-4">
                <div className="text-center md:text-left">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Bike Stats
                  </h3>
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                    <Trophy className="text-yellow-500" size={20} />
                    <span className="text-lg font-semibold">
                      Rank #{getBikeRank(selectedBike.id)} of {bikes.length}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Rating</span>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold">{selectedBike.rating}</span>
                      {getRatingTrend(selectedBike) === 'rising' && (
                        <TrendingUp className="text-green-500" size={16} />
                      )}
                      {getRatingTrend(selectedBike) === 'falling' && (
                        <TrendingDown className="text-red-500" size={16} />
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Wins</span>
                    <span className="text-lg font-bold text-green-600">{selectedBike.wins}</span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Losses</span>
                    <span className="text-lg font-bold text-red-600">{selectedBike.losses}</span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Win Rate</span>
                    <span className="text-lg font-bold">
                      {selectedBike.wins + selectedBike.losses === 0 
                        ? 'No battles yet' 
                        : `${Math.round((selectedBike.wins / (selectedBike.wins + selectedBike.losses)) * 100)}%`
                      }
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Uploaded</span>
                    <span className="text-sm text-gray-600">
                      {selectedBike.uploadedAt.toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={() => setSelectedBike(null)}
                >
                  Close Details
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SearchSection;
