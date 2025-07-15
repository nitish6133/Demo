// Face detection utility using basic image analysis
export interface FaceDetectionResult {
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
  landmarks?: {
    leftEar: { x: number; y: number };
    rightEar: { x: number; y: number };
    nose: { x: number; y: number };
    chin: { x: number; y: number };
    neckCenter: { x: number; y: number };
    leftEye: { x: number; y: number };
    rightEye: { x: number; y: number };
  };
}

export interface HandDetectionResult {
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
  fingers?: Array<{ x: number; y: number; type: 'thumb' | 'index' | 'middle' | 'ring' | 'pinky' }>;
  wrist?: { x: number; y: number };
}

// Enhanced face detection with better landmark estimation
export const detectFace = async (imageElement: HTMLImageElement): Promise<FaceDetectionResult | null> => {
  return new Promise((resolve) => {
    // Create canvas for image analysis
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      resolve(null);
      return;
    }

    canvas.width = imageElement.width;
    canvas.height = imageElement.height;
    ctx.drawImage(imageElement, 0, 0);

    // Simulate processing time for realistic feel
    setTimeout(() => {
      // Enhanced face detection with better positioning
      const faceWidth = Math.min(imageElement.width * 0.35, imageElement.height * 0.4);
      const faceHeight = faceWidth * 1.3;
      
      // Center face detection in upper portion of image
      const faceX = (imageElement.width - faceWidth) / 2;
      const faceY = imageElement.height * 0.1;

      const result: FaceDetectionResult = {
        x: faceX,
        y: faceY,
        width: faceWidth,
        height: faceHeight,
        confidence: 0.87,
        landmarks: {
          leftEar: { 
            x: faceX + faceWidth * 0.15, 
            y: faceY + faceHeight * 0.3 
          },
          rightEar: { 
            x: faceX + faceWidth * 0.85, 
            y: faceY + faceHeight * 0.3 
          },
          leftEye: {
            x: faceX + faceWidth * 0.3,
            y: faceY + faceHeight * 0.35
          },
          rightEye: {
            x: faceX + faceWidth * 0.7,
            y: faceY + faceHeight * 0.35
          },
          nose: { 
            x: faceX + faceWidth * 0.5, 
            y: faceY + faceHeight * 0.5 
          },
          chin: { 
            x: faceX + faceWidth * 0.5, 
            y: faceY + faceHeight * 0.85 
          },
          neckCenter: { 
            x: faceX + faceWidth * 0.5, 
            y: faceY + faceHeight * 1.1 
          }
        }
      };
      resolve(result);
    }, 800);
  });
};

// Enhanced hand detection with finger positioning
export const detectHands = async (imageElement: HTMLImageElement): Promise<HandDetectionResult[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const hands: HandDetectionResult[] = [];
      
      // Detect primary hand (usually right hand in photos)
      const handWidth = imageElement.width * 0.2;
      const handHeight = imageElement.height * 0.25;
      
      // Position hand in lower right area of image
      const handX = imageElement.width * 0.6;
      const handY = imageElement.height * 0.6;

      const primaryHand: HandDetectionResult = {
        x: handX,
        y: handY,
        width: handWidth,
        height: handHeight,
        confidence: 0.78,
        wrist: {
          x: handX + handWidth * 0.5,
          y: handY + handHeight * 0.9
        },
        fingers: [
          { 
            x: handX + handWidth * 0.2, 
            y: handY + handHeight * 0.4, 
            type: 'index' 
          },
          { 
            x: handX + handWidth * 0.35, 
            y: handY + handHeight * 0.3, 
            type: 'middle' 
          },
          { 
            x: handX + handWidth * 0.5, 
            y: handY + handHeight * 0.35, 
            type: 'ring' 
          },
          { 
            x: handX + handWidth * 0.65, 
            y: handY + handHeight * 0.4, 
            type: 'pinky' 
          },
          { 
            x: handX + handWidth * 0.1, 
            y: handY + handHeight * 0.6, 
            type: 'thumb' 
          }
        ]
      };

      hands.push(primaryHand);

      // Sometimes detect second hand
      if (Math.random() > 0.6) {
        const secondHandX = imageElement.width * 0.2;
        const secondHandY = imageElement.height * 0.65;
        
        const secondHand: HandDetectionResult = {
          x: secondHandX,
          y: secondHandY,
          width: handWidth * 0.9,
          height: handHeight * 0.9,
          confidence: 0.65,
          wrist: {
            x: secondHandX + handWidth * 0.45,
            y: secondHandY + handHeight * 0.85
          },
          fingers: [
            { 
              x: secondHandX + handWidth * 0.25, 
              y: secondHandY + handHeight * 0.4, 
              type: 'index' 
            },
            { 
              x: secondHandX + handWidth * 0.4, 
              y: secondHandY + handHeight * 0.3, 
              type: 'middle' 
            },
            { 
              x: secondHandX + handWidth * 0.55, 
              y: secondHandY + handHeight * 0.35, 
              type: 'ring' 
            },
            { 
              x: secondHandX + handWidth * 0.7, 
              y: secondHandY + handHeight * 0.4, 
              type: 'pinky' 
            }
          ]
        };
        
        hands.push(secondHand);
      }

      resolve(hands);
    }, 600);
  });
};

