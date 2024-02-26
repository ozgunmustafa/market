<script setup>
import { computed } from "vue";
import { useStore } from "vuex";
const store = useStore();

const user = computed(() => store.getters["AuthStore/user"]);
</script>
<template>
  <div class="main-header">
    <div class="container">
      <div class="flex justify-content-between align-items-center">
        <span class="fw-900">LOGO</span>
        <small>{{ user.firstName + " " + user.lastName }}</small>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
