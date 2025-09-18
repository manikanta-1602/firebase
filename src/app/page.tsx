'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import useLocalStorage from '@/hooks/use-local-storage';
import { getRecipesAndNutrition } from '@/lib/actions';
import { FullRecipe } from '@/lib/types';
import { ImageUploader } from '@/components/image-uploader';
import { Loader } from '@/components/loader';
import { RecipeCard } from '@/components/recipe-card';
import { Badge } from '@/components/ui/badge';
import { detectIngredientsFromPhoto } from '@/ai/flows/detect-ingredients-from-photo';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function CreateRecipePage() {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<FullRecipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [favorites, setFavorites] = useLocalStorage<FullRecipe[]>('favoriteRecipes', []);

  const handleImageAnalyze = async (imageDataUri: string) => {
    setIsLoading(true);
    setError(null);
    setRecipes([]);
    setIngredients([]);

    try {
      const ingredientResult = await detectIngredientsFromPhoto({ photoDataUri: imageDataUri });

      if (ingredientResult.ingredients && ingredientResult.ingredients.length > 0) {
        setIngredients(ingredientResult.ingredients);
        
        const recipeResult = await getRecipesAndNutrition(ingredientResult.ingredients);
        if (recipeResult.recipes) {
          const fullRecipes = recipeResult.recipes.map((recipe, index) => ({
            ...recipe,
            id: `${recipe.name.replace(/\s+/g, '-')}-${Date.now()}`,
            image: {
              url: PlaceHolderImages[index % PlaceHolderImages.length].imageUrl,
              hint: PlaceHolderImages[index % PlaceHolderImages.length].imageHint,
            }
          }));
          setRecipes(fullRecipes);
        } else {
          throw new Error(recipeResult.message || 'Failed to generate recipes.');
        }

      } else {
        throw new Error('Could not detect any ingredients. Try a different photo.');
      }
    } catch (e: any) {
      const errorMessage = e.message || 'An unexpected error occurred.';
      setError(errorMessage);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleToggleFavorite = (recipe: FullRecipe) => {
    setFavorites(prev => {
      const isFavorited = prev.some(fav => fav.id === recipe.id);
      if (isFavorited) {
        return prev.filter(fav => fav.id !== recipe.id);
      } else {
        return [...prev, recipe];
      }
    });
  };

  const isRecipeFavorite = (recipeId: string) => {
    return favorites.some(fav => fav.id === recipeId);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold">
          What&apos;s on your plate?
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Upload a photo of your ingredients, and let AI craft a custom recipe just for you.
        </p>
      </section>

      <section>
        <ImageUploader onImageAnalyze={handleImageAnalyze} isLoading={isLoading} />
      </section>

      {isLoading && <Loader />}

      {!isLoading && recipes.length > 0 && (
         <section className="mt-16">
          <div className="text-center mb-8">
            <h2 className="font-headline text-3xl font-bold">Detected Ingredients</h2>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {ingredients.map((ingredient, index) => (
                <Badge key={index} variant="secondary" className="text-base px-3 py-1">
                  {ingredient}
                </Badge>
              ))}
            </div>
          </div>
          <h2 className="font-headline text-3xl font-bold text-center mb-8">Recipe Suggestions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                isFavorite={isRecipeFavorite(recipe.id)}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
