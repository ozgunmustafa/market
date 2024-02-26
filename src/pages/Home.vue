<script setup>
import { computed, ref, reactive, onMounted, watch } from "vue";
import { useStore } from "vuex";
import Header from "../components/Header.vue";
import Loader from "../components/Loader.vue";

import { useRouter } from "vue-router";
import { convertDateTimeZone } from "../helpers/date-time";
const router = useRouter();

const store = useStore();

const dayPeriod = ref(14);
const comprassionDates = ref([]);

const user = computed(() => store.state.AuthStore.user);
const dailySales = computed(() => store.state.SaleStore.dailySales);
const pagination = ref({
  pageSize: 10,
  pageNumber: 1,
});

onMounted(async () => {
  await store
    .dispatch("AuthStore/getUserInformationByMail")
    .then(() => {
      getDailySales();
    })
    .catch((err) => {
      router.push({ name: "login" });
    });
});

const getDailySales = async () => {
  await store.dispatch("SaleStore/getDailySales", {
    marketplace: user.value.store[0].marketplaceName,
    sellerId: user.value.store[0].storeId,
    requestStatus: 0,
    day: dayPeriod.value,
    excludeYoYData: true,
  });
};

const skuListType = () => {
  let xyx = {
    marketplace: user.value.store[0].marketplaceName,
    sellerId: user.value.store[0].storeId,
    pageSize: pagination.value.pageSize,
    pageNumber: pagination.value.pageNumber,
  };
  if (comprassionDates.value.length < 2) {
    return {
      ...xyx,
      salesDate: comprassionDates.value[0],
      isDaysCompare: 0,
    };
  } else {
    return {
      ...xyx,
      salesDate: comprassionDates.value[0],
      salesDate2: comprassionDates.value[1],
      isDaysCompare: 1,
    };
  }
};

const getDailySalesRefundRates = async () => {
  await store.dispatch("SaleStore/getDailySalesRefundRates", {
    marketplace: user.value.store[0].marketplaceName,
    sellerId: user.value.store[0].storeId,
    skuList: store.state.SaleStore.dailySalesSkuList?.skuList,
    requestedDay: 0,
  });
};
const getDailySalesSkuList = async () => {
  await store
    .dispatch("SaleStore/getDailySalesSkuList", skuListType())
    .then(() => {
      getDailySalesRefundRates();
    });
};

watch(
  () => dayPeriod.value,
  (newValue, oldValue) => {
    comprassionDates.value = [];
    getDailySales();
  },
  { deep: true }
);
watch(
  () => comprassionDates,
  (newValue, oldValue) => {
    getDailySalesSkuList();
  },
  { deep: true }
);
watch(
  () => pagination,
  (newValue, oldValue) => {
    getDailySalesSkuList();
  },
  { deep: true }
);
const chartOptions = computed(() => {
  return {
    chart: {
      type: "column",
      events: {
        click: function (e) {
          let col = this.series[0].searchPoint(e, true);
          let pnt = this.series[1].searchPoint(e, true);

          if (comprassionDates.value.includes(col.category)) {
            let indexof = comprassionDates.value.indexOf(col.category);

            comprassionDates.value.splice(indexof, 1);

            pnt.update({
              color: "#8A69E9",
            });
          } else if (
            !comprassionDates.value.includes(col.category) &&
            comprassionDates.value.length < 2
          ) {
            comprassionDates.value.push(col.category);
            pnt.update({
              color: "#d96d6d",
            });
          }
        },
      },
    },
    title: {
      text: null,
    },
    xAxis: {
      type: "category",
      categories: dailySales.value.dates,
      labels: {
        formatter: function () {
          return convertDateTimeZone(this.value);
        },
        style: {
          cursor: "pointer",
        },
      },
      crosshair: {
        enabled: true,
        color: "#f4f4f4",
      },
    },
    yAxis: {
      min: 0,
      title: {
        text: "Amount($)",
      },
    },
    tooltip: {
      pointFormat:
        '<span style="color:{series.color}">{series.name}</span>: <b>${point.y}</b> ({point.percentage:.0f}%)<br/>',
      shared: true,
    },

    plotOptions: {
      series: {
        stacking: "normal",

        states: {
          hover: {
            brightness: 0.1,
            borderColor: "#bbb",
            borderWidth: 1,
          },
        },
      },

      column: {
        stacking: "normal",
        dataLabels: {
          enabled: true,
          format: "${point.y}",
          rotation: "-90",
        },
        events: {
          click: function (event) {
            event.point.series[1].update({
              color: "red",
            });
          },
        },
      },
    },
    series: [
      {
        name: "Profit",
        data: dailySales.value.profit,
        color: "#09F8C7",
      },
      {
        name: "FBA Sales",
        data: dailySales.value.fbaAmount,
        color: "#8A69E9",
       
      },
      {
        name: "FBM Sales",
        data: dailySales.value.fbmAmount,
        color: "#7B00EB",
      },
    ],
  };
});
</script>

