
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BikeDetailsFormProps {
  onSubmit: (details: BikeDetails) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export interface BikeDetails {
  bikeName: string;
  bikeType: string;
  brand: string;
  model: string;
  year: number | null;
  description: string;
  mostOftenRiddenRoute: string;
}

const BikeDetailsForm: React.FC<BikeDetailsFormProps> = ({ onSubmit, onCancel, isSubmitting }) => {
  const [details, setDetails] = useState<BikeDetails>({
    bikeName: '',
    bikeType: '',
    brand: '',
    model: '',
    year: null,
    description: '',
    mostOftenRiddenRoute: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (details.bikeName.trim() && details.bikeType.trim()) {
      onSubmit(details);
    }
  };

  const bikeTypes = [
    'Road Bike',
    'Mountain Bike',
    'Hybrid Bike',
    'Electric Bike',
    'BMX',
    'Cruiser',
    'Touring Bike',
    'Gravel Bike',
    'Cyclocross',
    'Fixed Gear',
    'Other'
  ];

  return (
    <Card className="max-w-2xl mx-auto bg-white border-2 border-black">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-black text-center">
          Tell Us About Your Bike
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="bikeName" className="text-black font-medium">
                Bike Name *
              </Label>
              <Input
                id="bikeName"
                value={details.bikeName}
                onChange={(e) => setDetails(prev => ({ ...prev, bikeName: e.target.value }))}
                placeholder="My awesome bike"
                className="bg-white border-2 border-black text-black placeholder-gray-400"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bikeType" className="text-black font-medium">
                Bike Type *
              </Label>
              <Select value={details.bikeType} onValueChange={(value) => setDetails(prev => ({ ...prev, bikeType: value }))}>
                <SelectTrigger className="bg-white border-2 border-black text-black">
                  <SelectValue placeholder="Select bike type" />
                </SelectTrigger>
                <SelectContent className="bg-white border-2 border-black">
                  {bikeTypes.map((type) => (
                    <SelectItem key={type} value={type} className="text-black hover:bg-gray-100">
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand" className="text-black font-medium">
                Brand
              </Label>
              <Input
                id="brand"
                value={details.brand}
                onChange={(e) => setDetails(prev => ({ ...prev, brand: e.target.value }))}
                placeholder="Trek, Specialized, etc."
                className="bg-white border-2 border-black text-black placeholder-gray-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="model" className="text-black font-medium">
                Model
              </Label>
              <Input
                id="model"
                value={details.model}
                onChange={(e) => setDetails(prev => ({ ...prev, model: e.target.value }))}
                placeholder="Domane, Tarmac, etc."
                className="bg-white border-2 border-black text-black placeholder-gray-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="year" className="text-black font-medium">
                Year
              </Label>
              <Input
                id="year"
                type="number"
                value={details.year || ''}
                onChange={(e) => setDetails(prev => ({ ...prev, year: e.target.value ? parseInt(e.target.value) : null }))}
                placeholder="2024"
                min="1900"
                max={new Date().getFullYear() + 1}
                className="bg-white border-2 border-black text-black placeholder-gray-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mostOftenRiddenRoute" className="text-black font-medium">
                Most Often Ridden Route
              </Label>
              <Input
                id="mostOftenRiddenRoute"
                value={details.mostOftenRiddenRoute}
                onChange={(e) => setDetails(prev => ({ ...prev, mostOftenRiddenRoute: e.target.value }))}
                placeholder="Central Park Loop, Coast Highway, etc."
                className="bg-white border-2 border-black text-black placeholder-gray-400"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-black font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              value={details.description}
              onChange={(e) => setDetails(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Tell us what makes your bike special..."
              rows={4}
              className="bg-white border-2 border-black text-black placeholder-gray-400"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1 bg-white border-2 border-black text-black hover:bg-black hover:text-white"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-black text-white hover:bg-white hover:text-black border-2 border-black"
              disabled={isSubmitting || !details.bikeName.trim() || !details.bikeType.trim()}
            >
              {isSubmitting ? 'Uploading...' : 'Submit & Upload'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default BikeDetailsForm;
