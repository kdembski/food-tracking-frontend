<script lang="ts">
import CListWithFilters from "@/components/data-display/listings/list-with-filters/index.vue";
import OrderedFoodListItemHeader from "./list-item/header/index.vue";
import OrderedFoodListItemBody from "./list-item/body/index.vue";
import CButton from "@/components/controls/buttons/button/index.vue";
import EditModal from "../edit-modal/index.vue";

export default {
  name: "OrderedFoodListView",
  components: {
    CListWithFilters,
    CButton,
    OrderedFoodListItemHeader,
    OrderedFoodListItemBody,
    EditModal,
  },
};
</script>

<script setup lang="ts">
import { ref, Ref } from "vue";
import { OrderedFoodFilters } from "@/types/ordered-food/ordered-food";
import { ListFilters } from "@/types/components/data-display/list";

const orderedFoodListDefaultFilters: ListFilters<OrderedFoodFilters> = {
  currentPage: 1,
  pageSize: 10,
  sortAttribute: "foodName",
  sortDirection: "asc",
  custom: {
    searchPhrase: "",
    tags: "",
  },
};

const orderedFoodListSortOptions = ref([
  {
    value: {
      sortAttribute: "foodName",
      sortDirection: "asc",
    },
    label: "Nazwa jedzenia - rosnąco",
    icon: "arrow-down-a-z",
  },
  {
    value: {
      sortAttribute: "foodName",
      sortDirection: "desc",
    },
    label: "Nazwa jedzenia - malejąco",
    icon: "arrow-down-z-a",
  },
  {
    value: {
      sortAttribute: "placeName",
      sortDirection: "asc",
    },
    label: "Nazwa miejsca - rosnąco",
    icon: "arrow-down-a-z",
  },
  {
    value: {
      sortAttribute: "placeName",
      sortDirection: "desc",
    },
    label: "Nazwa miejsca - malejąco",
    icon: "arrow-down-z-a",
  },
]);

const isEditModalOpen = ref(false);
const editedOrderedFoodId: Ref<number | undefined> = ref();

const onAddButtonClick = () => {
  editedOrderedFoodId.value = undefined;
  isEditModalOpen.value = true;
};

const editOrderedFood = (id: number) => {
  editedOrderedFoodId.value = id;
  isEditModalOpen.value = true;
};
</script>

<template src="./template.html"></template>
<style src="./style.scss" lang="scss" scoped></style>
