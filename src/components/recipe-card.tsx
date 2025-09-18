'use client';

import Image from 'next/image';
import { Heart } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { FullRecipe } from '@/lib/types';
import { NutritionChart } from './nutrition-chart';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';

interface RecipeCardProps {
  recipe: FullRecipe;
  isFavorite: boolean;
  onToggleFavorite: (recipe: FullRecipe) => void;
}

export function RecipeCard({ recipe, isFavorite, onToggleFavorite }: RecipeCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="relative w-full h-48">
        <Image
          src={recipe.image.url}
          alt={recipe.name}
          data-ai-hint={recipe.image.hint}
          fill
          className="object-cover"
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 bg-background/70 hover:bg-background rounded-full text-accent"
          onClick={() => onToggleFavorite(recipe)}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart className={cn('size-5', isFavorite && 'fill-current text-accent')} />
        </Button>
      </div>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">{recipe.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="ingredients">
            <AccordionTrigger>Ingredients</AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="instructions">
            <AccordionTrigger>Instructions</AccordionTrigger>
            <AccordionContent>
              <p className="whitespace-pre-line text-muted-foreground">
                {recipe.instructions}
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
      <CardFooter className="flex-col items-start gap-4">
        <NutritionChart data={recipe.nutritionalInfo} />
      </CardFooter>
    </Card>
  );
}