<template>
  <div>
    <Loader type="fullsize" color="text-blue"></Loader>
    <Header></Header>
    <main>
      <div class="container pt-2 pb-2">
        <div
          class="shadow-sm rounded-3 p-5 flex justify-content-between align-items-center mb-6"
        >
          {{ store.state.SaleStore.getDailySalesRefundRates }}
          <h5 class="fw-700">Daily Sales</h5>
          <select class="form-select" v-model="dayPeriod">
            <option value="60">Last 60 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="14">Last 14 Days</option>
            <option value="7">Last 7 Days</option>
          </select>
        </div>

        <highcharts :options="chartOptions" class="mb-6"></highcharts>

        <div
          class="shadow-sm rounded-3 p-6 mb-6"
          v-if="store.state.SaleStore.dailySalesSkuList?.skuList?.length > 0"
        >
          <div
            class="flex justify-content-between align-items-center bg-gray p-4"
          >
            <input type="text" class="form-control form-control_search" />
            <select class="form-select" v-model="pagination.pageNumber">
              <option value="3">Page 3</option>
              <option value="2">Page 2</option>
              <option value="1">Page 1</option>
            </select>
          </div>
          <table>
            <tr>
              <th>SKU</th>
              <th>Product Name</th>
              <th>
                {{
                  convertDateTimeZone(
                    store.state.SaleStore.dailySalesSkuList?.selectedDate
                  )
                }}
                <br />
                Sales / Units / Avg. Selling Price
              </th>
              <th v-if="store.state.SaleStore.dailySalesSkuList?.selectedDate2">
                {{
                  convertDateTimeZone(
                    store.state.SaleStore.dailySalesSkuList?.selectedDate2
                  )
                }}
                <br />
                Sales / Units / Avg. Selling Price
              </th>
              <th>
                SKU Refund Rate <br />
                <small>Last {{ dayPeriod }} days</small>
              </th>
            </tr>
            <tr
              v-for="(item, index) of store.state.SaleStore.dailySalesSkuList
                .skuList"
            >
              <td>{{ item.sku }}</td>
              <td>{{ item.productName }}</td>
              <td>
                {{
                  "$" +
                  store.state.SaleStore.dailySalesSkuList?.totalSale.toFixed(
                    2
                  ) +
                  " / " +
                  item.qty +
                  " / " +
                  item.amount
                }}
              </td>

              <td v-if="store.state.SaleStore.dailySalesSkuList?.selectedDate2">
                {{
                  "$" +
                  store.state.SaleStore.dailySalesSkuList?.totalSale2.toFixed(
                    2
                  ) +
                  " / " +
                  item.qty2 +
                  " / " +
                  item.amount2
                }}
              </td>
              <td>
                {{
                  store.state.SaleStore.dailySalesRefundRates[i]?.refundRate ==
                  0
                    ? "0"
                    : store.state.SaleStore.dailySalesRefundRates[index]
                        ?.refundRate
                }}
              </td>
            </tr>
          </table>
        </div>
      </div>

    </main>
  </div>
</template>

<style scoped></style>
