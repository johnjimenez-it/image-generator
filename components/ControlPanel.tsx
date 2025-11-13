
import React from 'react';
import { SparklesIcon } from './icons';

interface ControlPanelProps {
  prompt: string;
  onPromptChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  prompt,
  onPromptChange,
  onSubmit,
  isLoading,
}) => {
  return (
    <div className="w-full max-w-4xl mt-8 sticky bottom-0 bg-base-100/80 backdrop-blur-lg py-4 px-2 sm:px-0">
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            placeholder="e.g., Add a retro filter, make the sky look like a galaxy..."
            className="w-full bg-base-200 border border-base-300 rounded-full py-4 pl-6 pr-40 resize-none focus:ring-2 focus:ring-brand-primary focus:outline-none transition-shadow duration-200 text-gray-200 placeholder-gray-500"
            rows={1}
            disabled={isLoading}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
            <button
              onClick={onSubmit}
              disabled={isLoading || !prompt}
              className="flex items-center gap-2 bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-semibold py-3 px-6 rounded-full hover:shadow-lg hover:shadow-indigo-500/50 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
            >
              <SparklesIcon className="w-5 h-5" />
              <span>{isLoading ? 'Generating...' : 'Generate'}</span>
            </button>
          </div>
        </div>
    </div>
  );
};