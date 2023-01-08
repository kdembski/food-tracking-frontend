import { useStore } from "vuex";
import { computed } from "vue";
import { ListFilters } from "@/types/components/data-display/list";
import { Ref } from "vue";

let temporarySearchPhrase = "";

export function useSearchPhraseFilter(
  filters: Ref<ListFilters>,
  handleListLoadingProccess: () => void,
  storeModuleName: string
) {
  const store = useStore();

  const filterBySearchPhrase = () => {
    setTemporarySearchPhrase();
    filters.value.currentPage = 1;
    handleListLoadingProccess();
  };

  const setTemporarySearchPhrase = () => {
    temporarySearchPhrase = filters.value.searchPhrase;
  };

  const filterBySearchPhraseWithDelay = () => {
    setTimeout(() => {
      if (temporarySearchPhrase === filters.value.searchPhrase) {
        return;
      }
      filterBySearchPhrase();
    }, 100);
  };

  const loadSearchSuggestions = () => {
    const filtersForSearchSuggestions = {
      searchPhrase: "",
      tags: filters.value.tags,
    };

    store.dispatch(
      storeModuleName + "/loadSearchSuggestions",
      filtersForSearchSuggestions
    );
  };

  const searchSuggestions = computed(() => {
    return store.getters[storeModuleName + "/searchSuggestions"];
  });

  const isLoadingSearchSuggestions = computed(() => {
    return store.getters[storeModuleName + "/isLoadingSearchSuggestions"];
  });

  return {
    filterBySearchPhrase,
    setTemporarySearchPhrase,
    filterBySearchPhraseWithDelay,
    searchSuggestions,
    isLoadingSearchSuggestions,
    loadSearchSuggestions,
  };
}
