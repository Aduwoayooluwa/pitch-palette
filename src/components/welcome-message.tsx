import React from 'react';

interface WelcomeMessageProps {
  isRecording: boolean;
  error: string | null;
}

const WelcomeMessage: React.FC<WelcomeMessageProps> = ({ isRecording, error }) => {
  if (error) {
    return (
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-500/90 backdrop-blur-sm text-white px-6 py-3 rounded-lg shadow-lg z-50">
        {error}
      </div>
    );
  }

  if (!isRecording) {
    return (
      <div className="absolute inset-0 flex items-center justify-center z-30">
        <div className="max-w-md p-8 rounded-xl bg-gray-800/90 backdrop-blur-sm shadow-2xl text-center">
        <h1 className="text-4xl font-bold mb-6 text-white">Pitch Palette 🎨🎤</h1>
          <p className="text-lg text-white/90 leading-relaxed mb-4">
            Click the microphone icon to start. Your voice will create structured drawings:
          </p>
          <ul className="text-left text-white/90 space-y-2 mb-4">
            <li className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-[#FF6B6B] mr-3"></span>
              Low pitch (~100Hz) - Move left
            </li>
            <li className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-[#4ECDC4] mr-3"></span>
              Medium-low (~200Hz) - Move right
            </li>
            <li className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-[#45B7D1] mr-3"></span>
            {"  Medium (~300Hz) - Move up"}
            </li>
            <li className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-[#96CEB4] mr-3"></span>
              {"Medium-high (~400Hz) - Move down"}
            </li>
            <li className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-[#FFEEAD] mr-3"></span>
             {" High (>400Hz) - Create curves"}
            </li>
          </ul>
          <div className="text-white/90 space-y-2 text-left border-t border-white/20 pt-4 mt-4">
            <p className="font-semibold mb-2">Tips for generating different frequencies:</p>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Use a tone generator website (like szynalski.com/tone-generator)</li>
              <li>Hum different notes: low notes for left/right, high notes for up/down</li>
              <li>Whistle: lower whistles for movement, higher for curves</li>
              <li>Voice: "ooo" (low) to "eee" (high) for different directions</li>
            </ul>
            <p className="text-sm mt-3">
              Volume controls the line thickness and movement speed
            </p>
        </div>
      </div>
      </div>
    );
  }


  return null;
};

export default WelcomeMessage;