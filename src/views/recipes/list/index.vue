<script lang="ts">
import CListWithFilters from "@/components/data-display/listings/list-with-filters/index.vue";
import CButton from "@/components/controls/buttons/button/index.vue";
import CHorizontalTabs from "@/components/navigation/horizontal-tabs/index.vue";
import RecipesListItemHeader from "./list-item/header/index.vue";
import RecipesListItemBody from "./list-item/body/index.vue";
import RecipesListIngredientsFilter from "./filters/ingredients/index.vue";

export default {
  name: "RecipesListView",
  components: {
    CListWithFilters,
    CButton,
    CHorizontalTabs,
    RecipesListItemHeader,
    RecipesListItemBody,
    RecipesListIngredientsFilter,
  },
};
</script>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { ListFilters } from "@/types/components/data-display/list";
import { RecipesFilters } from "@/types/recipes/recipe";

const store = useStore();
const router = useRouter();

const recipesListDefaultFilters: ListFilters<RecipesFilters> = {
  currentPage: 1,
  pageSize: 20,
  sortAttribute: "cookedDate",
  sortDirection: "desc",
  custom: {
    searchPhrase: "",
    tags: "",
    ingredientIds: [],
  },
};

const recipeListSortOptions = ref([
  {
    value: {
      sortAttribute: "recipeName",
      sortDirection: "asc",
    },
    label: "Nazwa przepisu - rosnąco",
    icon: "arrow-down-a-z",
  },
  {
    value: {
      sortAttribute: "recipeName",
      sortDirection: "desc",
    },
    label: "Nazwa przepisu - malejąco",
    icon: "arrow-up-a-z",
  },
  {
    value: {
      sortAttribute: "preparationTime",
      sortDirection: "asc",
    },
    label: "Czas przygotowania - rosnąco",
    icon: "arrow-down-1-9",
  },
  {
    value: {
      sortAttribute: "preparationTime",
      sortDirection: "desc",
    },
    label: "Czas przygotowania - malejąco",
    icon: "arrow-up-1-9",
  },
  {
    value: {
      sortAttribute: "cookedDate",
      sortDirection: "asc",
    },
    label: "Data gotowania - rosnąco",
    icon: "arrow-down-short-wide",
  },
  {
    value: {
      sortAttribute: "cookedDate",
      sortDirection: "desc",
    },
    label: "Data gotowania - malejąco",
    icon: "arrow-up-short-wide",
  },
]);

const tabs = ref([
  { code: "ALL", label: "Wszystkie", count: 0 },
  { code: "NOT_COMPLETED", label: "Nieuzupełnione" },
  { code: "NEW", label: "Nowe" },
]);

const selectedTab = ref("ALL");

const setRecipesCount = async () => {
  tabs.value[0].count = await store.dispatch("recipe/getCount");
};

const goToNewRecipeView = () => {
  router.push("/recipes/new");
};

const loadRecipeIngredientsFilterOptions = (
  filters: ListFilters<RecipesFilters>
) => {
  return store.dispatch("recipe/ingredient/loadFilterOptions", filters);
};

onMounted(() => {
  setRecipesCount();
});
</script>

<template src="./template.html"></template>
<style src="./style.scss" lang="scss" scoped></style>
