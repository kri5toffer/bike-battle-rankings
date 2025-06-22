
import React, { useState, useRef } from 'react';
import { Camera, X, RotateCcw, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface CameraCaptureProps {
  onImageCapture: (file: File) => void;
  onCancel: () => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onImageCapture, onCancel }) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Use back camera on mobile
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setIsCapturing(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please make sure you have given permission.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCapturing(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      
      if (context) {
        context.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        setCapturedImage(dataUrl);
        stopCamera();
      }
    }
  };

  const confirmPhoto = () => {
    if (capturedImage) {
      // Convert data URL to File
      fetch(capturedImage)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], `bike-photo-${Date.now()}.jpg`, { type: 'image/jpeg' });
          onImageCapture(file);
        });
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    startCamera();
  };

  React.useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <Card className="max-w-2xl mx-auto bg-gray-900/90 backdrop-blur-sm border-gray-700">
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-100">Take a Photo</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={onCancel}
              className="bg-gray-800 border-gray-600 text-gray-200 hover:bg-gray-700"
            >
              <X size={16} />
            </Button>
          </div>

          <div className="relative aspect-[4/3] bg-gray-800 rounded-lg overflow-hidden">
            {!isCapturing && !capturedImage && (
              <div className="flex flex-col items-center justify-center h-full space-y-4">
                <Camera size={48} className="text-gray-400" />
                <Button
                  onClick={startCamera}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Start Camera
                </Button>
              </div>
            )}

            {isCapturing && (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            )}

            {capturedImage && (
              <img
                src={capturedImage}
                alt="Captured"
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {isCapturing && (
            <div className="flex justify-center">
              <Button
                onClick={capturePhoto}
                size="lg"
                className="bg-white text-gray-900 hover:bg-gray-100 rounded-full w-16 h-16 p-0"
              >
                <div className="w-12 h-12 rounded-full border-2 border-gray-900" />
              </Button>
            </div>
          )}

          {capturedImage && (
            <div className="flex gap-4">
              <Button
                onClick={retakePhoto}
                variant="outline"
                className="flex-1 bg-gray-800 border-gray-600 text-gray-200 hover:bg-gray-700"
              >
                <RotateCcw size={16} className="mr-2" />
                Retake
              </Button>
              <Button
                onClick={confirmPhoto}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                <Check size={16} className="mr-2" />
                Use Photo
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CameraCapture;
