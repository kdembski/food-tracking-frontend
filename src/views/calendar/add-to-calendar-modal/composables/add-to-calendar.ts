import { useToastNotification } from "@/composables/toast-notification";
import { useStore } from "vuex";
import { ref, Ref, ComputedRef } from "vue";
import { Recipe } from "@/types/recipes/recipe";
import { OrderedFood } from "@/types/ordered-food/ordered-food";
import { isAfter } from "date-fns";
import { useRouter } from "vue-router";

export function useAddToCalendar(
  selectedDates: Ref<Date[]>,
  members: Ref<number[][]>,
  isOpen: Ref<boolean>,
  addedRecipe: ComputedRef<Recipe | undefined>,
  addedOrderedFood: ComputedRef<OrderedFood | undefined>
) {
  const isAddingToCalendar = ref(false);
  const store = useStore();
  const toastNotification = useToastNotification();
  const router = useRouter();

  const addCalendarItem = (
    date: Date,
    recipeId: number | undefined,
    orderedFoodId: number | undefined,
    members: number[]
  ) => {
    return store.dispatch("calendar/createItem", {
      date,
      recipeId,
      orderedFoodId,
      members,
    });
  };

  const addSelectedDatesToCalendar = () => {
    isAddingToCalendar.value = true;

    const promises = selectedDates.value.map((date, index) => {
      return addCalendarItem(
        date,
        addedRecipe.value?.id,
        addedOrderedFood.value?.id,
        members.value[index]
      );
    });

    Promise.all(promises)
      .then(() => {
        isAddingToCalendar.value = false;
        isOpen.value = false;
        updateAddedItemDates();

        const pushRouterToCalendar = () => router.push("/calendar");
        toastNotification.success(
          "Dodano do kalendarza.",
          pushRouterToCalendar,
          "Otwórz Kalendarz"
        );
      })
      .catch(() => {
        toastNotification.error("Dodawanie do kalendarza nie powiodło się.");
      });
  };

  const updateAddedItemDates = () => {
    updateAddedRecipeDates();
    updateAddedOrderedFoodDates();
  };

  const updateAddedRecipeDates = () => {
    if (!addedRecipe.value) {
      return;
    }

    const lastSelectedDate = getLastSelectedDate();

    if (
      !addedRecipe.value.cookedDate ||
      isAfter(lastSelectedDate, addedRecipe.value.cookedDate)
    ) {
      addedRecipe.value.cookedDate = lastSelectedDate;
    }
  };

  const updateAddedOrderedFoodDates = () => {
    if (!addedOrderedFood.value) {
      return;
    }

    const lastSelectedDate = getLastSelectedDate();
    if (
      !addedOrderedFood.value.orderDate ||
      isAfter(lastSelectedDate, addedOrderedFood.value.orderDate)
    ) {
      addedOrderedFood.value.orderDate = lastSelectedDate;
    }
  };

  const getLastSelectedDate = () => {
    return selectedDates.value[selectedDates.value.length - 1];
  };

  return {
    addSelectedDatesToCalendar,
    isAddingToCalendar,
  };
}
