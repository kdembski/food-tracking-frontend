import { ApiError } from "./../api";
import { List } from "@/types/components/data-display/list";
import { Tag } from "../components/utils/tags";

export interface RecipeState {
  single: Recipe | null;
  isLoading: boolean;
  list: RecipesList | null;
  isLoadingList: boolean;
  tags: Tag[] | null;
  isLoadingTags: boolean;
  searchSuggestions: string[] | null;
  isLoadingSearchSuggestions: boolean;
  isSubmitting: boolean;
  isDeleting: boolean;
  options: RecipeOption[] | null;
  isLoadingOptions: boolean;
  errors: RecipeErrors | null;
  isAddingToShoppingList: boolean;
}

export interface Recipe {
  id: number;
  recipeName: string;
  preparationTime: number;
  tags: string;
  cookidooLink: string;
  cookedDate?: Date;
  datesFromLastYear: Date[][];
  kcal?: number;
}

export type RecipesList = List<Recipe>;

export interface RecipesFilters {
  searchPhrase: string;
  tags: string;
  ingredientIds: number[];
}

export interface RecipeErrors {
  recipeName: ApiError;
  preparationTime: ApiError;
}

export interface RecipeOption {
  id: number;
  recipeName: string;
}
