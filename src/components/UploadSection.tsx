
import React, { useState, useRef } from 'react';
import { Upload, Camera, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface UploadSectionProps {
  onBikeUploaded: (imageUrl: string) => void;
}

const UploadSection: React.FC<UploadSectionProps> = ({ onBikeUploaded }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      setTimeout(() => {
        onBikeUploaded(imageUrl);
        setIsUploading(false);
        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 3000);
      }, 1000); // Simulate upload delay
    };
    
    reader.readAsDataURL(file);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Your Bike</h2>
        <p className="text-gray-600">Share your bike and see how it ranks against others!</p>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8">
          <div
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-all duration-200 cursor-pointer ${
              isDragging
                ? 'border-blue-500 bg-blue-50'
                : uploadSuccess
                ? 'border-green-500 bg-green-50'
                : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={openFileDialog}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            {isUploading ? (
              <div className="space-y-4">
                <div className="animate-spin mx-auto w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                <p className="text-blue-600 font-medium">Uploading your bike...</p>
              </div>
            ) : uploadSuccess ? (
              <div className="space-y-4">
                <CheckCircle className="mx-auto text-green-500" size={48} />
                <p className="text-green-600 font-medium">Bike uploaded successfully!</p>
                <p className="text-sm text-gray-600">Your bike is now in the competition!</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-center">
                  {isDragging ? (
                    <Upload className="text-blue-500" size={48} />
                  ) : (
                    <Camera className="text-gray-400" size={48} />
                  )}
                </div>
                
                <div>
                  <p className="text-lg font-medium text-gray-700 mb-2">
                    {isDragging ? 'Drop your bike photo here!' : 'Upload your bike photo'}
                  </p>
                  <p className="text-sm text-gray-500">
                    Drag and drop an image, or click to browse
                  </p>
                </div>

                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={(e) => {
                    e.stopPropagation();
                    openFileDialog();
                  }}
                >
                  Choose File
                </Button>
              </div>
            )}
          </div>

          <div className="mt-6 text-sm text-gray-500 space-y-1">
            <p>• Supported formats: JPG, PNG, GIF</p>
            <p>• Maximum file size: 10MB</p>
            <p>• No account required - upload anonymously!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadSection;
