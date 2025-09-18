'use client';

import { ChefHat } from 'lucide-react';
import { useEffect, useState } from 'react';

const loadingTexts = [
  'Simmering ideas...',
  'Prepping the ingredients...',
  'Consulting the cookbook...',
  'Sharpening the knives...',
  'Whisking up some magic...',
  'Tasting for seasoning...',
];

export function Loader() {
  const [text, setText] = useState(loadingTexts[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setText(loadingTexts[Math.floor(Math.random() * loadingTexts.length)]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center space-y-4 my-16 text-center">
      <div className="relative">
        <ChefHat className="size-16 text-primary animate-spin" style={{ animationDuration: '3s' }} />
      </div>
      <p className="text-lg font-semibold text-muted-foreground animate-pulse">{text}</p>
    </div>
  );
}
