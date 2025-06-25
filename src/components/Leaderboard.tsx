
import React from 'react';
import { Trophy, Medal, Award, TrendingUp, Crown, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { BikePhoto } from '@/pages/Index';

interface LeaderboardProps {
  bikes: BikePhoto[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({ bikes }) => {
  const sortedBikes = [...bikes].sort((a, b) => b.rating - a.rating);

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Trophy className="text-yellow-500" size={24} />;
      case 2:
        return <Medal className="text-gray-400" size={24} />;
      case 3:
        return <Award className="text-orange-600" size={24} />;
      default:
        return <span className="text-lg font-bold text-gray-600">#{position}</span>;
    }
  };

  const getRankColor = (position: number) => {
    switch (position) {
      case 1:
        return 'from-yellow-100 to-yellow-50 border-yellow-200';
      case 2:
        return 'from-gray-100 to-gray-50 border-gray-200';
      case 3:
        return 'from-orange-100 to-orange-50 border-orange-200';
      default:
        return 'from-blue-50 to-white border-gray-200';
    }
  };

  if (bikes.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="bg-white border-2 border-black w-32 h-32 mx-auto mb-6 flex items-center justify-center">
          <Trophy className="text-black" size={64} />
        </div>
        <h2 className="text-3xl font-bold text-black mb-4">Champions Board Empty</h2>
        <p className="text-xl text-black">Upload some bikes to see the leaderboard!</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Crown className="text-black" size={32} />
          <h2 className="text-3xl font-bold text-black">
            Leaderboard
          </h2>
          <Crown className="text-black" size={32} />
        </div>
        <p className="text-xl text-black">Hall of fame - Top bikes ranked by community votes</p>
      </div>

      {/* Top 3 Podium */}
      {sortedBikes.length >= 3 && (
        <div className="max-w-5xl mx-auto mb-12">
          <div className="grid grid-cols-3 gap-6 items-end">
            {/* 2nd Place */}
            <Card className="bg-white border-2 border-black shadow-xl">
              <CardContent className="p-6 text-center">
                <div className="mb-4">
                  <Medal className="mx-auto text-black" size={40} />
                </div>
                <div className="relative overflow-hidden mb-4">
                  <img
                    src={sortedBikes[1].imageUrl}
                    alt="2nd place bike"
                    className="w-full h-32 object-cover"
                  />
                </div>
                <div className="text-lg font-bold text-black mb-1">Silver Champion</div>
                <div className="text-2xl font-bold text-black">{sortedBikes[1].rating}</div>
              </CardContent>
            </Card>

            {/* 1st Place */}
            <Card className="bg-white border-2 border-black shadow-2xl transform scale-110">
              <CardContent className="p-8 text-center">
                <div className="mb-4">
                  <div className="relative">
                    <Trophy className="mx-auto text-black" size={48} />
                    <Star className="absolute -top-2 -right-2 text-black" size={20} />
                  </div>
                </div>
                <div className="relative overflow-hidden mb-4">
                  <img
                    src={sortedBikes[0].imageUrl}
                    alt="1st place bike"
                    className="w-full h-36 object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-black text-white px-2 py-1 text-xs font-bold">
                    👑 CHAMPION
                  </div>
                </div>
                <div className="text-xl font-bold text-black mb-2">Ultimate Champion</div>
                <div className="text-3xl font-bold text-black">{sortedBikes[0].rating}</div>
              </CardContent>
            </Card>

            {/* 3rd Place */}
            <Card className="bg-white border-2 border-black shadow-xl">
              <CardContent className="p-6 text-center">
                <div className="mb-4">
                  <Award className="mx-auto text-black" size={40} />
                </div>
                <div className="relative overflow-hidden mb-4">
                  <img
                    src={sortedBikes[2].imageUrl}
                    alt="3rd place bike"
                    className="w-full h-32 object-cover"
                  />
                </div>
                <div className="text-lg font-bold text-black mb-1">Bronze Champion</div>
                <div className="text-2xl font-bold text-black">{sortedBikes[2].rating}</div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Full Leaderboard */}
      <div className="max-w-5xl mx-auto space-y-4">
        {sortedBikes.map((bike, index) => {
          const position = index + 1;
          const winRate = bike.wins + bike.losses > 0 
            ? (bike.wins / (bike.wins + bike.losses)) * 100 
            : 0;

          return (
            <Card 
              key={bike.id}
              className="bg-white border-2 border-black transition-all duration-300 hover:shadow-xl hover:scale-[1.02] shadow-lg"
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-6">
                  {/* Rank */}
                  <div className="flex-shrink-0 w-16 flex justify-center">
                    {getRankIcon(position)}
                  </div>

                  {/* Bike Image */}
                  <div className="flex-shrink-0">
                    <div className="relative overflow-hidden">
                      <img
                        src={bike.imageUrl}
                        alt={`Bike ranked #${position}`}
                        className="w-20 h-20 object-cover"
                      />
                      <div className="absolute inset-0 bg-black/20"></div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex-grow grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
                    <div className="text-center">
                      <div className="font-bold text-black mb-1">Rating</div>
                      <div className="text-xl font-bold text-black">
                        {bike.rating}
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="font-bold text-black mb-1">W/L Record</div>
                      <div className="font-bold">
                        <span className="text-black">{bike.wins}</span>
                        <span className="text-black mx-2">/</span>
                        <span className="text-black">{bike.losses}</span>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="font-bold text-black mb-1">Win Rate</div>
                      <div className="font-bold text-black">
                        {bike.wins + bike.losses === 0 ? 'New' : `${Math.round(winRate)}%`}
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="font-bold text-black mb-1">Total Battles</div>
                      <div className="font-bold text-black">{bike.wins + bike.losses}</div>
                    </div>
                  </div>

                  {/* Trend */}
                  <div className="flex-shrink-0">
                    {winRate > 60 && bike.wins + bike.losses > 0 && (
                      <div className="bg-white border-2 border-black p-2">
                        <TrendingUp className="text-black" size={20} />
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="text-center mt-12">
        <div className="bg-white border-2 border-black p-6 max-w-2xl mx-auto">
          <p className="text-black mb-2">
            🏆 Rankings update in real-time based on community votes
          </p>
          <div className="flex justify-center gap-8 text-sm">
            <span className="font-semibold text-black">
              {bikes.length} Total Bikes
            </span>
            <span className="font-semibold text-black">
              {sortedBikes.reduce((sum, bike) => sum + bike.wins + bike.losses, 0)} Total Battles
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
