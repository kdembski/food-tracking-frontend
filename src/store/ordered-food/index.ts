import ApiService from "@/services/api.service";
import {
  OrderedFoodState,
  OrderedFoodList,
  OrderedFood,
  OrderedFoodFilters,
} from "@/types/ordered-food/ordered-food";
import { ApiError } from "@/types/api";
import { GetterTree, MutationTree, ActionTree } from "vuex";
import { AxiosResponse, AxiosError } from "axios";
import { getCustomFiltersQuery, getListQuery } from "../helpers/list-query";
import { ListFilters } from "@/types/components/data-display/list";
import { Tag } from "@/types/components/utils/tags";

const state: OrderedFoodState = {
  single: null,
  isLoading: false,
  isSubmitting: false,

  list: null,
  isLoadingList: false,

  tags: null,
  isLoadingTags: false,
};

const getters: GetterTree<OrderedFoodState, any> = {
  list: (state): OrderedFoodList | null => state.list,
  isLoadingList: (state) => state.isLoadingList,

  tags: (state): Tag[] | null => state.tags,
  isLoadingTags: (state) => state.isLoadingTags,
};

const actions: ActionTree<OrderedFoodState, any> = {
  loadList({ commit, dispatch }, filters: ListFilters<OrderedFoodFilters>) {
    return new Promise<void>((resolve) => {
      commit("setIsLoadingList", true);

      ApiService.get(
        process.env.VUE_APP_SERVICE_URL + "/ordered" + getListQuery(filters)
      )
        .then((response: AxiosResponse<OrderedFoodList>) => {
          commit("setIsLoadingList", false);
          commit("setList", response.data);
          resolve();
        })
        .catch((error: AxiosError<ApiError>) => {
          commit("setIsLoadingList", false);
          dispatch("handleDefaultError", error, { root: true });
        });
    });
  },

  loadTags({ commit, dispatch }, filters: ListFilters<OrderedFoodFilters>) {
    return new Promise<string[]>((resolve) => {
      commit("setIsLoadingTags", true);

      ApiService.get(
        process.env.VUE_APP_SERVICE_URL +
          "/ordered/tags" +
          getCustomFiltersQuery(filters)
      )
        .then((response: AxiosResponse<string[]>) => {
          const tags = response.data;
          commit("setIsLoadingTags", false);
          commit("setTags", tags);
          resolve(tags);
        })
        .catch((error: AxiosError<ApiError>) => {
          commit("setIsLoadingTags", false);
          dispatch("handleDefaultError", error, { root: true });
        });
    });
  },

  load({ commit, dispatch }, itemId) {
    return new Promise<void>((resolve) => {
      commit("setIsLoading", true);

      ApiService.get(process.env.VUE_APP_SERVICE_URL + "/ordered/" + itemId)
        .then((response: AxiosResponse<OrderedFood>) => {
          commit("setIsLoading", false);
          commit("setSingle", response.data);
          resolve();
        })
        .catch((error: AxiosError<ApiError>) => {
          commit("setIsLoading", false);
          dispatch("handleDefaultError", error, { root: true });
        });
    });
  },

  create({ commit, dispatch, rootState }, item: OrderedFood) {
    return new Promise<void>((resolve) => {
      commit("setIsSubmitting", true);

      ApiService.post(process.env.VUE_APP_SERVICE_URL + "/ordered", item)
        .then(() => {
          rootState.toastNotification.success("Dodano jedzenie.");
          commit("setIsSubmitting", false);
          resolve();
        })
        .catch((error: AxiosError<ApiError>) => {
          commit("setIsSubmitting", false);
          dispatch("handleDefaultError", error, { root: true });
        });
    });
  },

  update({ commit, dispatch, rootState }, item: OrderedFood) {
    return new Promise<void>((resolve) => {
      commit("setIsSubmitting", true);

      ApiService.put(
        process.env.VUE_APP_SERVICE_URL + "/ordered/" + item.id,
        item
      )
        .then(() => {
          rootState.toastNotification.success("Zapisano jedzenie.");
          commit("setIsSubmitting", false);
          resolve();
        })
        .catch((error: AxiosError<ApiError>) => {
          commit("setIsSubmitting", false);
          dispatch("handleDefaultError", error, { root: true });
        });
    });
  },

  delete({ commit, dispatch, rootState }, itemId: number) {
    return new Promise<void>((resolve) => {
      commit("setIsSubmitting", true);

      ApiService.delete(process.env.VUE_APP_SERVICE_URL + "/ordered/" + itemId)
        .then(() => {
          rootState.toastNotification.success("Usunięto jedzenie.");
          commit("setIsSubmitting", false);
          resolve();
        })
        .catch((error: AxiosError<ApiError>) => {
          commit("setIsSubmitting", false);
          dispatch("handleDefaultError", error, { root: true });
        });
    });
  },
};

const mutations: MutationTree<OrderedFoodState> = {
  setList(state, list: OrderedFoodList) {
    state.list = list;
  },

  setIsLoadingList(state, value) {
    state.isLoadingList = value;
  },

  setTags(state, tags: Tag[]) {
    state.tags = tags;
  },

  setIsLoadingTags(state, value) {
    state.isLoadingTags = value;
  },

  setIsSubmitting(state, value) {
    state.isSubmitting = value;
  },

  setSingle(state, recipe: OrderedFood) {
    state.single = recipe;
  },

  setIsLoading(state, value) {
    state.isLoading = value;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
