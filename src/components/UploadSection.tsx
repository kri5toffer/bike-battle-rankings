
import React, { useState, useRef } from 'react';
import { Upload, Camera, CheckCircle, Sparkles } from 'lucide-react';
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
    <div className="space-y-8">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="text-purple-500" size={24} />
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Showcase Your Ride
          </h2>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Upload your bike photo and join the ultimate cycling competition. 
          See how your ride stacks up against the community!
        </p>
      </div>

      <Card className="max-w-3xl mx-auto shadow-2xl border-0 bg-white/70 backdrop-blur-sm">
        <CardContent className="p-10">
          <div
            className={`border-2 border-dashed rounded-2xl p-16 text-center transition-all duration-300 cursor-pointer ${
              isDragging
                ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 scale-105'
                : uploadSuccess
                ? 'border-emerald-500 bg-gradient-to-br from-emerald-50 to-green-50'
                : 'border-gray-300 bg-gradient-to-br from-gray-50 to-white hover:border-blue-400 hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 hover:scale-105'
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
              <div className="space-y-6">
                <div className="relative">
                  <div className="animate-spin mx-auto w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 bg-blue-500 rounded-full animate-pulse"></div>
                  </div>
                </div>
                <p className="text-blue-600 font-semibold text-lg">Uploading your masterpiece...</p>
              </div>
            ) : uploadSuccess ? (
              <div className="space-y-6">
                <div className="relative">
                  <CheckCircle className="mx-auto text-emerald-500" size={64} />
                  <div className="absolute -top-2 -right-2">
                    <Sparkles className="text-yellow-400 animate-pulse" size={24} />
                  </div>
                </div>
                <div>
                  <p className="text-emerald-600 font-bold text-xl mb-2">Upload Successful!</p>
                  <p className="text-gray-600">Your bike is now competing in the arena!</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-center">
                  {isDragging ? (
                    <Upload className="text-blue-500 animate-bounce" size={64} />
                  ) : (
                    <Camera className="text-gray-400" size={64} />
                  )}
                </div>
                
                <div>
                  <p className="text-xl font-bold text-gray-800 mb-3">
                    {isDragging ? 'Drop your bike photo here!' : 'Upload Your Bike Photo'}
                  </p>
                  <p className="text-gray-600 mb-6">
                    Drag and drop an image, or click to browse your files
                  </p>
                </div>

                <Button 
                  variant="outline" 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 hover:from-blue-700 hover:to-purple-700 px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
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

          <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Sparkles size={16} className="text-purple-500" />
              Upload Guidelines
            </h3>
            <div className="text-sm text-gray-600 space-y-2">
              <p>• Supported formats: JPG, PNG, GIF</p>
              <p>• Maximum file size: 10MB</p>
              <p>• No account required - upload anonymously!</p>
              <p>• Best photos: clear, well-lit, full bike view</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadSection;
