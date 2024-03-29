import { ApiError } from "@/types/api";
import { List } from "@/types/components/data-display/list";

export interface IngredientState {
  single: Ingredient | null;
  isLoading: boolean;

  list: IngredientsList | null;
  isLoadingList: boolean;
  isSubmitting: boolean;

  options: IngredientOption[] | null;
  isLoadingOptions: boolean;

  errors: IngredientErrors | null;
}

export interface Ingredient {
  id: number;
  name: string;
  categoryId: number;
  units: IngredientUnitDetails[];
}

export interface IngredientUnitDetails {
  id: number;
  ingredientId: number;
  unitId: number;
  kcalPerUnit: number;
  isPrimary: boolean;
  converterToPrimary: number;
  unitName: string;
  unitShortcut: string;
}

export interface IngredientListItem {
  id: number;
  name: string;
  categoryId: number;
  categoryName: string;
  unitNames: string[];
}

export interface IngredientOption {
  id: number;
  name: string;
}

export type IngredientsList = List<IngredientListItem>;

export interface IngredientsFilters {
  searchPhrase: string;
}

export enum IngredientsNavItems {
  LIST = "LIST",
  UNITS = "UNITS",
  CATEGORIES = "CATEGORIES",
}

export interface IngredientErrors {
  name: ApiError;
  categoryId: ApiError;
  units: {
    unitId: ApiError;
    kcalPerUnit: ApiError;
    converterToPrimary: ApiError;
  }[];
}
