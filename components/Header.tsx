
import React from 'react';
import { MagicWandIcon } from './icons';

export const Header: React.FC = () => (
  <header className="w-full max-w-7xl text-center mb-4">
    <div className="flex justify-center items-center gap-4 mb-2">
       <div className="bg-gradient-to-r from-brand-primary to-brand-secondary p-2 rounded-lg">
        <MagicWandIcon className="w-8 h-8 text-white" />
       </div>
      <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
        Nano Banana Image Editor
      </h1>
    </div>
    <p className="text-lg text-gray-400">
      Edit images with text prompts using Gemini 2.5 Flash Image.
    </p>
  </header>
);
