'use server';

import { detectIngredientsFromPhoto } from '@/ai/flows/detect-ingredients-from-photo';
import { generateNutritionalInformation } from '@/ai/flows/generate-nutritional-information';
import { generateRecipes } from '@/ai/flows/generate-recipes-from-ingredients';
import { z } from 'zod';
import { Recipe } from './types';

const imageSchema = z.object({
  photoDataUri: z.string().refine(val => val.startsWith('data:image/'), {
    message: 'Must be a data URI for an image',
  }),
});

export async function getIngredientsFromImage(prevState: any, formData: FormData) {
  const validatedFields = imageSchema.safeParse({
    photoDataUri: formData.get('photoDataUri'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Invalid image data.',
    };
  }

  try {
    const { ingredients } = await detectIngredientsFromPhoto(validatedFields.data);
    return { ingredients, message: 'success' };
  } catch (error) {
    console.error(error);
    return { message: 'Failed to detect ingredients. Please try again.' };
  }
}

export async function getRecipesAndNutrition(ingredients: string[]) {
  if (!ingredients || ingredients.length === 0) {
    return { message: 'No ingredients provided.' };
  }

  try {
    const recipeResult = await generateRecipes({ ingredients });
    
    const recipesWithNutrition = await Promise.all(
      recipeResult.recipes.map(async (recipe: Recipe) => {
        const nutritionalInfo = await generateNutritionalInformation({
          recipeName: recipe.name,
          ingredients: recipe.ingredients.join(', '),
          instructions: recipe.instructions,
        });
        return { ...recipe, nutritionalInfo };
      })
    );
    
    return { recipes: recipesWithNutrition, message: 'success' };
  } catch (error) {
    console.error(error);
    return { message: 'Failed to generate recipes. Please try again.' };
  }
}
