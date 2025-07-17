import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, Upload, RotateCcw, Move, ZoomIn, ZoomOut, Download, Camera, Sparkles } from 'lucide-react';
import { detectFace, detectHands, getJewelryType, FaceDetectionResult, HandDetectionResult } from '../utils/faceDetection';

interface VirtualTryOnProps {
  productImage: string;
  productName: string;
  onClose: () => void;
}

interface JewelryPosition {
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

const VirtualTryOn: React.FC<VirtualTryOnProps> = ({ productImage, productName, onClose }) => {
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [jewelryPosition, setJewelryPosition] = useState<JewelryPosition>({
    x: 50,
    y: 50,
    scale: 1,
    rotation: 0
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [faceData, setFaceData] = useState<FaceDetectionResult | null>(null);
  const [handData, setHandData] = useState<HandDetectionResult[]>([]);
  const [jewelryType, setJewelryType] = useState<'necklace' | 'earrings' | 'ring' | 'bracelet' | 'other'>('other');
  const [showControls, setShowControls] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const jewelryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setJewelryType(getJewelryType(productName));
  }, [productName]);

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    setIsProcessing(true);
    
    const reader = new FileReader();
    reader.onload = async (e) => {
      const imageUrl = e.target?.result as string;
      setUserPhoto(imageUrl);
      
      // Detect face and hands for automatic positioning
      const img = new Image();
      img.onload = async () => {
        try {
          const face = await detectFace(img);
          const hands = await detectHands(img);
          
          setFaceData(face);
          setHandData(hands);
          
          // Auto-position jewelry based on type and detection
          if (face) {
            autoPositionJewelry(face, hands, jewelryType);
          }
        } catch (error) {
          console.error('Detection failed:', error);
        } finally {
          setIsProcessing(false);
        }
      };
      img.src = imageUrl;
    };
    reader.readAsDataURL(file);
  };

