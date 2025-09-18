'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating recipe suggestions based on a list of identified ingredients.
 *
 * The flow takes a list of ingredients as input and returns a list of recipe suggestions.
 * - generateRecipes - A function that generates recipe suggestions from a list of ingredients.
 * - GenerateRecipesInput - The input type for the generateRecipes function.
 * - GenerateRecipesOutput - The return type for the generateRecipes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRecipesInputSchema = z.object({
  ingredients: z
    .array(z.string())
    .describe('A list of ingredients identified from the uploaded photo.'),
});
export type GenerateRecipesInput = z.infer<typeof GenerateRecipesInputSchema>;

const GenerateRecipesOutputSchema = z.object({
  recipes: z.array(
    z.object({
      name: z.string().describe('The name of the recipe.'),
      ingredients: z.array(z.string()).describe('The ingredients required for the recipe.'),
      instructions: z.string().describe('The preparation instructions for the recipe.'),
    })
  ).describe('A list of recipe suggestions.'),
});
export type GenerateRecipesOutput = z.infer<typeof GenerateRecipesOutputSchema>;

export async function generateRecipes(input: GenerateRecipesInput): Promise<GenerateRecipesOutput> {
  return generateRecipesFlow(input);
}

const generateRecipesPrompt = ai.definePrompt({
  name: 'generateRecipesPrompt',
  input: {schema: GenerateRecipesInputSchema},
  output: {schema: GenerateRecipesOutputSchema},
  prompt: `You are a recipe suggestion bot. Given a list of ingredients, you will generate a list of recipes that use those ingredients.  Make sure to incorporate all ingredients into each recipe.

Ingredients:
{{#each ingredients}}- {{{this}}}
{{/each}}`,
});

const generateRecipesFlow = ai.defineFlow(
  {
    name: 'generateRecipesFlow',
    inputSchema: GenerateRecipesInputSchema,
    outputSchema: GenerateRecipesOutputSchema,
  },
  async input => {
    const {output} = await generateRecipesPrompt(input);
    return output!;
  }
);
