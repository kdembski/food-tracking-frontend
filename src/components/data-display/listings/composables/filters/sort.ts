import { isEqual } from "lodash";
import { DropdownOption } from "@/types/components/utils/dropdown";
import { computed } from "vue";
import {
  ListFilters,
  ListSortFilters,
} from "@/types/components/data-display/list";
import { Ref } from "vue";

export function useSortFilter(
  filters: Ref<ListFilters<unknown>>,
  handleListLoadingProccess: () => void
) {
  const selectedSort = computed(() => {
    return {
      sortAttribute: filters.value.sortAttribute,
      sortDirection: filters.value.sortDirection,
    };
  });

  const getSelectedSortIcon = (
    sortOptions: DropdownOption<ListSortFilters>[]
  ) => {
    return sortOptions?.find((option: DropdownOption<ListSortFilters>) =>
      isEqual(option.value, selectedSort.value)
    )?.icon;
  };

  const sort = (sort: ListSortFilters) => {
    filters.value.sortAttribute = sort.sortAttribute;
    filters.value.sortDirection = sort.sortDirection;

    filters.value.currentPage = 1;
    handleListLoadingProccess();
  };

  return {
    selectedSort,
    getSelectedSortIcon,
    sort,
  };
}
