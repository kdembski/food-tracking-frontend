import { List } from "@/types/components/data-display/list";
import { ApiError } from "../api";

export interface IngredientCategoryState {
  single: IngredientCategory | null;
  isLoading: boolean;

  list: IngredientCategoriesList | null;
  isLoadingList: boolean;
  isSubmitting: boolean;

  options: IngredientCategoryOption[] | null;
  isLoadingOptions: boolean;

  errors: IngredientCategoryErrors | null;
}

export interface IngredientCategory {
  id: number;
  name: string;
}

export interface IngredientCategoryOption {
  id: number;
  name: string;
}

export type IngredientCategoriesList = List<IngredientCategory>;

export interface IngredientCategoriesFilters {
  searchPhrase: string;
}

export interface IngredientCategoryErrors {
  name: ApiError;
}
