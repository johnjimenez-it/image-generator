
import { GoogleGenAI, Modality } from "@google/genai";

const parseDataUrl = (dataUrl: string): { base64Data: string; mimeType: string } => {
  const match = dataUrl.match(/^data:(.+);base64,(.+)$/);
  if (!match) {
    throw new Error("Invalid data URL format. Expected 'data:[mime-type];base64,[data]'.");
  }
  return { mimeType: match[1], base64Data: match[2] };
};

const urlToDataUrl = (url: string): Promise<string> => {
  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.blob();
    })
    .then(blob => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    });
};

export const editImage = async (imageUrl: string, prompt: string): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set.");
  }

  let imageDataUrl = imageUrl;
  if (imageUrl.startsWith('http')) {
      try {
        imageDataUrl = await urlToDataUrl(imageUrl);
      } catch (error) {
          console.error("Failed to fetch and convert image from URL:", error);
          throw new Error("Could not load the image from the provided URL. Please try uploading an image file instead.");
      }
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const { base64Data, mimeType } = parseDataUrl(imageDataUrl);

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          inlineData: {
            data: base64Data,
            mimeType: mimeType,
          },
        },
        {
          text: prompt,
        },
      ],
    },
    config: {
      responseModalities: [Modality.IMAGE],
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      const newBase64Data = part.inlineData.data;
      const newMimeType = part.inlineData.mimeType;
      return `data:${newMimeType};base64,${newBase64Data}`;
    }
  }

  throw new Error("No image found in the response from Gemini.");
};
