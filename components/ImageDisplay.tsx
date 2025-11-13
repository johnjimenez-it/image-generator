
import React from 'react';
import { ArrowPathIcon, UploadIcon } from './icons';

interface ImageDisplayProps {
  title: string;
  src: string | null;
  alt: string;
  children?: React.ReactNode;
  onUseAsOriginal?: () => void;
  isUploadTarget?: boolean;
  onFileChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ImageDisplay: React.FC<ImageDisplayProps> = ({ title, src, alt, children, onUseAsOriginal, isUploadTarget, onFileChange }) => {
  return (
    <div className="w-full lg:w-1/2 flex flex-col items-center">
      <h2 className="text-2xl font-bold text-gray-300 mb-4">{title}</h2>
      <div className="relative w-full aspect-square bg-base-200 rounded-xl shadow-lg border border-base-300 overflow-hidden">
        {src ? (
           <img src={src} alt={alt} className="w-full h-full object-contain animate-fade-in" />
        ) : (
            <div className="w-full h-full"></div>
        )}
        {children}
        {isUploadTarget && onFileChange && (
          <label 
            htmlFor="file-upload-display" 
            className="absolute inset-0 flex flex-col justify-center items-center bg-base-100/70 text-white cursor-pointer opacity-0 hover:opacity-100 transition-opacity duration-300 group"
            aria-label="Upload a new image"
          >
            <UploadIcon className="w-12 h-12 mb-2 transition-transform duration-300 group-hover:scale-110" />
            <span className="font-semibold text-lg">Upload New Image</span>
            <input id="file-upload-display" name="file-upload" type="file" className="sr-only" onChange={onFileChange} accept="image/*" />
          </label>
        )}
      </div>
       {onUseAsOriginal && src && (
        <button
          onClick={onUseAsOriginal}
          className="mt-4 flex items-center gap-2 bg-base-200 hover:bg-base-300 text-gray-300 font-semibold py-2 px-4 rounded-full transition-all duration-200 transform hover:scale-105"
          aria-label="Use this edited image as the new original image"
        >
          <ArrowPathIcon className="w-5 h-5" />
          <span>Use as Original</span>
        </button>
      )}
    </div>
  );
};