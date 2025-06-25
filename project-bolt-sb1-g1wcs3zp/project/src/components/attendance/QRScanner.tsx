import React, { useEffect, useRef, useState } from 'react';
import QrScanner from 'qr-scanner';
import { X, Camera, MapPin, Check } from 'lucide-react';

interface QRScannerProps {
  onScanSuccess: (sessionId: string) => void;
  onClose: () => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScanSuccess, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scanner, setScanner] = useState<QrScanner | null>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [location, setLocation] = useState<{latitude: number, longitude: number} | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (videoRef.current && !scanner) {
      const qrScanner = new QrScanner(
        videoRef.current,
        (result) => handleScanResult(result.data),
        {
          highlightScanRegion: true,
          highlightCodeOutline: true,
        }
      );

      setScanner(qrScanner);

      qrScanner.start().then(() => {
        setHasPermission(true);
        setIsScanning(true);
        getCurrentLocation();
      }).catch(err => {
        console.error('Error starting scanner:', err);
        setError('Failed to access camera. Please check permissions.');
      });
    }

    return () => {
      if (scanner) {
        scanner.stop();
        scanner.destroy();
      }
    };
  }, []);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.error('Geolocation error:', error);
          setError('Location access denied. Please enable location services.');
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  };

  const handleScanResult = (data: string) => {
    if (scanResult) return; // Prevent multiple scans
    
    setScanResult(data);
    setIsScanning(false);
    
    if (scanner) {
      scanner.stop();
    }

    // Simulate validation and attendance marking
    setTimeout(() => {
      if (location) {
        // In real app, validate location and session
        onScanSuccess(data);
      } else {
        setError('Location is required for attendance marking.');
      }
    }, 1000);
  };

  const handleClose = () => {
    if (scanner) {
      scanner.stop();
      scanner.destroy();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Camera className="h-5 w-5 mr-2 text-blue-600" />
            Scan QR Code
          </h3>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Scanner Area */}
        <div className="p-4">
          {error ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <X className="h-8 w-8 text-red-600" />
              </div>
              <p className="text-red-600 text-sm">{error}</p>
              <button
                onClick={handleClose}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          ) : scanResult ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <p className="text-green-600 font-medium">Attendance Marked!</p>
                <p className="text-sm text-gray-600">Session: {scanResult}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  playsInline
                />
                {!hasPermission && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75">
                    <div className="text-center text-white">
                      <Camera className="h-12 w-12 mx-auto mb-2" />
                      <p>Requesting camera access...</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="text-center space-y-2">
                <p className="text-sm text-gray-600">
                  Position the QR code within the frame
                </p>
                {isScanning && (
                  <div className="flex items-center justify-center space-x-2 text-blue-600">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span className="text-sm">Scanning...</span>
                  </div>
                )}
              </div>

              {/* Location Status */}
              <div className="flex items-center justify-center space-x-2 text-sm">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className={location ? 'text-green-600' : 'text-orange-600'}>
                  {location ? 'Location detected' : 'Getting location...'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRScanner;