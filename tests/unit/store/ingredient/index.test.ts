import flushPromises from "flush-promises";
import { createStore } from "vuex";

let mockAxiosGet = jest.fn();
let mockAxiosPost = jest.fn();
let mockAxiosPut = jest.fn();
let mockAxiosDelete = jest.fn();
let mockAxiosPatch = jest.fn();

import module from "@/store/ingredient/index";
import {
  IngredientOption,
  IngredientsList,
} from "@/types/ingredients/ingredient";
jest.mock("@/services/api.service", () => ({
  get: mockAxiosGet,
  post: mockAxiosPost,
  put: mockAxiosPut,
  delete: mockAxiosDelete,
  patch: mockAxiosPatch,
}));

describe("Ingredient Store Module", () => {
  let store: any;
  let actions: any;
  let toastNotification: any;
  let list: IngredientsList;
  let options: IngredientOption[];
  const listFilters = {
    currentPage: 1,
    pageSize: 10,
    sortAttribute: "attr",
    sortDirection: "dir",
    custom: {
      searchPhrase: "test",
      tags: "tag",
    },
  };

  beforeEach(async () => {
    toastNotification = {
      success: jest.fn(),
      error: jest.fn(),
    };

    actions = {
      handleDefaultError: jest.fn(),
      handleComplexError: jest.fn(),
    };

    list = {
      data: [
        {
          id: 1,
          name: "name 1",
          categoryId: 1,
          categoryName: "category 1",
          unitNames: ["unit 1", "unit 2"],
        },
        {
          id: 2,
          name: "name 2",
          categoryId: 2,
          categoryName: "category 2",
          unitNames: ["unit 1", "unit 2"],
        },
      ],
      pagination: {
        currentPage: 1,
        totalPages: 10,
        firstRecord: 1,
        lastRecord: 20,
        totalRecords: 100,
      },
    };

    options = [
      {
        id: 1,
        name: "name 1",
      },
      {
        id: 2,
        name: "name 2",
      },
    ];

    store = createStore({
      state: {
        toastNotification,
      },
      actions,
      modules: {
        module,
      },
    });
  });

  afterEach(() => {
    store = null;
  });

  it("Should set list to state on successful loadList action dispatch", async () => {
    mockAxiosGet.mockImplementation(() => Promise.resolve({ data: list }));
    store.dispatch("module/loadList", listFilters);
    expect(store.getters["module/isLoadingList"]).toBe(true);
    await flushPromises();

    expect(mockAxiosGet).toHaveBeenCalledWith(
      "service/ingredients?page=1&size=10&sortAttribute=attr&sortDirection=dir&searchPhrase=test&tags=tag"
    );
    expect(store.getters["module/list"]).toEqual(list);
    expect(store.getters["module/isLoadingList"]).toBe(false);
  });

  it("Should show error notification on failed loadList action dispatch", async () => {
    mockAxiosGet.mockImplementation(() => Promise.reject("error"));
    store.dispatch("module/loadList", listFilters);
    await flushPromises();
    expect(actions.handleDefaultError).toHaveBeenCalledTimes(1);
  });

  it("Should set options to state on successful loadOptions action dispatch", async () => {
    mockAxiosGet.mockImplementation(() => Promise.resolve({ data: options }));
    store.dispatch("module/loadOptions");
    expect(store.state.module.isLoadingOptions).toBe(true);
    await flushPromises();

    expect(mockAxiosGet).toHaveBeenCalledWith("service/ingredients/options");
    expect(store.state.module.options).toEqual(options);
    expect(store.state.module.isLoadingOptions).toBe(false);
    expect(store.getters["module/options"]).toEqual([
      {
        value: 1,
        label: "name 1",
      },
      {
        value: 2,
        label: "name 2",
      },
    ]);
  });

  it("Should show error notification on failed loadOptions action dispatch", async () => {
    mockAxiosGet.mockImplementation(() => Promise.reject("error"));
    store.dispatch("module/loadOptions");
    await flushPromises();
    expect(actions.handleDefaultError).toHaveBeenCalledTimes(1);
  });

  it("Should set single to state on successful load action dispatch", async () => {
    mockAxiosGet.mockImplementation(() => Promise.resolve({ data: {} }));
    store.dispatch("module/load", 1);
    expect(store.state.module.isLoading).toBe(true);
    await flushPromises();

    expect(mockAxiosGet).toHaveBeenCalledWith("service/ingredients/1");
    expect(store.state.module.single).toEqual({ units: [] });
    expect(store.state.module.isLoading).toBe(false);
  });

  it("Should show error notification on failed load action dispatch", async () => {
    mockAxiosGet.mockImplementation(() => Promise.reject("error"));
    store.dispatch("module/load", 1);
    await flushPromises();
    expect(actions.handleDefaultError).toHaveBeenCalledTimes(1);
  });

  it("Should show success notification on successful create action dispatch", async () => {
    const item = { id: 1 };
    mockAxiosPost.mockImplementation(() => Promise.resolve());
    store.dispatch("module/create", item);
    expect(store.state.module.isSubmitting).toBe(true);
    await flushPromises();

    expect(mockAxiosPost).toHaveBeenCalledWith("service/ingredients", item);
    expect(toastNotification.success).toHaveBeenCalledTimes(1);
    expect(store.state.module.isSubmitting).toBe(false);
  });

  it("Should show error notification on failed create action dispatch", async () => {
    const item = { id: 1 };
    mockAxiosPost.mockImplementation(() => Promise.reject("error"));
    store.dispatch("module/create", item);
    await flushPromises();
    expect(actions.handleComplexError).toHaveBeenCalledTimes(1);
  });

  it("Should show success notification on successful update action dispatch", async () => {
    const item = { id: 1 };
    mockAxiosPut.mockImplementation(() => Promise.resolve());
    store.dispatch("module/update", item);
    expect(store.state.module.isSubmitting).toBe(true);
    await flushPromises();

    expect(mockAxiosPut).toHaveBeenCalledWith("service/ingredients/1", item);
    expect(toastNotification.success).toHaveBeenCalledTimes(1);
    expect(store.state.module.isSubmitting).toBe(false);
  });

  it("Should show error notification on failed update action dispatch", async () => {
    const item = { id: 1 };
    mockAxiosPut.mockImplementation(() => Promise.reject("error"));
    store.dispatch("module/update", item);
    await flushPromises();
    expect(actions.handleComplexError).toHaveBeenCalledTimes(1);
  });

  it("Should show success notification on successful delete action dispatch", async () => {
    mockAxiosDelete.mockImplementation(() => Promise.resolve());
    store.dispatch("module/delete", 1);
    expect(store.state.module.isSubmitting).toBe(true);
    await flushPromises();

    expect(mockAxiosDelete).toHaveBeenCalledWith("service/ingredients/1");
    expect(toastNotification.success).toHaveBeenCalledTimes(1);
    expect(store.state.module.isSubmitting).toBe(false);
  });

  it("Should show error notification on failed delete action dispatch", async () => {
    mockAxiosDelete.mockImplementation(() => Promise.reject("error"));
    store.dispatch("module/delete", 1);
    await flushPromises();
    expect(actions.handleDefaultError).toHaveBeenCalledTimes(1);
  });
});
