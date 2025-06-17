
import React, { useState } from 'react';
import { Search, Trophy, TrendingUp, TrendingDown, Star, Award } from 'lucide-react';
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
      <div className="text-center py-16">
        <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-full w-32 h-32 mx-auto mb-6 flex items-center justify-center">
          <Search className="text-purple-500" size={64} />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">No Bikes to Discover</h2>
        <p className="text-xl text-gray-600">Upload some bikes first to use the search feature!</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Search className="text-blue-500" size={28} />
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Find Your Champion
          </h2>
        </div>
        <p className="text-xl text-gray-600">Click on any bike to see its ranking and battle stats</p>
      </div>

      {/* Bike Gallery */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {bikes.map((bike) => (
          <Card 
            key={bike.id}
            className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 border-0 bg-white/70 backdrop-blur-sm overflow-hidden"
            onClick={() => setSelectedBike(bike)}
          >
            <CardContent className="p-0">
              <div className="relative">
                <img
                  src={bike.imageUrl}
                  alt="Uploaded bike"
                  className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-2 left-2 right-2">
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2 text-center">
                    <div className="text-xs font-bold text-purple-600">
                      #{getBikeRank(bike.id)}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Selected Bike Details */}
      {selectedBike && (
        <Card className="max-w-4xl mx-auto shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="relative overflow-hidden rounded-2xl">
                  <img
                    src={selectedBike.imageUrl}
                    alt="Selected bike"
                    className="w-full h-80 object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      #{getBikeRank(selectedBike.id)} RANKED
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="text-center md:text-left">
                  <h3 className="text-3xl font-bold text-gray-800 mb-4">
                    Champion Stats
                  </h3>
                  <div className="flex items-center justify-center md:justify-start gap-3 mb-6">
                    <Award className="text-yellow-500" size={24} />
                    <span className="text-xl font-bold bg-gradient-to-r from-yellow-600 to-orange-500 bg-clip-text text-transparent">
                      Rank #{getBikeRank(selectedBike.id)} of {bikes.length}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
                    <span className="font-bold text-gray-700">Battle Rating</span>
                    <div className="flex items-center gap-2">
                      <Star className="text-yellow-500" size={18} />
                      <span className="text-xl font-bold text-blue-600">{selectedBike.rating}</span>
                      {getRatingTrend(selectedBike) === 'rising' && (
                        <TrendingUp className="text-green-500" size={18} />
                      )}
                      {getRatingTrend(selectedBike) === 'falling' && (
                        <TrendingDown className="text-red-500" size={18} />
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
                      <div className="font-bold text-gray-700 text-sm mb-1">Victories</div>
                      <div className="text-2xl font-bold text-green-600">{selectedBike.wins}</div>
                    </div>

                    <div className="p-4 bg-gradient-to-br from-red-50 to-pink-50 rounded-xl border border-red-100">
                      <div className="font-bold text-gray-700 text-sm mb-1">Defeats</div>
                      <div className="text-2xl font-bold text-red-600">{selectedBike.losses}</div>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                    <div className="font-bold text-gray-700 mb-2">Win Rate</div>
                    <div className="text-xl font-bold text-purple-600">
                      {selectedBike.wins + selectedBike.losses === 0 
                        ? 'No battles yet' 
                        : `${Math.round((selectedBike.wins / (selectedBike.wins + selectedBike.losses)) * 100)}%`
                      }
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl border border-gray-100">
                    <div className="font-bold text-gray-700 mb-2">Joined Arena</div>
                    <div className="text-gray-600">
                      {selectedBike.uploadedAt.toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  className="w-full mt-6 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 border-gray-300 py-3"
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
