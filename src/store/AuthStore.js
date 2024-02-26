import AuthService from "../service/AuthService";
import { api } from "../service/api";

export default {
  namespaced: true,
  state: {
    AccessToken: localStorage.getItem("AccessToken"),
    user: {},
    email: "",
  },
  getters: {
    user: (state) => state.user,
  },
  actions: {
    async login({ commit, dispatch }, data) {
      try {
        await dispatch("ConfigStore/setLoading", true, { root: true });

        const user = await AuthService.login(data);
        api.defaults.headers.Authorization = `Bearer ${user.data.Data.AccessToken}`;

        await commit("SET_TOKEN", user.data.Data.AccessToken);
        await commit("SET_EMAIL", data.Email);
        localStorage.setItem("AccessToken", user.data.Data.AccessToken);
        return user.data.Data;
      } catch (err) {
        return Promise.reject(err);
      } finally {
        await dispatch("ConfigStore/setLoading", false, { root: true });
      }
    },
    async getUserInformationByMail({ commit, dispatch, state }) {
      try {
        await dispatch("ConfigStore/setLoading", true, { root: true });

        const userInformations = await AuthService.getUserInformationByMail({
          email: state.email,
        });
        if (userInformations.data.ApiStatus == false) {
          return Promise.reject("err");
        }

        await commit("SET_USER", userInformations.data.Data.user);

        return true;
      } catch (err) {
        return Promise.reject(err);
      } finally {
        await dispatch("ConfigStore/setLoading", false, { root: true });
      }
    },
  },
  mutations: {
    SET_USER(state, data) {
      state.user = data;
    },
    SET_EMAIL(state, email) {
      state.email = email;
    },
    SET_TOKEN(state, data) {
      state.AccessToken = data;
    },
  },
};
