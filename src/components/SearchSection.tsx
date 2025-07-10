import React, { useState } from 'react';
import { Search, Trophy, TrendingUp, TrendingDown, Star, Award, Calendar, MapPin, Bike, Building, Hash } from 'lucide-react';
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
        <div className="bg-white border-2 border-black w-32 h-32 mx-auto mb-6 flex items-center justify-center">
          <Search className="text-black" size={64} />
        </div>
        <h2 className="text-3xl font-bold text-black mb-4">No Bikes to Discover</h2>
        <p className="text-xl text-black">Upload some bikes first to use the search feature!</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Search className="text-black" size={28} />
          <h2 className="text-3xl font-bold text-black">
            Find a Bike
          </h2>
        </div>
        <p className="text-xl text-black">Click on any bike to see its ranking and battle stats</p>
      </div>

      {/* Bike Gallery */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {bikes.map((bike) => (
          <Card 
            key={bike.id}
            className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 border-2 border-black bg-white overflow-hidden"
            onClick={() => setSelectedBike(bike)}
          >
            <CardContent className="p-0">
              <div className="relative">
                <img
                  src={bike.imageUrl}
                  alt="Uploaded bike"
                  className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-2 left-2 right-2">
                  <div className="bg-white border-2 border-black p-2 text-center">
                    <div className="text-xs font-bold text-black">
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
        <Card className="max-w-4xl mx-auto shadow-2xl border-2 border-black bg-white">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="relative overflow-hidden">
                  <img
                    src={selectedBike.imageUrl}
                    alt="Selected bike"
                    className="w-full h-96 object-cover border-2 border-black"
                  />
                  <div className="absolute top-4 left-4">
                    <div className="bg-black text-white px-3 py-1 text-sm font-bold">
                      #{getBikeRank(selectedBike.id)} RANKED
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="text-center md:text-left">
                  <h3 className="text-3xl font-bold text-black mb-2">
                    {selectedBike.bikeName || 'Unnamed Bike'}
                  </h3>
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                    <Bike className="text-black" size={20} />
                    <span className="text-lg text-black">{selectedBike.bikeType || 'Unknown Type'}</span>
                  </div>
                  <div className="flex items-center justify-center md:justify-start gap-3 mb-6">
                    <Award className="text-black" size={24} />
                    <span className="text-xl font-bold text-black">
                      Rank #{getBikeRank(selectedBike.id)} of {bikes.length}
                    </span>
                  </div>
                </div>

                {/* Bike Details */}
                <div className="space-y-4">
                  {selectedBike.brand && (
                    <div className="flex items-center gap-3 p-3 bg-white border-2 border-black">
                      <Building className="text-black" size={18} />
                      <div>
                        <div className="font-bold text-black text-sm">Brand</div>
                        <div className="text-black">{selectedBike.brand}</div>
                      </div>
                    </div>
                  )}

                  {selectedBike.model && (
                    <div className="flex items-center gap-3 p-3 bg-white border-2 border-black">
                      <Hash className="text-black" size={18} />
                      <div>
                        <div className="font-bold text-black text-sm">Model</div>
                        <div className="text-black">{selectedBike.model}</div>
                      </div>
                    </div>
                  )}

                  {selectedBike.year && (
                    <div className="flex items-center gap-3 p-3 bg-white border-2 border-black">
                      <Calendar className="text-black" size={18} />
                      <div>
                        <div className="font-bold text-black text-sm">Year</div>
                        <div className="text-black">{selectedBike.year}</div>
                      </div>
                    </div>
                  )}

                  {selectedBike.mostOftenRiddenRoute && (
                    <div className="flex items-center gap-3 p-3 bg-white border-2 border-black">
                      <MapPin className="text-black" size={18} />
                      <div>
                        <div className="font-bold text-black text-sm">Most Often Ridden Route</div>
                        <div className="text-black">{selectedBike.mostOftenRiddenRoute}</div>
                      </div>
                    </div>
                  )}

                  {selectedBike.description && (
                    <div className="p-3 bg-white border-2 border-black">
                      <div className="font-bold text-black text-sm mb-2">Description</div>
                      <div className="text-black">{selectedBike.description}</div>
                    </div>
                  )}

                  <div className="flex justify-between items-center p-4 bg-white border-2 border-black">
                    <span className="font-bold text-black">Battle Rating</span>
                    <div className="flex items-center gap-2">
                      <Star className="text-black" size={18} />
                      <span className="text-xl font-bold text-black">{selectedBike.rating}</span>
                      {getRatingTrend(selectedBike) === 'rising' && (
                        <TrendingUp className="text-black" size={18} />
                      )}
                      {getRatingTrend(selectedBike) === 'falling' && (
                        <TrendingDown className="text-black" size={18} />
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white border-2 border-black">
                      <div className="font-bold text-black text-sm mb-1">Victories</div>
                      <div className="text-2xl font-bold text-black">{selectedBike.wins}</div>
                    </div>

                    <div className="p-4 bg-white border-2 border-black">
                      <div className="font-bold text-black text-sm mb-1">Defeats</div>
                      <div className="text-2xl font-bold text-black">{selectedBike.losses}</div>
                    </div>
                  </div>

                  <div className="p-4 bg-white border-2 border-black">
                    <div className="font-bold text-black mb-2">Win Rate</div>
                    <div className="text-xl font-bold text-black">
                      {selectedBike.wins + selectedBike.losses === 0 
                        ? 'No battles yet' 
                        : `${Math.round((selectedBike.wins / (selectedBike.wins + selectedBike.losses)) * 100)}%`
                      }
                    </div>
                  </div>

                  <div className="p-4 bg-white border-2 border-black">
                    <div className="font-bold text-black mb-2">Joined Arena</div>
                    <div className="text-black">
                      {selectedBike.uploadedAt.toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  className="w-full mt-6 bg-white border-2 border-black text-black hover:bg-black hover:text-white py-3"
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
