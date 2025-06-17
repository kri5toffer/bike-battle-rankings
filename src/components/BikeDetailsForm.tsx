
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
}

const BikeDetailsForm: React.FC<BikeDetailsFormProps> = ({ onSubmit, onCancel, isSubmitting }) => {
  const [details, setDetails] = useState<BikeDetails>({
    bikeName: '',
    bikeType: '',
    brand: '',
    model: '',
    year: null,
    description: ''
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
    <Card className="max-w-2xl mx-auto bg-gray-900/90 backdrop-blur-sm border-gray-700">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-100 text-center">
          Tell Us About Your Bike
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="bikeName" className="text-gray-200 font-medium">
                Bike Name *
              </Label>
              <Input
                id="bikeName"
                value={details.bikeName}
                onChange={(e) => setDetails(prev => ({ ...prev, bikeName: e.target.value }))}
                placeholder="My awesome bike"
                className="bg-gray-800 border-gray-600 text-gray-100 placeholder-gray-400"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bikeType" className="text-gray-200 font-medium">
                Bike Type *
              </Label>
              <Select value={details.bikeType} onValueChange={(value) => setDetails(prev => ({ ...prev, bikeType: value }))}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-gray-100">
                  <SelectValue placeholder="Select bike type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  {bikeTypes.map((type) => (
                    <SelectItem key={type} value={type} className="text-gray-100 hover:bg-gray-700">
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand" className="text-gray-200 font-medium">
                Brand
              </Label>
              <Input
                id="brand"
                value={details.brand}
                onChange={(e) => setDetails(prev => ({ ...prev, brand: e.target.value }))}
                placeholder="Trek, Specialized, etc."
                className="bg-gray-800 border-gray-600 text-gray-100 placeholder-gray-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="model" className="text-gray-200 font-medium">
                Model
              </Label>
              <Input
                id="model"
                value={details.model}
                onChange={(e) => setDetails(prev => ({ ...prev, model: e.target.value }))}
                placeholder="Domane, Tarmac, etc."
                className="bg-gray-800 border-gray-600 text-gray-100 placeholder-gray-400"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="year" className="text-gray-200 font-medium">
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
                className="bg-gray-800 border-gray-600 text-gray-100 placeholder-gray-400"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-200 font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              value={details.description}
              onChange={(e) => setDetails(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Tell us what makes your bike special..."
              rows={4}
              className="bg-gray-800 border-gray-600 text-gray-100 placeholder-gray-400"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1 bg-gray-800 border-gray-600 text-gray-200 hover:bg-gray-700"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
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
