import { createApp } from "vue";
import "./styles/scss/main.scss";
import App from "./App.vue";
import router from "./router";

import store from "./store";

import HighchartsVue from 'highcharts-vue'

createApp(App).use(router).use(HighchartsVue).use(store).mount("#app");
