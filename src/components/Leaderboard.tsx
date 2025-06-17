
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
        <div className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full w-32 h-32 mx-auto mb-6 flex items-center justify-center">
          <Trophy className="text-orange-500" size={64} />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Champions Board Empty</h2>
        <p className="text-xl text-gray-600">Upload some bikes to see the leaderboard!</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Crown className="text-yellow-500" size={32} />
          <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 via-orange-500 to-red-500 bg-clip-text text-transparent">
            Champions Leaderboard
          </h2>
          <Crown className="text-yellow-500" size={32} />
        </div>
        <p className="text-xl text-gray-600">Hall of fame - Top bikes ranked by community votes</p>
      </div>

      {/* Top 3 Podium */}
      {sortedBikes.length >= 3 && (
        <div className="max-w-5xl mx-auto mb-12">
          <div className="grid grid-cols-3 gap-6 items-end">
            {/* 2nd Place */}
            <Card className="bg-gradient-to-br from-gray-100 via-gray-50 to-white border-2 border-gray-300 shadow-xl">
              <CardContent className="p-6 text-center">
                <div className="mb-4">
                  <Medal className="mx-auto text-gray-400" size={40} />
                </div>
                <div className="relative overflow-hidden rounded-xl mb-4">
                  <img
                    src={sortedBikes[1].imageUrl}
                    alt="2nd place bike"
                    className="w-full h-32 object-cover"
                  />
                </div>
                <div className="text-lg font-bold text-gray-600 mb-1">Silver Champion</div>
                <div className="text-2xl font-bold text-gray-700">{sortedBikes[1].rating}</div>
              </CardContent>
            </Card>

            {/* 1st Place */}
            <Card className="bg-gradient-to-br from-yellow-200 via-yellow-100 to-yellow-50 border-2 border-yellow-400 shadow-2xl transform scale-110">
              <CardContent className="p-8 text-center">
                <div className="mb-4">
                  <div className="relative">
                    <Trophy className="mx-auto text-yellow-600" size={48} />
                    <Star className="absolute -top-2 -right-2 text-yellow-400" size={20} />
                  </div>
                </div>
                <div className="relative overflow-hidden rounded-xl mb-4">
                  <img
                    src={sortedBikes[0].imageUrl}
                    alt="1st place bike"
                    className="w-full h-36 object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold">
                    👑 CHAMPION
                  </div>
                </div>
                <div className="text-xl font-bold text-yellow-800 mb-2">Ultimate Champion</div>
                <div className="text-3xl font-bold text-yellow-900">{sortedBikes[0].rating}</div>
              </CardContent>
            </Card>

            {/* 3rd Place */}
            <Card className="bg-gradient-to-br from-orange-100 via-orange-50 to-white border-2 border-orange-300 shadow-xl">
              <CardContent className="p-6 text-center">
                <div className="mb-4">
                  <Award className="mx-auto text-orange-600" size={40} />
                </div>
                <div className="relative overflow-hidden rounded-xl mb-4">
                  <img
                    src={sortedBikes[2].imageUrl}
                    alt="3rd place bike"
                    className="w-full h-32 object-cover"
                  />
                </div>
                <div className="text-lg font-bold text-orange-600 mb-1">Bronze Champion</div>
                <div className="text-2xl font-bold text-orange-700">{sortedBikes[2].rating}</div>
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
              className={`bg-gradient-to-r ${getRankColor(position)} transition-all duration-300 hover:shadow-xl hover:scale-[1.02] border-0 shadow-lg`}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-6">
                  {/* Rank */}
                  <div className="flex-shrink-0 w-16 flex justify-center">
                    {getRankIcon(position)}
                  </div>

                  {/* Bike Image */}
                  <div className="flex-shrink-0">
                    <div className="relative overflow-hidden rounded-xl">
                      <img
                        src={bike.imageUrl}
                        alt={`Bike ranked #${position}`}
                        className="w-20 h-20 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex-grow grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
                    <div className="text-center">
                      <div className="font-bold text-gray-700 mb-1">Rating</div>
                      <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {bike.rating}
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="font-bold text-gray-700 mb-1">W/L Record</div>
                      <div className="font-bold">
                        <span className="text-green-600">{bike.wins}</span>
                        <span className="text-gray-400 mx-2">/</span>
                        <span className="text-red-600">{bike.losses}</span>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="font-bold text-gray-700 mb-1">Win Rate</div>
                      <div className="font-bold text-purple-600">
                        {bike.wins + bike.losses === 0 ? 'New' : `${Math.round(winRate)}%`}
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="font-bold text-gray-700 mb-1">Total Battles</div>
                      <div className="font-bold text-blue-600">{bike.wins + bike.losses}</div>
                    </div>
                  </div>

                  {/* Trend */}
                  <div className="flex-shrink-0">
                    {winRate > 60 && bike.wins + bike.losses > 0 && (
                      <div className="bg-green-100 p-2 rounded-full">
                        <TrendingUp className="text-green-600" size={20} />
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
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 max-w-2xl mx-auto">
          <p className="text-gray-600 mb-2">
            🏆 Rankings update in real-time based on community votes
          </p>
          <div className="flex justify-center gap-8 text-sm">
            <span className="font-semibold text-purple-600">
              {bikes.length} Total Bikes
            </span>
            <span className="font-semibold text-blue-600">
              {sortedBikes.reduce((sum, bike) => sum + bike.wins + bike.losses, 0)} Total Battles
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
