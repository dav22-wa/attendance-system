import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { X, Download, RefreshCw, Clock, MapPin } from 'lucide-react';
import { Session } from '../../types';
import { format } from 'date-fns';

interface QRGeneratorProps {
  session: Session;
  onClose: () => void;
}

const QRGenerator: React.FC<QRGeneratorProps> = ({ session, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    generateQRCode();
    
    // Set up timer for QR code expiry
    if (session.qrExpiry) {
      const expiryTime = new Date(session.qrExpiry).getTime();
      const updateTimer = () => {
        const now = Date.now();
        const remaining = Math.max(0, expiryTime - now);
        setTimeRemaining(remaining);
        
        if (remaining <= 0) {
          setIsExpired(true);
        }
      };
      
      updateTimer();
      const interval = setInterval(updateTimer, 1000);
      
      return () => clearInterval(interval);
    }
  }, [session]);

  const generateQRCode = async () => {
    if (!canvasRef.current) return;

    const qrData = JSON.stringify({
      sessionId: session.id,
      courseId: session.courseId,
      courseName: session.courseName,
      date: session.date,
      startTime: session.startTime,
      location: session.location,
      latitude: session.latitude,
      longitude: session.longitude,
      timestamp: Date.now()
    });

    try {
      await QRCode.toCanvas(canvasRef.current, qrData, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });

      // Also generate data URL for download
      const dataUrl = await QRCode.toDataURL(qrData, {
        width: 512,
        margin: 2
      });
      setQrDataUrl(dataUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const downloadQRCode = () => {
    if (!qrDataUrl) return;

    const link = document.createElement('a');
    link.download = `qr-${session.courseName}-${session.date}.png`;
    link.href = qrDataUrl;
    link.click();
  };

  const refreshQRCode = () => {
    // In real app, this would generate a new QR code with updated expiry
    generateQRCode();
    setIsExpired(false);
    setTimeRemaining(10 * 60 * 1000); // Reset to 10 minutes
  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Session QR Code</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Session Info */}
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900">{session.courseName}</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                {format(new Date(session.date), 'PPP')} • {session.startTime} - {session.endTime}
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                {session.location}
              </div>
            </div>
          </div>

          {/* QR Code */}
          <div className="flex justify-center">
            <div className="relative">
              <canvas
                ref={canvasRef}
                className={`border-2 border-gray-200 rounded-lg ${
                  isExpired ? 'opacity-50 grayscale' : ''
                }`}
              />
              {isExpired && (
                <div className="absolute inset-0 flex items-center justify-center bg-red-500 bg-opacity-90 rounded-lg">
                  <span className="text-white font-medium">EXPIRED</span>
                </div>
              )}
            </div>
          </div>

          {/* Timer */}
          <div className="text-center">
            {timeRemaining > 0 ? (
              <div className="flex items-center justify-center space-x-2">
                <Clock className="h-4 w-4 text-orange-500" />
                <span className={`font-mono text-lg ${
                  timeRemaining < 60000 ? 'text-red-600' : 'text-orange-600'
                }`}>
                  {formatTime(timeRemaining)}
                </span>
                <span className="text-sm text-gray-500">remaining</span>
              </div>
            ) : (
              <div className="text-red-600 font-medium">QR Code Expired</div>
            )}
          </div>

          {/* Actions */}
          <div className="flex space-x-3">
            <button
              onClick={downloadQRCode}
              disabled={isExpired}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Download</span>
            </button>
            <button
              onClick={refreshQRCode}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </button>
          </div>

          <div className="text-xs text-gray-500 text-center">
            Students must scan this QR code from the specified location to mark attendance.
            QR codes expire automatically for security.
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRGenerator;