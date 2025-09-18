'use client';

import { useState, useRef, ChangeEvent, FormEvent } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, Sparkles } from 'lucide-react';
import { Input } from './ui/input';

interface ImageUploaderProps {
  onImageAnalyze: (imageDataUri: string) => void;
  isLoading: boolean;
}

export function ImageUploader({ onImageAnalyze, isLoading }: ImageUploaderProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyzeClick = (event: FormEvent) => {
    event.preventDefault();
    if (imagePreview) {
      onImageAnalyze(imagePreview);
    }
  };
  
  const handleCardClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <form onSubmit={handleAnalyzeClick} className="w-full max-w-lg mx-auto">
      <Card 
        className="relative border-2 border-dashed border-muted-foreground/30 hover:border-primary transition-colors duration-300 cursor-pointer group"
        onClick={handleCardClick}
      >
        <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-4 min-h-[250px]">
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            ref={fileInputRef}
            className="hidden"
            id="image-upload"
          />
          {imagePreview ? (
            <div className="relative w-full h-48 rounded-md overflow-hidden">
                <Image src={imagePreview} alt="Ingredient preview" layout="fill" objectFit="contain" />
            </div>
          ) : (
            <>
              <div className="p-4 bg-muted rounded-full text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                <Upload className="size-8" />
              </div>
              <div>
                <p className="font-semibold text-foreground">
                  Click to upload or drag and drop
                </p>
                <p className="text-sm text-muted-foreground">
                  PNG, JPG, or WEBP
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <div className="mt-6 flex justify-center">
        <Button
          type="submit"
          disabled={!imagePreview || isLoading}
          size="lg"
        >
          <Sparkles className="mr-2" />
          {isLoading ? 'Analyzing...' : 'Generate Recipes'}
        </Button>
      </div>
    </form>
  );
}
