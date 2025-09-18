export type Recipe = {
  name: string;
  ingredients: string[];
  instructions: string;
};

export type NutritionalInfo = {
  calories: number;
  protein: number;
  fat: number;
  carbohydrates: number;
};

export type FullRecipe = Recipe & {
  id: string;
  nutritionalInfo: NutritionalInfo;
  image: {
    url: string;
    hint: string;
  };
};
