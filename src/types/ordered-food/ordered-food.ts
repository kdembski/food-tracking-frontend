import { ListWithFilters } from "@/types/components/data-display/list";

export interface OrderedFoodState {
  orderedFoodList: OrderedFoodList | null;
  isLoadingOrderedFoodList: boolean;
  orderedFoodTags: string | null;
  isLoadingOrderedFoodTags: boolean;
  orderedFood: OrderedFood | null;
  isSubmittingOrderedFood: boolean;
  isLoadingOrderedFood: boolean;
}

export interface OrderedFood {
  id: number;
  foodName: string;
  placeName: string;
  tags: string;
  orderDate?: Date;
  orderDatesInCurrentMonth: Date[];
}

export type OrderedFoodList = ListWithFilters<OrderedFood>;