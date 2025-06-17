
import React from 'react';
import { Trophy, Medal, Award, TrendingUp } from 'lucide-react';
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
      <div className="text-center py-12">
        <Trophy className="mx-auto text-gray-400 mb-4" size={64} />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">No Bikes in Competition</h2>
        <p className="text-gray-600">Upload some bikes to see the leaderboard!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Bike Leaderboard</h2>
        <p className="text-gray-600">Top-ranked bikes based on community votes</p>
      </div>

      {/* Top 3 Podium */}
      {sortedBikes.length >= 3 && (
        <div className="max-w-4xl mx-auto mb-8">
          <div className="grid grid-cols-3 gap-4 items-end">
            {/* 2nd Place */}
            <Card className="bg-gradient-to-b from-gray-100 to-gray-50 border-gray-200">
              <CardContent className="p-4 text-center">
                <div className="mb-2">
                  <Medal className="mx-auto text-gray-400" size={32} />
                </div>
                <img
                  src={sortedBikes[1].imageUrl}
                  alt="2nd place bike"
                  className="w-full h-24 object-cover rounded mb-2"
                />
                <div className="text-sm font-semibold">2nd Place</div>
                <div className="text-lg font-bold">{sortedBikes[1].rating}</div>
              </CardContent>
            </Card>

            {/* 1st Place */}
            <Card className="bg-gradient-to-b from-yellow-100 to-yellow-50 border-yellow-200 transform scale-110">
              <CardContent className="p-4 text-center">
                <div className="mb-2">
                  <Trophy className="mx-auto text-yellow-500" size={40} />
                </div>
                <img
                  src={sortedBikes[0].imageUrl}
                  alt="1st place bike"
                  className="w-full h-28 object-cover rounded mb-2"
                />
                <div className="text-sm font-semibold text-yellow-700">Champion</div>
                <div className="text-xl font-bold text-yellow-800">{sortedBikes[0].rating}</div>
              </CardContent>
            </Card>

            {/* 3rd Place */}
            <Card className="bg-gradient-to-b from-orange-100 to-orange-50 border-orange-200">
              <CardContent className="p-4 text-center">
                <div className="mb-2">
                  <Award className="mx-auto text-orange-600" size={32} />
                </div>
                <img
                  src={sortedBikes[2].imageUrl}
                  alt="3rd place bike"
                  className="w-full h-24 object-cover rounded mb-2"
                />
                <div className="text-sm font-semibold">3rd Place</div>
                <div className="text-lg font-bold">{sortedBikes[2].rating}</div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Full Leaderboard */}
      <div className="max-w-4xl mx-auto space-y-3">
        {sortedBikes.map((bike, index) => {
          const position = index + 1;
          const winRate = bike.wins + bike.losses > 0 
            ? (bike.wins / (bike.wins + bike.losses)) * 100 
            : 0;

          return (
            <Card 
              key={bike.id}
              className={`bg-gradient-to-r ${getRankColor(position)} transition-all duration-200 hover:shadow-md`}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  {/* Rank */}
                  <div className="flex-shrink-0 w-12 flex justify-center">
                    {getRankIcon(position)}
                  </div>

                  {/* Bike Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={bike.imageUrl}
                      alt={`Bike ranked #${position}`}
                      className="w-16 h-16 object-cover rounded"
                    />
                  </div>

                  {/* Stats */}
                  <div className="flex-grow grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="font-semibold text-gray-700">Rating</div>
                      <div className="text-lg font-bold">{bike.rating}</div>
                    </div>
                    
                    <div>
                      <div className="font-semibold text-gray-700">W/L</div>
                      <div className="font-bold">
                        <span className="text-green-600">{bike.wins}</span>
                        <span className="text-gray-400 mx-1">/</span>
                        <span className="text-red-600">{bike.losses}</span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="font-semibold text-gray-700">Win Rate</div>
                      <div className="font-bold">
                        {bike.wins + bike.losses === 0 ? '-' : `${Math.round(winRate)}%`}
                      </div>
                    </div>
                    
                    <div>
                      <div className="font-semibold text-gray-700">Battles</div>
                      <div className="font-bold">{bike.wins + bike.losses}</div>
                    </div>
                  </div>

                  {/* Trend */}
                  <div className="flex-shrink-0">
                    {winRate > 60 && bike.wins + bike.losses > 0 && (
                      <TrendingUp className="text-green-500" size={20} />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="text-center text-sm text-gray-500 mt-8">
        <p>Rankings update in real-time based on community votes</p>
        <p>Total bikes: {bikes.length} | Total battles: {sortedBikes.reduce((sum, bike) => sum + bike.wins + bike.losses, 0)}</p>
      </div>
    </div>
  );
};

export default Leaderboard;