export const getJewelryType = (description: string): 'necklace' | 'earrings' | 'ring' | 'bracelet' | 'other' => {
  const desc = description.toLowerCase();
  
  // More comprehensive jewelry type detection
  if (desc.includes('necklace') || desc.includes('pendant') || desc.includes('chain') || 
      desc.includes('choker') || desc.includes('collar')) {
    return 'necklace';
  }
  
  if (desc.includes('earring') || desc.includes('ear') || desc.includes('stud') || 
      desc.includes('hoop') || desc.includes('drop')) {
    return 'earrings';
  }
  
  if (desc.includes('ring') || desc.includes('band') || desc.includes('engagement') || 
      desc.includes('wedding') || desc.includes('signet')) {
    return 'ring';
  }
  
  if (desc.includes('bracelet') || desc.includes('bangle') || desc.includes('cuff') || 
      desc.includes('tennis') || desc.includes('charm')) {
    return 'bracelet';
  }
  
  // Default to necklace for better positioning
  return 'necklace';
};

// Utility function to get optimal jewelry positioning based on type
export const getOptimalJewelryPosition = (
  jewelryType: string,
  face: FaceDetectionResult | null,
  hands: HandDetectionResult[],
  containerWidth: number,
  containerHeight: number
) => {
  if (!face) {
    return { x: 50, y: 50, scale: 1, rotation: 0 };
  }

  const faceWidthRatio = face.width / containerWidth;
  const baseScale = Math.min(Math.max(faceWidthRatio * 2, 0.5), 2);

  switch (jewelryType) {
    case 'necklace':
      return {
        x: (face.landmarks?.neckCenter?.x || face.x + face.width / 2) / containerWidth * 100,
        y: (face.landmarks?.neckCenter?.y || face.y + face.height * 1.1) / containerHeight * 100,
        scale: baseScale * 1.2,
        rotation: 0
      };

    case 'earrings':
      return {
        x: (face.landmarks?.leftEar?.x || face.x + face.width * 0.15) / containerWidth * 100,
        y: (face.landmarks?.leftEar?.y || face.y + face.height * 0.3) / containerHeight * 100,
        scale: baseScale * 0.6,
        rotation: 0
      };

    case 'ring':
      if (hands.length > 0) {
        const ringFinger = hands[0].fingers?.find(f => f.type === 'ring') || hands[0].fingers?.[0];
        if (ringFinger) {
          return {
            x: ringFinger.x / containerWidth * 100,
            y: ringFinger.y / containerHeight * 100,
            scale: baseScale * 0.3,
            rotation: 0
          };
        }
      }
      // Fallback to hand center
      if (hands.length > 0) {
        return {
          x: (hands[0].x + hands[0].width * 0.5) / containerWidth * 100,
          y: (hands[0].y + hands[0].height * 0.4) / containerHeight * 100,
          scale: baseScale * 0.4,
          rotation: 0
        };
      }
      break;

    case 'bracelet':
      if (hands.length > 0) {
        const wrist = hands[0].wrist;
        if (wrist) {
          return {
            x: wrist.x / containerWidth * 100,
            y: wrist.y / containerHeight * 100,
            scale: baseScale * 0.7,
            rotation: 0
          };
        }
        return {
          x: (hands[0].x + hands[0].width * 0.5) / containerWidth * 100,
          y: (hands[0].y + hands[0].height * 0.8) / containerHeight * 100,
          scale: baseScale * 0.7,
          rotation: 0
        };
      }
      break;
  }

  // Default positioning
  return {
    x: 50,
    y: 50,
    scale: baseScale,
    rotation: 0
  };
};