import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, Camera, X, RotateCcw, Download, Loader, AlertCircle, CheckCircle } from 'lucide-react';
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
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
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
            scale: Math.min(face.width / 300, 1.5), // Scale based on face size
            rotation: 0
          };
        } else {
          // Fallback position
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
          // Position at left ear (we'll show both earrings)
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
          // Position on ring finger
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
        // Default positioning for other jewelry types
        position = {
          x: imageElement.width * 0.5,
          y: imageElement.height * 0.5,
          scale: 1,
          rotation: 0
        };
      }

      setJewelryPosition(position);
      setIsProcessing(false);
      
      // Render the composite image
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

    // Set canvas size to match user image
    canvas.width = userImg.naturalWidth;
    canvas.height = userImg.naturalHeight;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw user image
    ctx.drawImage(userImg, 0, 0);

    // Calculate jewelry dimensions
    const jewelryWidth = jewelryImg.naturalWidth * jewelryPosition.scale;
    const jewelryHeight = jewelryImg.naturalHeight * jewelryPosition.scale;

    // Save context for transformations
    ctx.save();

    // Apply transformations
    ctx.translate(jewelryPosition.x, jewelryPosition.y);
    ctx.rotate((jewelryPosition.rotation * Math.PI) / 180);

    // Apply blend mode for realistic appearance
    ctx.globalCompositeOperation = 'multiply';
    ctx.globalAlpha = 0.8;

    // Draw jewelry
    ctx.drawImage(
      jewelryImg,
      -jewelryWidth / 2,
      -jewelryHeight / 2,
      jewelryWidth,
      jewelryHeight
    );

    // Draw second earring if it's earrings
    if (jewelryType === 'earrings' && faceData?.landmarks) {
      ctx.translate(
        faceData.landmarks.rightEar.x - jewelryPosition.x,
        faceData.landmarks.rightEar.y - jewelryPosition.y
      );
      ctx.scale(-1, 1); // Mirror for right ear
      ctx.drawImage(
        jewelryImg,
        -jewelryWidth / 2,
        -jewelryHeight / 2,
        jewelryWidth,
        jewelryHeight
      );
    }

    // Restore context
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
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Re-render when jewelry position changes
  useEffect(() => {
    if (jewelryPosition) {
      renderComposite();
    }
  }, [jewelryPosition, renderComposite]);

  return (
    <div className="bg-white rounded-xl shadow-2xl max-w-4xl mx-auto overflow-hidden">
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
                  <p className="text-green-700 text-sm">Drag the jewelry to adjust position, or use the controls below.</p>
                </div>
              </div>
            )}

            {/* Canvas and Controls */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Canvas Area */}
              <div className="lg:col-span-2">
                <div className="relative bg-gray-100 rounded-lg overflow-hidden">
                  <canvas
                    ref={canvasRef}
                    className="w-full h-auto cursor-move"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
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
                    onLoad={renderComposite}
                  />
                </div>
              </div>

              {/* Controls */}
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-4">Adjust Position</h3>
                  
                  {/* Scale Controls */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => adjustScale(-0.1)}
                        className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm transition-colors duration-200"
                      >
                        Smaller
                      </button>
                      <button
                        onClick={() => adjustScale(0.1)}
                        className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm transition-colors duration-200"
                      >
                        Larger
                      </button>
                    </div>
                  </div>

                  {/* Rotation Controls */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rotation</label>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => adjustRotation(-15)}
                        className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm transition-colors duration-200"
                      >
                        ↺ Left
                      </button>
                      <button
                        onClick={() => adjustRotation(15)}
                        className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm transition-colors duration-200"
                      >
                        ↻ Right
                      </button>
                    </div>
                  </div>

                  {/* Reset Button */}
                  <button
                    onClick={resetPosition}
                    disabled={isProcessing}
                    className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset Position
                  </button>
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VirtualTryOn;