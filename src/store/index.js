import { createStore } from "vuex";
import AuthStore from "./AuthStore";
import SaleStore from "./SaleStore";
import ConfigStore from "./ConfigStore";

export default createStore({
  modules: {
    AuthStore,
    SaleStore,
    ConfigStore,
  },
});
