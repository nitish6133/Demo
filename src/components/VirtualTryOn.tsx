import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, Camera, X, RotateCcw, Download, Loader, AlertCircle, CheckCircle, Move, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';
import { detectFace, detectHands, getJewelryType, FaceDetectionResult, HandDetectionResult } from '../utils/faceDetection';

interface VirtualTryOnProps {
  productImage: string;
  productName: string;
  onClose?: () => void;
}

interface JewelryPosition {
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

const VirtualTryOn: React.FC<VirtualTryOnProps> = ({ productImage, productName, onClose }) => {
  const [userImage, setUserImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jewelryPosition, setJewelryPosition] = useState<JewelryPosition | null>(null);
  const [faceData, setFaceData] = useState<FaceDetectionResult | null>(null);
  const [handData, setHandData] = useState<HandDetectionResult[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const userImageRef = useRef<HTMLImageElement>(null);
  const jewelryImageRef = useRef<HTMLImageElement>(null);

  const jewelryType = getJewelryType(productName);

  const handleImageUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setError('Image size should be less than 10MB');
      return;
    }

    setError(null);
    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const imageUrl = e.target?.result as string;
      setUserImage(imageUrl);
      
      // Wait for image to load before processing
      const img = new Image();
      img.onload = async () => {
        try {
          await processImage(img);
        } catch (err) {
          setError('Failed to process image. Please try another photo.');
          setIsProcessing(false);
        }
      };
      img.src = imageUrl;
    };
    reader.readAsDataURL(file);
  }, []);

  const processImage = async (imageElement: HTMLImageElement) => {
    try {
      let position: JewelryPosition;

      if (jewelryType === 'necklace') {
        const face = await detectFace(imageElement);
        setFaceData(face);
        
        if (face && face.landmarks) {
          position = {
            x: face.landmarks.neckCenter.x,
            y: face.landmarks.neckCenter.y,
            scale: Math.min(face.width / 300, 1.5),
            rotation: 0
          };
        } else {
          position = {
            x: imageElement.width * 0.5,
            y: imageElement.height * 0.65,
            scale: 1,
            rotation: 0
          };
        }
      } else if (jewelryType === 'earrings') {
        const face = await detectFace(imageElement);
        setFaceData(face);
        
        if (face && face.landmarks) {
          position = {
            x: face.landmarks.leftEar.x,
            y: face.landmarks.leftEar.y,
            scale: Math.min(face.width / 400, 1.2),
            rotation: 0
          };
        } else {
          position = {
            x: imageElement.width * 0.35,
            y: imageElement.height * 0.25,
            scale: 0.8,
            rotation: 0
          };
        }
      } else if (jewelryType === 'ring') {
        const hands = await detectHands(imageElement);
        setHandData(hands);
        
        if (hands.length > 0 && hands[0].fingers) {
          const ringFinger = hands[0].fingers[0];
          position = {
            x: ringFinger.x,
            y: ringFinger.y,
            scale: 0.3,
            rotation: 0
          };
        } else {
          position = {
            x: imageElement.width * 0.25,
            y: imageElement.height * 0.65,
            scale: 0.4,
            rotation: 0
          };
        }
      } else {
        position = {
          x: imageElement.width * 0.5,
          y: imageElement.height * 0.5,
          scale: 1,
          rotation: 0
        };
      }

      setJewelryPosition(position);
      setIsProcessing(false);
      setShowManualControls(true);
      
      setTimeout(() => renderComposite(), 100);
    } catch (err) {
      setError('Failed to detect features in the image');
      setIsProcessing(false);
    }
  };

  const renderComposite = useCallback(() => {
    if (!canvasRef.current || !userImageRef.current || !jewelryImageRef.current || !jewelryPosition) {
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const userImg = userImageRef.current;
    const jewelryImg = jewelryImageRef.current;

    canvas.width = userImg.naturalWidth;
    canvas.height = userImg.naturalHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(userImg, 0, 0);

    const jewelryWidth = jewelryImg.naturalWidth * jewelryPosition.scale;
    const jewelryHeight = jewelryImg.naturalHeight * jewelryPosition.scale;

    ctx.save();
    ctx.translate(jewelryPosition.x, jewelryPosition.y);
    ctx.rotate((jewelryPosition.rotation * Math.PI) / 180);
    ctx.globalCompositeOperation = 'multiply';
    ctx.globalAlpha = 0.8;

    ctx.drawImage(
      jewelryImg,
      -jewelryWidth / 2,
      -jewelryHeight / 2,
      jewelryWidth,
      jewelryHeight
    );

    if (jewelryType === 'earrings' && faceData?.landmarks) {
      ctx.translate(
        faceData.landmarks.rightEar.x - jewelryPosition.x,
        faceData.landmarks.rightEar.y - jewelryPosition.y
      );
      ctx.scale(-1, 1);
      ctx.drawImage(
        jewelryImg,
        -jewelryWidth / 2,
        -jewelryHeight / 2,
        jewelryWidth,
        jewelryHeight
      );
    }

    ctx.restore();
  }, [jewelryPosition, faceData, jewelryType]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!jewelryPosition) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;

    setIsDragging(true);
    setDragOffset({
      x: mouseX - jewelryPosition.x,
      y: mouseY - jewelryPosition.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !jewelryPosition) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;

    setJewelryPosition({
      ...jewelryPosition,
      x: mouseX - dragOffset.x,
      y: mouseY - dragOffset.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch event handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!jewelryPosition) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const touch = e.touches[0];
    const touchX = (touch.clientX - rect.left) * scaleX;
    const touchY = (touch.clientY - rect.top) * scaleY;

    setIsDragging(true);
    setDragOffset({
      x: touchX - jewelryPosition.x,
      y: touchY - jewelryPosition.y
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    if (!isDragging || !jewelryPosition) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const touch = e.touches[0];
    const touchX = (touch.clientX - rect.left) * scaleX;
    const touchY = (touch.clientY - rect.top) * scaleY;

    setJewelryPosition({
      ...jewelryPosition,
      x: touchX - dragOffset.x,
      y: touchY - dragOffset.y
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Manual adjustment functions
  const moveJewelry = (direction: 'up' | 'down' | 'left' | 'right', amount: number = 10) => {
    if (!jewelryPosition) return;
    
    const newPosition = { ...jewelryPosition };
    switch (direction) {
      case 'up':
        newPosition.y -= amount;
        break;
      case 'down':
        newPosition.y += amount;
        break;
      case 'left':
        newPosition.x -= amount;
        break;
      case 'right':
        newPosition.x += amount;
        break;
    }
    setJewelryPosition(newPosition);
  };

  const adjustScale = (delta: number) => {
    if (!jewelryPosition) return;
    
    const newScale = Math.max(0.1, Math.min(3, jewelryPosition.scale + delta));
    setJewelryPosition({ ...jewelryPosition, scale: newScale });
  };

  const adjustRotation = (delta: number) => {
    if (!jewelryPosition) return;
    
    setJewelryPosition({ 
      ...jewelryPosition, 
      rotation: (jewelryPosition.rotation + delta) % 360 
    });
  };

  const resetPosition = async () => {
    if (!userImageRef.current) return;
    
    setIsProcessing(true);
    await processImage(userImageRef.current);
  };

  const downloadImage = () => {
    if (!canvasRef.current) return;
    
    const link = document.createElement('a');
    link.download = `virtual-try-on-${productName.replace(/\s+/g, '-').toLowerCase()}.png`;
    link.href = canvasRef.current.toDataURL();
    link.click();
  };

  const resetTryOn = () => {
    setUserImage(null);
    setJewelryPosition(null);
    setFaceData(null);
    setHandData([]);
    setError(null);
    setIsProcessing(false);
    setShowManualControls(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  useEffect(() => {
    if (jewelryPosition) {
      renderComposite();
    }
  }, [jewelryPosition, renderComposite]);

  const renderCompositeWithBackground = () => {
    renderComposite();
  };

  return (
    <div className="bg-white rounded-xl shadow-2xl max-w-6xl mx-auto overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Camera className="h-6 w-6 mr-3" />
            <div>
              <h2 className="text-xl font-bold">Virtual Try-On</h2>
              <p className="text-purple-100 text-sm">{productName}</p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      <div className="p-6">
        {!userImage ? (
          /* Upload Section */
          <div className="text-center">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 hover:border-purple-400 hover:bg-purple-50 transition-all duration-200">
              <Upload className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Upload Your Photo
              </h3>
              <p className="text-gray-600 mb-6">
                Take or upload a clear photo of yourself to try on the {jewelryType}
              </p>
              
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 inline-flex items-center"
              >
                <Upload className="h-5 w-5 mr-2" />
                Choose Photo
              </button>
            </div>

            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Tips for Best Results:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Use good lighting and face the camera directly</li>
                <li>• For necklaces: Show your neck and upper chest area</li>
                <li>• For earrings: Keep your ears visible and hair pulled back</li>
                <li>• For rings: Show your hands clearly in the photo</li>
                <li>• Avoid busy backgrounds for better detection</li>
              </ul>
            </div>
          </div>
        ) : (
          /* Try-On Interface */
          <div className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
                <AlertCircle className="h-5 w-5 text-red-600 mr-3 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-red-900">Error</h4>
                  <p className="text-red-700 text-sm mt-1">{error}</p>
                </div>
              </div>
            )}

            {/* Processing Indicator */}
            {isProcessing && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center">
                <Loader className="h-5 w-5 text-blue-600 mr-3 animate-spin" />
                <div>
                  <h4 className="font-semibold text-blue-900">Processing Image</h4>
                  <p className="text-blue-700 text-sm">Detecting features and positioning jewelry...</p>
                </div>
              </div>
            )}

            {/* Success Message */}
            {jewelryPosition && !isProcessing && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-green-900">Try-On Ready!</h4>
                  <p className="text-green-700 text-sm">Use the controls below to perfectly position your jewelry. Drag on the image or use the manual controls.</p>
                </div>
              </div>
            )}

            {/* Canvas and Controls */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              {/* Canvas Area */}
              <div className="xl:col-span-3">
                <div className="relative bg-gray-100 rounded-lg overflow-hidden">
                  <canvas
                    ref={canvasRef}
                    className="w-full h-auto cursor-move touch-none"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                  />
                  
                  {/* Hidden images for canvas rendering */}
                  <img
                    ref={userImageRef}
                    src={userImage}
                    alt="User"
                    className="hidden"
                    onLoad={() => userImageRef.current && processImage(userImageRef.current)}
                  />
                  <img
                    ref={jewelryImageRef}
                    src={productImage}
                    alt={productName}
                    className="hidden"
                    onLoad={renderCompositeWithBackground}
                  />

                  {/* Drag Instruction Overlay */}
                  {jewelryPosition && (
                    <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-2 rounded-lg text-sm">
                      <Move className="h-4 w-4 inline mr-1" />
                      Drag to move jewelry
                    </div>
                  )}
                </div>
              </div>

              {/* Enhanced Controls */}
              {showManualControls && (
                <div className="space-y-6">
                  {/* Position Controls */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <Move className="h-4 w-4 mr-2" />
                      Position
                    </h3>
                    
                    {/* Directional Controls */}
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <div></div>
                      <button
                        onClick={() => moveJewelry('up', 20)}
                        className="p-3 bg-white hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors duration-200 flex items-center justify-center"
                        title="Move Up"
                      >
                        ↑
                      </button>
                      <div></div>
                      
                      <button
                        onClick={() => moveJewelry('left', 20)}
                        className="p-3 bg-white hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors duration-200 flex items-center justify-center"
                        title="Move Left"
                      >
                        ←
                      </button>
                      <button
                        onClick={resetPosition}
                        disabled={isProcessing}
                        className="p-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white rounded-lg transition-colors duration-200 flex items-center justify-center text-xs"
                        title="Reset Position"
                      >
                        <RotateCcw className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => moveJewelry('right', 20)}
                        className="p-3 bg-white hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors duration-200 flex items-center justify-center"
                        title="Move Right"
                      >
                        →
                      </button>
                      
                      <div></div>
                      <button
                        onClick={() => moveJewelry('down', 20)}
                        className="p-3 bg-white hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors duration-200 flex items-center justify-center"
                        title="Move Down"
                      >
                        ↓
                      </button>
                      <div></div>
                    </div>

                    {/* Fine Position Controls */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => moveJewelry('up', 5)}
                        className="px-3 py-2 bg-white hover:bg-gray-100 rounded text-xs border border-gray-200 transition-colors duration-200"
                      >
                        Fine ↑
                      </button>
                      <button
                        onClick={() => moveJewelry('down', 5)}
                        className="px-3 py-2 bg-white hover:bg-gray-100 rounded text-xs border border-gray-200 transition-colors duration-200"
                      >
                        Fine ↓
                      </button>
                      <button
                        onClick={() => moveJewelry('left', 5)}
                        className="px-3 py-2 bg-white hover:bg-gray-100 rounded text-xs border border-gray-200 transition-colors duration-200"
                      >
                        Fine ←
                      </button>
                      <button
                        onClick={() => moveJewelry('right', 5)}
                        className="px-3 py-2 bg-white hover:bg-gray-100 rounded text-xs border border-gray-200 transition-colors duration-200"
                      >
                        Fine →
                      </button>
                    </div>
                  </div>

                  {/* Size Controls */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <ZoomIn className="h-4 w-4 mr-2" />
                      Size
                    </h3>
                    
                    <div className="space-y-2">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => adjustScale(-0.2)}
                          className="flex-1 px-3 py-2 bg-white hover:bg-gray-100 rounded text-sm border border-gray-200 transition-colors duration-200 flex items-center justify-center"
                        >
                          <ZoomOut className="h-4 w-4 mr-1" />
                          Much Smaller
                        </button>
                        <button
                          onClick={() => adjustScale(0.2)}
                          className="flex-1 px-3 py-2 bg-white hover:bg-gray-100 rounded text-sm border border-gray-200 transition-colors duration-200 flex items-center justify-center"
                        >
                          <ZoomIn className="h-4 w-4 mr-1" />
                          Much Larger
                        </button>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={() => adjustScale(-0.05)}
                          className="flex-1 px-3 py-2 bg-white hover:bg-gray-100 rounded text-xs border border-gray-200 transition-colors duration-200"
                        >
                          Fine -
                        </button>
                        <button
                          onClick={() => adjustScale(0.05)}
                          className="flex-1 px-3 py-2 bg-white hover:bg-gray-100 rounded text-xs border border-gray-200 transition-colors duration-200"
                        >
                          Fine +
                        </button>
                      </div>

                      {jewelryPosition && (
                        <div className="text-center text-xs text-gray-600 mt-2">
                          Scale: {(jewelryPosition.scale * 100).toFixed(0)}%
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Rotation Controls */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <RotateCw className="h-4 w-4 mr-2" />
                      Rotation
                    </h3>
                    
                    <div className="space-y-2">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => adjustRotation(-45)}
                          className="flex-1 px-3 py-2 bg-white hover:bg-gray-100 rounded text-sm border border-gray-200 transition-colors duration-200"
                        >
                          ↺ -45°
                        </button>
                        <button
                          onClick={() => adjustRotation(45)}
                          className="flex-1 px-3 py-2 bg-white hover:bg-gray-100 rounded text-sm border border-gray-200 transition-colors duration-200"
                        >
                          ↻ +45°
                        </button>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={() => adjustRotation(-5)}
                          className="flex-1 px-3 py-2 bg-white hover:bg-gray-100 rounded text-xs border border-gray-200 transition-colors duration-200"
                        >
                          Fine ↺
                        </button>
                        <button
                          onClick={() => adjustRotation(5)}
                          className="flex-1 px-3 py-2 bg-white hover:bg-gray-100 rounded text-xs border border-gray-200 transition-colors duration-200"
                        >
                          Fine ↻
                        </button>
                      </div>

                      {jewelryPosition && (
                        <div className="text-center text-xs text-gray-600 mt-2">
                          Angle: {jewelryPosition.rotation.toFixed(0)}°
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button
                      onClick={downloadImage}
                      disabled={!jewelryPosition}
                      className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Image
                    </button>
                    
                    <button
                      onClick={resetTryOn}
                      className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Try Different Photo
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VirtualTryOn;