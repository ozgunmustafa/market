export default {
  namespaced: true,
  state: {
    isLoading: false,
  },
  getters: {
    isLoading: (state) => state.isLoading,
  },
  actions: {
    setLoading({ commit }, status) {
      commit("SET_LOADING", status);
    },
  },
  mutations: {
    SET_LOADING(state, status) {
      state.isLoading = status;
    },
  },
};
