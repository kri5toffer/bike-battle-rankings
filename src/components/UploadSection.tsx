import React, { useState, useRef } from 'react';
import { Upload, Camera, CheckCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import BikeDetailsForm, { BikeDetails } from './BikeDetailsForm';
import CameraCapture from './CameraCapture';
import { supabase } from '@/integrations/supabase/client';

interface UploadSectionProps {
  onBikeUploaded: (imageUrl: string, details: BikeDetails) => void;
}

const UploadSection: React.FC<UploadSectionProps> = ({ onBikeUploaded }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showDetailsForm, setShowDetailsForm] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
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
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    setSelectedFile(file);
    setShowDetailsForm(true);
  };

  const handleDetailsSubmit = async (details: BikeDetails) => {
    if (!selectedFile) return;

    setIsUploading(true);
    
    try {
      // Upload image to Supabase Storage
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
      const filePath = fileName;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('bike-images')
        .upload(filePath, selectedFile);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        alert('Failed to upload image. Please try again.');
        return;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('bike-images')
        .getPublicUrl(filePath);

      const imageUrl = urlData.publicUrl;

      // Call the parent component's handler
      onBikeUploaded(imageUrl, details);

      setUploadSuccess(true);
      setShowDetailsForm(false);
      setSelectedFile(null);
      
      setTimeout(() => {
        setUploadSuccess(false);
      }, 3000);

    } catch (error) {
      console.error('Error uploading bike:', error);
      alert('Failed to upload bike. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCameraCapture = (file: File) => {
    setSelectedFile(file);
    setShowCamera(false);
    setShowDetailsForm(true);
  };

  const handleCancel = () => {
    setShowDetailsForm(false);
    setShowCamera(false);
    setSelectedFile(null);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  if (showCamera) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-black mb-4">
            Take Your Bike Photo
          </h2>
          <p className="text-lg text-black max-w-2xl mx-auto">
            Use your camera to capture your bike in all its glory!
          </p>
        </div>
        <CameraCapture
          onImageCapture={handleCameraCapture}
          onCancel={handleCancel}
        />
      </div>
    );
  }

  if (showDetailsForm) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-black mb-4">
            Almost There!
          </h2>
          <p className="text-lg text-black max-w-2xl mx-auto">
            Tell us about your bike before we add it to the competition.
          </p>
        </div>
        <BikeDetailsForm
          onSubmit={handleDetailsSubmit}
          onCancel={handleCancel}
          isSubmitting={isUploading}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="text-black" size={24} />
          <h2 className="text-3xl font-bold text-black">
            Upload Your Ride
          </h2>
        </div>
        <p className="text-lg text-black max-w-2xl mx-auto">
          Upload photo of your bike to see how it stacks up with other riders' bikes!
        </p>
      </div>

      <Card className="max-w-3xl mx-auto border-2 border-black bg-white">
        <CardContent className="p-6 sm:p-10">
          <div
            className={`border-2 border-dashed p-8 sm:p-16 text-center transition-all duration-300 cursor-pointer ${
              isDragging
                ? 'border-black bg-gray-100'
                : uploadSuccess
                ? 'border-black bg-gray-100'
                : 'border-black bg-white hover:bg-gray-100'
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
              onChange={handleFileInputChange}
              className="hidden"
            />
            
            {uploadSuccess ? (
              <div className="space-y-6">
                <div className="relative">
                  <CheckCircle className="mx-auto text-black w-12 h-12 sm:w-16 sm:h-16" />
                  <div className="absolute -top-2 -right-2">
                    <Sparkles className="text-black animate-pulse w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                </div>
                <div>
                  <p className="text-black font-bold text-lg sm:text-xl mb-2">Upload Successful!</p>
                  <p className="text-black text-sm sm:text-base">Your bike is now competing in the arena!</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-center">
                  {isDragging ? (
                    <Upload className="text-black animate-bounce w-12 h-12 sm:w-16 sm:h-16" />
                  ) : (
                    <Camera className="text-black w-12 h-12 sm:w-16 sm:h-16" />
                  )}
                </div>
                
                <div>
                  <p className="text-lg sm:text-xl font-bold text-black mb-3">
                    {isDragging ? 'Drop your bike photo here!' : 'Upload Your Bike Photo'}
                  </p>
                  <p className="text-black mb-6 text-sm sm:text-base px-4">
                    Take a photo with your camera or choose from your gallery
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowCamera(true);
                    }}
                    className="bg-black text-white hover:bg-white hover:text-black border-2 border-black px-6 py-3 text-base font-semibold transition-all duration-300"
                  >
                    <Camera size={18} className="mr-2" />
                    Take Photo
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="bg-white text-black border-2 border-black hover:bg-black hover:text-white px-6 py-3 text-base font-semibold transition-all duration-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      openFileDialog();
                    }}
                  >
                    <Upload size={18} className="mr-2" />
                    Choose File
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-white border-2 border-black">
            <h3 className="font-semibold text-black mb-3 flex items-center gap-2 text-sm sm:text-base">
              <Sparkles size={16} className="text-black" />
              Upload Guidelines
            </h3>
            <div className="text-xs sm:text-sm text-black space-y-2">
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
