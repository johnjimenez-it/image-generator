
import React, { useState, useCallback } from 'react';
import { editImage } from './services/geminiService';
import { fileToBase64 } from './utils/fileUtils';
import { Header } from './components/Header';
import { ImageDisplay } from './components/ImageDisplay';
import { ControlPanel } from './components/ControlPanel';
import { Spinner } from './components/Spinner';

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<string>('https://picsum.photos/seed/react/1024/1024');
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const base64String = await fileToBase64(file);
        setOriginalImage(base64String);
        setEditedImage(null);
        setError(null);
      } catch (err) {
        setError('Failed to load image. Please try another file.');
        console.error(err);
      }
    }
  };

  const handleGenerate = useCallback(async () => {
    if (!prompt || !originalImage) {
      setError('Please provide an image and a prompt.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setEditedImage(null);

    try {
      const newImage = await editImage(originalImage, prompt);
      setEditedImage(newImage);
    // FIX: Added an opening brace to the catch block to fix a syntax error.
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to edit image: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [prompt, originalImage]);

  const handleUseEditedAsOriginal = useCallback(() => {
    if (editedImage) {
      setOriginalImage(editedImage);
      setEditedImage(null);
    }
  }, [editedImage]);


  return (
    <div className="min-h-screen bg-base-100 font-sans flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <Header />

      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-md relative my-4 max-w-4xl w-full" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <main className="flex flex-col lg:flex-row gap-8 w-full max-w-7xl mt-6 animate-fade-in">
        <ImageDisplay 
          title="Original Image" 
          src={originalImage} 
          alt="Original user-provided image"
          isUploadTarget={true}
          onFileChange={handleFileChange} 
        />
        <ImageDisplay 
          title="Edited Image" 
          src={editedImage} 
          alt="AI-edited image"
          onUseAsOriginal={handleUseEditedAsOriginal}
        >
          {isLoading && (
            <div className="absolute inset-0 bg-base-200/50 backdrop-blur-sm flex justify-center items-center rounded-xl">
              <Spinner />
            </div>
          )}
          {!isLoading && !editedImage && (
             <div className="absolute inset-0 flex justify-center items-center">
                <p className="text-gray-400">Your edited image will appear here</p>
            </div>
          )}
        </ImageDisplay>
      </main>
      
      <ControlPanel
        prompt={prompt}
        onPromptChange={setPrompt}
        onSubmit={handleGenerate}
        isLoading={isLoading}
      />
    </div>
  );
};

export default App;
