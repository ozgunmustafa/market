import { convertDateTimeZone } from "../helpers/date-time";
import SaleService from "../service/SaleService";
import { api } from "../service/api";

export default {
  namespaced: true,
  state: {
    dailySales: {},
    dailySalesSkuList: {},
    dailySalesRefundRates:{}
  },
  getters: {
    dailySales: (state) => state.dailySales,
    dailySalesSkuList: (state) => state.dailySalesSkuList,
    dailySalesRefundRates: (state) => state.dailySalesRefundRates,
  },
  actions: {
    async getDailySales({ commit, dispatch, state }, data) {
      try {
        var dateArr = [];
        var fbaAmount = [];
        var fbmAmount = [];
        var profit = [];

        await dispatch("ConfigStore/setLoading", true, { root: true });

        const sales = await SaleService.getDailySales(data);

        if (sales.data.ApiStatus == false) {
          return Promise.reject("err");
        }

        await sales.data.Data.item.forEach((dailySale) => {
          dateArr.push(dailySale.date);
          fbaAmount.push(dailySale.fbaAmount);
          fbmAmount.push(dailySale.fbmAmount);
          profit.push(dailySale.profit);
        });
        await commit("SET_DAILY_SALES", {
          dates: dateArr,
          fbaAmount,
          fbmAmount,
          profit,
        });

        return true;
      } catch (err) {
        return Promise.reject(err);
      } finally {
        await dispatch("ConfigStore/setLoading", false, { root: true });
      }
    },

    async getDailySalesSkuList({ commit, dispatch, state }, data) {
      try {
        await dispatch("ConfigStore/setLoading", true, { root: true });

        const salesSkuList = await SaleService.getDailySalesSkuList(data);
        if (salesSkuList.data.ApiStatus == false) {
          return Promise.reject("err");
        }

        await commit(
          "SET_DAILY_SALES_SKU_LIST",
          salesSkuList.data.Data.item
        );
        return true;
      } catch (err) {
        return Promise.reject(err);
      } finally {
        await dispatch("ConfigStore/setLoading", false, { root: true });
      }
    },
    async getDailySalesRefundRates({ commit, dispatch, state }, data) {
      try {
        await dispatch("ConfigStore/setLoading", true, { root: true });

        const refundRates = await SaleService.getDailySalesRefundRates(data);

        if (refundRates.data.ApiStatus == false) {
          return Promise.reject("err");
        }

        await commit(
          "SET_DAILY_SALES_REFUND_RATES",
          refundRates.data.Data
        );
        return true;
      } catch (err) {
        return Promise.reject(err);
      } finally {
        await dispatch("ConfigStore/setLoading", false, { root: true });
      }
    },
  },
  

  mutations: {
    SET_DAILY_SALES(state, data) {
      state.dailySales = data;
    },
    SET_DAILY_SALES_SKU_LIST(state, data) {
      state.dailySalesSkuList = data;
    },
    SET_DAILY_SALES_REFUND_RATES(state, data) {
      state.dailySalesRefundRates = data;
    },
  },
};
