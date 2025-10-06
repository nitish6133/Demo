import React, { useState, useRef, useEffect } from 'react';
import { User, GraduationCap, Camera, RotateCcw, Check, X } from 'lucide-react';
import { useSessionStore } from '../stores/useSessionStore';
import { useBrandingStore } from '../stores/useBrandingStore';
import { validateStudentName, validateStudentClass } from '../utils/validators';

const classes = [
  'Kindergarten', '1st Grade', '2nd Grade', '3rd Grade', '4th Grade',
  '5th Grade', '6th Grade', '7th Grade', '8th Grade', '9th Grade',
  '10th Grade', '11th Grade', '12th Grade',
];

interface StartSessionFormProps {
  onSessionStart: () => void;
}

const StartSessionForm: React.FC<StartSessionFormProps> = ({ onSessionStart }) => {
  const [step, setStep] = useState<'form' | 'photo' | 'confirm'>('form');
  const [studentName, setStudentName] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState<{ studentName?: string; studentClass?: string }>({});

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startSession = useSessionStore((state) => state.startSession);
  const loadBrandingSettings = useBrandingStore((state) => state.loadSettings);

  // ✅ Load branding settings on mount to get schoolId
  useEffect(() => {
    const load = async () => {
      try {
        await loadBrandingSettings();
      } catch (err) {
        console.error('Failed to load branding settings:', err);
      }
    };
    load();
  }, [loadBrandingSettings]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const nameError = validateStudentName(studentName);
    const classError = validateStudentClass(studentClass);

    if (nameError || classError) {
      setErrors({
        studentName: nameError || undefined,
        studentClass: classError || undefined,
      });
      return;
    }

    setErrors({});
    setStep('photo');
    startCamera();
  };

  const startCamera = async () => {
  try {
    // Try default user-facing camera
    let stream: MediaStream | null = null;

    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
    } catch (err) {
      console.warn('User-facing camera not found, trying any camera...', err);
      // fallback: try any available camera
      stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    }

    streamRef.current = stream;
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  } catch (error: any) {
    console.error('Error accessing camera:', error);

    // ✅ Only alert if really no camera exists
    if (error.name === 'NotAllowedError') {
      alert('Camera permission denied. Please allow camera access.');
    } else if (error.name === 'NotFoundError') {
      alert('No camera found on this device.');
    } else {
      alert('Cannot access camera. Please check your device or browser.');
    }
  }
};


  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      if (context) {
        context.drawImage(video, 0, 0);
        const photoDataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setCapturedPhoto(photoDataUrl);
        setStep('confirm');
        stopCamera();
      }
    }
  };

  const retakePhoto = () => {
    setCapturedPhoto(null);
    setStep('photo');
    startCamera();
  };

  const handleConfirmPhoto = async () => {
    setIsUploading(true);

    try {
      // ✅ Wait for a short delay to simulate upload
      await new Promise(resolve => setTimeout(resolve, 1500));

      // ✅ Start session with branding schoolId already loaded
      await startSession(
        studentName.trim(),
        studentClass,
        "Student",
        "", // studentImageId
        capturedPhoto ?? null
      );

      onSessionStart();
    } catch (error) {
      console.error('Error starting session:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleBack = () => {
    if (step === 'photo') {
      stopCamera();
      setStep('form');
    } else if (step === 'confirm') {
      setCapturedPhoto(null);
      setStep('photo');
      startCamera();
    }
  };

  // Form Step
  if (step === 'form') {
    return (
      <form onSubmit={handleFormSubmit} className="space-y-6">
        <div>
          <label htmlFor="studentName" className="block text-sm font-medium text-gray-700 mb-2">
            <User className="inline w-4 h-4 mr-1" />
            Student Name
          </label>
          <input
            type="text"
            id="studentName"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            className={`w-full px-4 py-3 rounded-lg border text-lg ${errors.studentName ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            placeholder="Enter student name"
          />
          {errors.studentName && <p className="mt-1 text-sm text-red-600">{errors.studentName}</p>}
        </div>

        <div>
          <label htmlFor="studentClass" className="block text-sm font-medium text-gray-700 mb-2">
            <GraduationCap className="inline w-4 h-4 mr-1" />
            Class/Grade
          </label>
          <select
            id="studentClass"
            value={studentClass}
            onChange={(e) => setStudentClass(e.target.value)}
            className={`w-full px-4 py-3 rounded-lg border text-lg ${errors.studentClass ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
          >
            <option value="">Select class/grade</option>
            {classes.map((cls) => <option key={cls} value={cls}>{cls}</option>)}
          </select>
          {errors.studentClass && <p className="mt-1 text-sm text-red-600">{errors.studentClass}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition duration-200 flex items-center justify-center text-lg"
        >
          <Camera className="w-5 h-5 mr-2" />
          Take Student Photo
        </button>
      </form>
    );
  }

  // Photo Capture Step
  if (step === 'photo') {
    return (
      <div className="space-y-4">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Take Student Photo</h3>
          <p className="text-sm text-gray-600">Position {studentName} in the camera frame</p>
        </div>

        <div className="relative">
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-64 object-cover rounded-lg bg-gray-900" />
          <canvas ref={canvasRef} className="hidden" />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-48 h-48 border-2 border-white border-dashed rounded-full opacity-50"></div>
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={handleBack} className="flex-1 px-4 py-3 border border-gray-300 hover:border-gray-400 text-gray-700 font-medium rounded-lg transition duration-200 flex items-center justify-center">
            <X className="w-4 h-4 mr-2" /> Cancel
          </button>
          <button onClick={capturePhoto} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center">
            <Camera className="w-4 h-4 mr-2" /> Capture
          </button>
        </div>
      </div>
    );
  }

  // Confirm Photo Step
  if (step === 'confirm') {
    return (
      <div className="space-y-4">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirm Student Photo</h3>
          <p className="text-sm text-gray-600">{studentName} - {studentClass}</p>
        </div>

        {capturedPhoto && <div className="relative">
          <img src={capturedPhoto} alt="Captured student photo" className="w-full h-64 object-cover rounded-lg" />
        </div>}

        <div className="flex gap-3">
          <button onClick={retakePhoto} disabled={isUploading} className="flex-1 px-4 py-3 border border-gray-300 hover:border-gray-400 disabled:opacity-50 text-gray-700 font-medium rounded-lg transition duration-200 flex items-center justify-center">
            <RotateCcw className="w-4 h-4 mr-2" /> Retake
          </button>
          <button onClick={handleConfirmPhoto} disabled={isUploading} className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center">
            {isUploading ? <>
              <div className="w-4 h-4 border-2 border-white border-l-transparent rounded-full animate-spin mr-2"></div>
              Uploading...
            </> : <>
              <Check className="w-4 h-4 mr-2" /> Confirm & Start
            </>}
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default StartSessionForm;
