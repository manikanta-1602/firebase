'use server';
/**
 * @fileOverview This file defines a Genkit flow for detecting ingredients from a photo.
 *
 * - detectIngredientsFromPhoto - A function that takes a photo and returns a list of detected ingredients.
 * - DetectIngredientsFromPhotoInput - The input type for the detectIngredientsFromPhoto function.
 * - DetectIngredientsFromPhotoOutput - The return type for the detectIngredientsFromPhoto function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectIngredientsFromPhotoInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      'A photo of ingredients, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' 
    ),
});
export type DetectIngredientsFromPhotoInput = z.infer<typeof DetectIngredientsFromPhotoInputSchema>;

const DetectIngredientsFromPhotoOutputSchema = z.object({
  ingredients: z
    .array(z.string())
    .describe('A list of ingredients detected in the photo.'),
});
export type DetectIngredientsFromPhotoOutput = z.infer<typeof DetectIngredientsFromPhotoOutputSchema>;

export async function detectIngredientsFromPhoto(
  input: DetectIngredientsFromPhotoInput
): Promise<DetectIngredientsFromPhotoOutput> {
  return detectIngredientsFromPhotoFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectIngredientsFromPhotoPrompt',
  input: {schema: DetectIngredientsFromPhotoInputSchema},
  output: {schema: DetectIngredientsFromPhotoOutputSchema},
  prompt: `You are an AI that detects ingredients from a photo.

  Analyze the photo and extract a list of ingredients.
  Return the ingredients as a list of strings.

  Photo: {{media url=photoDataUri}}
  Ingredients:`,
});

const detectIngredientsFromPhotoFlow = ai.defineFlow(
  {
    name: 'detectIngredientsFromPhotoFlow',
    inputSchema: DetectIngredientsFromPhotoInputSchema,
    outputSchema: DetectIngredientsFromPhotoOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
