'use client';

import useLocalStorage from '@/hooks/use-local-storage';
import { FullRecipe } from '@/lib/types';
import { RecipeCard } from '@/components/recipe-card';
import { BookHeart } from 'lucide-react';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useLocalStorage<FullRecipe[]>('favoriteRecipes', []);
  
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

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold">
          My Favorite Recipes
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Your personal collection of delicious creations.
        </p>
      </section>

      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {favorites.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              isFavorite={true}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed border-muted-foreground/20 rounded-lg">
          <BookHeart className="mx-auto size-16 text-muted-foreground/50" />
          <h2 className="mt-6 text-xl font-semibold">No favorites yet!</h2>
          <p className="mt-2 text-muted-foreground">
            Start creating recipes to save them here.
          </p>
        </div>
      )}
    </div>
  );
}
