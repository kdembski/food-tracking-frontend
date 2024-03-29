<script lang="ts">
import CCheckbox from "@/components/controls/checkbox/index.vue";
import CButton from "@/components/controls/buttons/button/index.vue";
import CButtonWithDropdown from "@/components/controls/buttons/button-with-dropdown/index.vue";

export default {
  name: "ShoppingItem",
  components: { CCheckbox, CButton, CButtonWithDropdown },
};
</script>

<script setup lang="ts">
import { useStore } from "vuex";
import { computed, inject, ref, Ref } from "vue";
import { ShoppingItem, SummedUpShoppingItem } from "@/types/shopping/item";
import { useWindowSize } from "@/composables/window-size";
import { DropdownOption } from "@/types/components/utils/dropdown";
import { useShoppingHelpers } from "../../composables/helpers";
import { useShoppingItemDelete } from "./composables/delete";

const { isSummedUpItem } = useShoppingHelpers();
const { isMobile } = useWindowSize();
const store = useStore();

const props = withDefaults(
  defineProps<{
    item: ShoppingItem | SummedUpShoppingItem;
    disableActions?: boolean;
    isCrossedOut?: boolean;
    isDisabled?: boolean;
  }>(),
  { disableActions: false, isCrossedOut: false, isDisabled: false }
);

const isSummedUpMode = inject<Ref<boolean>>("isSummedUpMode");
const isDisabled = computed(() => props.isDisabled || isDeletingItem.value);

const getItemName = (item: ShoppingItem | SummedUpShoppingItem) => {
  return item.ingredientName || item.customItemName;
};

const getItemKey = (item: ShoppingItem | SummedUpShoppingItem) => {
  return item.id || item.ingredientId;
};

const isCustomItem = () => {
  return !!props.item.customItemName;
};

const isSummedUpIndicatorVisible = (
  item: ShoppingItem | SummedUpShoppingItem
) => {
  if (!isSummedUpItem(item)) {
    return;
  }

  return item.items.length > 1;
};

const handleChecking = async (value: boolean) => {
  if (!isSummedUpItem(props.item)) {
    store.dispatch("shopping/item/updateIsChecked", props.item);
    store.dispatch("shopping/item/sendWebSocketMessage", {
      returnToSender: false,
    });
    return;
  }

  const promises = props.item.items.map((item) => {
    item.isChecked = value;
    return store.dispatch("shopping/item/updateIsChecked", item);
  });
  await Promise.all(promises);
  store.dispatch("shopping/item/sendWebSocketMessage", {
    returnToSender: false,
  });
};

const openMoveItemModal = () => {
  store.commit("shopping/item/setItemToMove", props.item);
};

const { isDeletingItem, handleDeleting } = useShoppingItemDelete(
  computed(() => props.item)
);

const options: Ref<DropdownOption[]> = ref([
  {
    value: "delete",
    label: "Usuń z listy",
    icon: "trash-can",
    action: handleDeleting,
  },
  {
    value: "move",
    label: "Przenieś na inną listę",
    icon: "shuffle",
    action: openMoveItemModal,
  },
]);
</script>

<template src="./template.html"></template>
<style src="./style.scss" lang="scss" scoped></style>
