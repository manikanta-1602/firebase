import { config } from 'dotenv';
config();

import '@/ai/flows/detect-ingredients-from-photo.ts';
import '@/ai/flows/generate-nutritional-information.ts';
import '@/ai/flows/generate-recipes-from-ingredients.ts';