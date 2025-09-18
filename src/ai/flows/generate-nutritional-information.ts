// src/ai/flows/generate-nutritional-information.ts
'use server';

/**
 * @fileOverview Generates nutritional information for a given recipe.
 *
 * - generateNutritionalInformation - A function that generates nutritional information for a recipe.
 * - GenerateNutritionalInformationInput - The input type for the generateNutritionalInformation function.
 * - GenerateNutritionalInformationOutput - The return type for the generateNutritionalInformation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateNutritionalInformationInputSchema = z.object({
  recipeName: z.string().describe('The name of the recipe.'),
  ingredients: z.string().describe('A list of ingredients in the recipe.'),
  instructions: z.string().describe('The preparation instructions for the recipe.'),
});
export type GenerateNutritionalInformationInput = z.infer<
  typeof GenerateNutritionalInformationInputSchema
>;

const GenerateNutritionalInformationOutputSchema = z.object({
  calories: z.number().describe('The total number of calories in the recipe.'),
  protein: z.number().describe('The total amount of protein in grams.'),
  fat: z.number().describe('The total amount of fat in grams.'),
  carbohydrates: z.number().describe('The total amount of carbohydrates in grams.'),
});
export type GenerateNutritionalInformationOutput = z.infer<
  typeof GenerateNutritionalInformationOutputSchema
>;

export async function generateNutritionalInformation(
  input: GenerateNutritionalInformationInput
): Promise<GenerateNutritionalInformationOutput> {
  return generateNutritionalInformationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateNutritionalInformationPrompt',
  input: {schema: GenerateNutritionalInformationInputSchema},
  output: {schema: GenerateNutritionalInformationOutputSchema},
  prompt: `You are a nutritional expert. Please analyze the following recipe and provide its nutritional information.

Recipe Name: {{{recipeName}}}
Ingredients: {{{ingredients}}}
Instructions: {{{instructions}}}

Provide the following information in JSON format:
{
  "calories": number,
  "protein": number,
  "fat": number,
  "carbohydrates": number
}

Ensure that the values for calories, protein, fat, and carbohydrates are accurate and based on standard nutritional data.`,
});

const generateNutritionalInformationFlow = ai.defineFlow(
  {
    name: 'generateNutritionalInformationFlow',
    inputSchema: GenerateNutritionalInformationInputSchema,
    outputSchema: GenerateNutritionalInformationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
