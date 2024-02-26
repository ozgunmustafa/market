import { api } from "./api";

class SaleService {
  async getDailySales(data) {
    return await api.post("/data/daily-sales-overview/", data);
  }
  async getDailySalesSkuList(data) {
    return await api.post("/data/daily-sales-sku-list/", data);
  }
  async getDailySalesRefundRates(data) {
    return await api.post("/data/get-sku-refund-rate/", data);
  }
}

export default new SaleService();
