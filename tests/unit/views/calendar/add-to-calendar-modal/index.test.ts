import flushPromises from "flush-promises";
import { mount } from "@vue/test-utils";
import { createStore } from "vuex";
import AddToCalendarModal from "@/views/calendar/add-to-calendar-modal/index.vue";
import CDatePicker from "@/components/controls/date-picker/index.vue";

let toastSuccess: any;
let toastError: any;
jest.mock("@/composables/toast-notification", () => ({
  useToastNotification: () => ({
    success: toastSuccess,
    error: toastError,
  }),
}));

jest.mock("vue-router", () => ({
  useRouter: () => ({
    push: () => false,
  }),
}));

describe("Add To Calendar Modal Component", () => {
  let wrapper: any;
  let store: any;
  let addedRecipe: any;
  let addedOrderedFood: any;
  let calendarActions: any;
  let calendarState: any;
  let calendarMutations: any;

  beforeEach(async () => {
    calendarActions = {
      createItem: jest.fn(),
    };

    addedRecipe = {
      id: 1,
      cookedDate: new Date(2000, 1, 1),
      cookedDatesInCurrentMonth: [],
    };

    addedOrderedFood = {
      id: 2,
      orderDate: new Date(2000, 1, 1),
      orderDatesInCurrentMonth: [],
    };

    calendarState = {
      isAddToCalendarModalOpen: true,
    };

    calendarMutations = {
      setIsAddToCalendarModalOpen: jest
        .fn()
        .mockImplementation(
          (state, value) => (state.isAddToCalendarModalOpen = value)
        ),
      setAddedRecipe: jest
        .fn()
        .mockImplementation((state, value) => (state.addedRecipe = value)),
      setAddedOrderedFood: jest
        .fn()
        .mockImplementation((state, value) => (state.addedOrderedFood = value)),
    };

    store = createStore({
      mutations: {
        unshiftToastNotification: jest.fn(),
        popToastNotification: jest.fn(),
      },
      modules: {
        calendar: {
          state: calendarState,
          actions: calendarActions,
          mutations: calendarMutations,
          namespaced: true,
        },
        member: {
          state: {
            members: [
              {
                id: 1,
                name: "test1",
              },
              {
                id: 2,
                name: "test2",
              },
            ],
          },
        },
      },
    });

    global.settings.provide = {
      store,
    };

    toastSuccess = jest.fn();
    toastError = jest.fn();

    wrapper = mount(AddToCalendarModal, {
      global: global.settings,
    });
  });

  it("isSelectedDatesEmpty should return true if selected dates length is 0", async () => {
    expect(wrapper.vm.isSelectedDatesEmpty()).toBe(true);
    wrapper.vm.selectedDates = [new Date()];
    expect(wrapper.vm.isSelectedDatesEmpty()).toBe(false);
  });

  it("Should clear selectedDates after isOpen change", async () => {
    wrapper.vm.selectedDates = [new Date()];
    await store.commit("calendar/setIsAddToCalendarModalOpen", false);
    expect(wrapper.vm.selectedDates).toEqual([]);
  });

  it("Should set members based on selectedDates when selectedDates change", async () => {
    const datePicker = wrapper.getComponent(CDatePicker);
    const firstDateBtn = datePicker.find("input#date-0");
    expect(wrapper.vm.members).toEqual([]);

    await firstDateBtn.setChecked();
    expect(wrapper.vm.members).toEqual([[1, 2]]);
  });

  it("Should trigger createItem with provided recipe and NOT change cooked date", async () => {
    await store.commit("calendar/setAddedRecipe", addedRecipe);
    wrapper.vm.selectedDates = [new Date(2000, 0, 1)];
    wrapper.vm.members = [[1, 2]];
    wrapper.vm.addSelectedDatesToCalendar();
    wrapper.vm.isAddingToCalendar = true;

    await flushPromises();
    expect(wrapper.vm.isAddingToCalendar).toBe(false);
    expect(store.state.calendar.isAddToCalendarModalOpen).toBe(false);
    expect(calendarActions.createItem).toHaveBeenLastCalledWith(
      expect.any(Object),
      {
        date: new Date(2000, 0, 1),
        recipeId: 1,
        orderedFoodId: undefined,
        members: [1, 2],
      }
    );
    expect(addedRecipe.cookedDate).toEqual(new Date(2000, 1, 1));
  });

  it("Should trigger createItem with provided recipe and change cooked date", async () => {
    await store.commit("calendar/setAddedRecipe", addedRecipe);
    wrapper.vm.selectedDates = [new Date(2000, 1, 3), new Date(2000, 1, 2)];
    wrapper.vm.members = [[1, 2], [1]];
    wrapper.vm.addSelectedDatesToCalendar();

    await flushPromises();
    expect(calendarActions.createItem).toHaveBeenLastCalledWith(
      expect.any(Object),
      {
        date: new Date(2000, 1, 2),
        recipeId: 1,
        orderedFoodId: undefined,
        members: [1],
      }
    );
    expect(addedRecipe.cookedDate).toEqual(new Date(2000, 1, 3));
  });

  it("Should trigger createItem with provided ordered food and change order date", async () => {
    await store.commit("calendar/setAddedOrderedFood", addedOrderedFood);
    wrapper.vm.selectedDates = [new Date(2000, 1, 2)];
    wrapper.vm.members = [[1, 2]];
    wrapper.vm.addSelectedDatesToCalendar();

    await flushPromises();
    expect(calendarActions.createItem).toHaveBeenLastCalledWith(
      expect.any(Object),
      {
        date: new Date(2000, 1, 2),
        recipeId: undefined,
        orderedFoodId: 2,
        members: [1, 2],
      }
    );
    expect(addedOrderedFood.orderDate).toEqual(new Date(2000, 1, 2));
    expect(toastSuccess).toHaveBeenCalledWith(
      "Dodano do kalendarza.",
      expect.any(Function),
      "Otwórz Kalendarz"
    );
  });

  it("Should show error notification if createItem actions fails", async () => {
    calendarActions.createItem.mockImplementation(() => Promise.reject());
    wrapper.vm.selectedDates = [new Date(2000, 1, 2)];
    wrapper.vm.addSelectedDatesToCalendar();
    await flushPromises();

    expect(toastError).toHaveBeenCalledTimes(1);
    expect(toastError).toHaveBeenCalledWith(
      "Dodawanie do kalendarza nie powiodło się."
    );
  });
});
