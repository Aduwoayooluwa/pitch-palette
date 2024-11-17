import React from 'react';
import { Mic, MicOff, Trash2 } from 'lucide-react';

interface ControlsProps {
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onClear: () => void;
}

const Controls: React.FC<ControlsProps> = ({
  isRecording,
  onStartRecording,
  onStopRecording,
  onClear,
}) => {
  return (
    <div className="absolute top-4 right-4 flex gap-4 z-50">
      <button
        onClick={onClear}
        className="p-3 bg-gray-800/90 backdrop-blur-sm rounded-full hover:bg-gray-700/90 transition-colors shadow-lg"
        title="Clear canvas"
      >
        <Trash2 className="w-6 h-6 text-white" />
      </button>
      <button
        onClick={isRecording ? onStopRecording : onStartRecording}
        className={`p-3 rounded-full transition-colors shadow-lg backdrop-blur-sm ${
          isRecording 
            ? 'bg-red-500/90 hover:bg-red-600/90' 
            : 'bg-gray-800/90 hover:bg-gray-700/90'
        }`}
        title={isRecording ? 'Stop recording' : 'Start recording'}
      >
        {isRecording ? (
          <MicOff className="w-6 h-6 text-white" />
        ) : (
          <Mic className="w-6 h-6 text-white" />
        )}
      </button>
    </div>
  );
};

export default Controls;