  const autoPositionJewelry = (face: FaceDetectionResult, hands: HandDetectionResult[], type: string) => {
    let newPosition: JewelryPosition = { ...jewelryPosition };

    switch (type) {
      case 'necklace':
        if (face.landmarks?.neckCenter) {
          newPosition = {
            x: (face.landmarks.neckCenter.x / containerRef.current!.offsetWidth) * 100,
            y: (face.landmarks.neckCenter.y / containerRef.current!.offsetHeight) * 100,
            scale: Math.min(face.width / 200, 1.5),
            rotation: 0
          };
        }
        break;
      case 'earrings':
        if (face.landmarks?.leftEar) {
          newPosition = {
            x: (face.landmarks.leftEar.x / containerRef.current!.offsetWidth) * 100,
            y: (face.landmarks.leftEar.y / containerRef.current!.offsetHeight) * 100,
            scale: Math.min(face.width / 400, 1),
            rotation: 0
          };
        }
        break;
      case 'ring':
        if (hands.length > 0 && hands[0].fingers) {
          const ringFinger = hands[0].fingers[0]; // Ring finger
          newPosition = {
            x: (ringFinger.x / containerRef.current!.offsetWidth) * 100,
            y: (ringFinger.y / containerRef.current!.offsetHeight) * 100,
            scale: 0.3,
            rotation: 0
          };
        }
        break;
      case 'bracelet':
        if (hands.length > 0) {
          newPosition = {
            x: ((hands[0].x + hands[0].width * 0.5) / containerRef.current!.offsetWidth) * 100,
            y: ((hands[0].y + hands[0].height * 0.8) / containerRef.current!.offsetHeight) * 100,
            scale: 0.6,
            rotation: 0
          };
        }
        break;
    }

    setJewelryPosition(newPosition);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - (jewelryPosition.x * containerRef.current!.offsetWidth / 100),
      y: e.clientY - (jewelryPosition.y * containerRef.current!.offsetHeight / 100)
    });
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const newX = ((e.clientX - dragStart.x) / rect.width) * 100;
    const newY = ((e.clientY - dragStart.y) / rect.height) * 100;

    setJewelryPosition(prev => ({
      ...prev,
      x: Math.max(0, Math.min(100, newX)),
      y: Math.max(0, Math.min(100, newY))
    }));
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const adjustScale = (delta: number) => {
    setJewelryPosition(prev => ({
      ...prev,
      scale: Math.max(0.1, Math.min(3, prev.scale + delta))
    }));
  };

  const adjustRotation = (delta: number) => {
    setJewelryPosition(prev => ({
      ...prev,
      rotation: (prev.rotation + delta) % 360
    }));
  };

  const resetPosition = () => {
    if (faceData) {
      autoPositionJewelry(faceData, handData, jewelryType);
    } else {
      setJewelryPosition({ x: 50, y: 50, scale: 1, rotation: 0 });
    }
  };

  const downloadResult = () => {
    if (!canvasRef.current || !userPhoto) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const userImg = new Image();
    userImg.onload = () => {
      canvas.width = userImg.width;
      canvas.height = userImg.height;
      
      // Draw user photo
      ctx.drawImage(userImg, 0, 0);
      
      // Draw jewelry
      const jewelryImg = new Image();
      jewelryImg.onload = () => {
        const jewelryX = (jewelryPosition.x / 100) * canvas.width;
        const jewelryY = (jewelryPosition.y / 100) * canvas.height;
        const jewelryWidth = jewelryImg.width * jewelryPosition.scale;
        const jewelryHeight = jewelryImg.height * jewelryPosition.scale;
        
        ctx.save();
        ctx.translate(jewelryX, jewelryY);
        ctx.rotate((jewelryPosition.rotation * Math.PI) / 180);
        ctx.drawImage(
          jewelryImg,
          -jewelryWidth / 2,
          -jewelryHeight / 2,
          jewelryWidth,
          jewelryHeight
        );
        ctx.restore();
        
        // Download
        const link = document.createElement('a');
        link.download = `virtual-try-on-${productName.replace(/\s+/g, '-').toLowerCase()}.png`;
        link.href = canvas.toDataURL();
        link.click();
      };
      jewelryImg.crossOrigin = 'anonymous';
      jewelryImg.src = productImage;
    };
    userImg.crossOrigin = 'anonymous';
    userImg.src = userPhoto;
  };

  return (
    <div className="bg-white rounded-xl max-w-6xl max-h-[95vh] overflow-hidden shadow-2xl flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="flex items-center">
          <Sparkles className="h-6 w-6 mr-3" />
          <div>
            <h3 className="text-lg font-semibold">Virtual Try-On</h3>
            <p className="text-purple-100 text-sm">{productName}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Try-On Area */}
        <div className="flex-1 flex flex-col">
          {!userPhoto ? (
            /* Upload Area */
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center max-w-md">
                <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                  <Camera className="h-16 w-16 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Upload Your Photo
                </h3>
                <p className="text-gray-600 mb-6">
                  Take or upload a clear photo of yourself to see how this jewelry looks on you
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessing}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center mx-auto disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Choose Photo
                    </>
                  )}
                </button>
                <p className="text-xs text-gray-500 mt-4">
                  Supports JPG, PNG, WebP • Max 10MB
                </p>
              </div>
            </div>
          ) : (
            /* Try-On Interface */
            <div className="flex-1 relative overflow-hidden bg-gray-100">
              <div
                ref={containerRef}
                className="relative w-full h-full flex items-center justify-center"
              >
                {/* User Photo */}
                <img
                  src={userPhoto}
                  alt="User"
                  className="max-w-full max-h-full object-contain"
                  style={{ userSelect: 'none' }}
                />
                
                {/* Jewelry Overlay */}
                <div
                  ref={jewelryRef}
                  className="absolute cursor-move select-none"
                  style={{
                    left: `${jewelryPosition.x}%`,
                    top: `${jewelryPosition.y}%`,
                    transform: `translate(-50%, -50%) scale(${jewelryPosition.scale}) rotate(${jewelryPosition.rotation}deg)`,
                    transformOrigin: 'center',
                    zIndex: 10
                  }}
                  onMouseDown={handleMouseDown}
                >
                  <img
                    src={productImage}
                    alt={productName}
                    className="max-w-none pointer-events-none"
                    style={{
                      filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))',
                      maxWidth: '200px',
                      height: 'auto'
                    }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100x100?text=Jewelry';
                    }}
                  />
                </div>

                {/* Controls Toggle */}
                <button
                  onClick={() => setShowControls(!showControls)}
                  className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-lg hover:bg-black/70 transition-colors duration-200"
                >
                  <Move className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Controls Panel */}
        {userPhoto && showControls && (
          <div className="w-80 border-l border-gray-200 bg-gray-50 p-6 overflow-y-auto">
            <h4 className="font-semibold text-gray-900 mb-4">Adjust Jewelry</h4>
            
            {/* Position Controls */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Size
                </label>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => adjustScale(-0.1)}
                    className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    <ZoomOut className="h-4 w-4" />
                  </button>
                  <div className="flex-1 bg-white border border-gray-300 rounded-lg px-3 py-2 text-center text-sm">
                    {Math.round(jewelryPosition.scale * 100)}%
                  </div>
                  <button
                    onClick={() => adjustScale(0.1)}
                    className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    <ZoomIn className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rotation
                </label>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => adjustRotation(-15)}
                    className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>
                  <div className="flex-1 bg-white border border-gray-300 rounded-lg px-3 py-2 text-center text-sm">
                    {jewelryPosition.rotation}°
                  </div>
                  <button
                    onClick={() => adjustRotation(15)}
                    className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    <RotateCcw className="h-4 w-4 transform scale-x-[-1]" />
                  </button>
                </div>
              </div>

              {/* Position Sliders */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Horizontal Position
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={jewelryPosition.x}
                  onChange={(e) => setJewelryPosition(prev => ({ ...prev, x: Number(e.target.value) }))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vertical Position
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={jewelryPosition.y}
                  onChange={(e) => setJewelryPosition(prev => ({ ...prev, y: Number(e.target.value) }))}
                  className="w-full"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 mt-6">
              <button
                onClick={resetPosition}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset Position
              </button>
              
              <button
                onClick={downloadResult}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
              >
                <Download className="h-4 w-4 mr-2" />
                Save Image
              </button>

              <button
                onClick={() => {
                  setUserPhoto(null);
                  setJewelryPosition({ x: 50, y: 50, scale: 1, rotation: 0 });
                  setFaceData(null);
                  setHandData([]);
                }}
                className="w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center"
              >
                <Upload className="h-4 w-4 mr-2" />
                Try Different Photo
              </button>
            </div>

            {/* Tips */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h5 className="font-medium text-blue-900 mb-2">Tips for best results:</h5>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Use good lighting</li>
                <li>• Face the camera directly</li>
                <li>• Keep hands visible for rings/bracelets</li>
                <li>• Drag jewelry to reposition</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Hidden canvas for download */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default VirtualTryOn;