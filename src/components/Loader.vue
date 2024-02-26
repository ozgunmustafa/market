<script setup>
import { computed } from "vue";
import { useStore } from "vuex";
const store = useStore();

const loaderIsActive = computed(() => store.getters["ConfigStore/isLoading"]);

defineProps({
  type: {
    type: String,
    default: "fullsize",
  },
  color: {
    type: String,
    default: "text-primary-400",
  },
});
</script>
<template>
  <div v-if="loaderIsActive">
    <div :class="[{ 'loading-bar': type == 'fullsize' }, color]">
      <div className="lds-ripple">
        <div></div>
        <div></div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
