<script setup>
import { mapState } from "vuex";
import { computed, ref } from "vue";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
const router = useRouter();

const store = useStore();

const isLoading = ref(false);

import { useForm } from "vee-validate";
import * as yup from "yup";
import Loader from "../components/Loader.vue";

const schema = yup.object({
  Email: yup
    .string()
    .required("Email alanı gereklidir.")
    .email("Email formatında giriş yapınız"),
  Password: yup.string().required("Şifre alanı gereklidir."),
});

const { values, errors, handleSubmit, defineInputBinds } = useForm({
  validationSchema: schema,
  initialValues: {
    Email: "homework@eva.guru",
    Password: "Homeworkeva1**",
  },
});

const email = defineInputBinds("Email", { validateOnValueUpdate: true });
const password = defineInputBinds("Password");

const onSubmit = handleSubmit(async (values) => {

  let loginData = {
    ...values,
    GrantType: "password",
    Scope: "amazon_data",
    ClientId: "C0001",
    ClientSecret: "SECRET0001",
    RedirectUri: "https://api.eva.guru",
  };

  store
    .dispatch("AuthStore/login", loginData)
    .then((res) => {
      router.push({ name: "home" });
    })
    .finally(() => {
    });
});

// const postIdFromModule1 = computed(() => store.getters["AuthStore/user"]);
</script>

<template>
  <div class="bg-pattern">
    <Loader type="fullsize" color="text-blue"></Loader>
    <div class="form-wrapper flex align-items-center justify-content-center">
      <div
        class="login-box p-10 bg-white flex justify-content-center flex-column"
      >
        <h2 class="mb-2 text-center fw-700">Login</h2>
        <p class="text-muted text-center mb-5">Please login with credentials</p>
        <form @submit="onSubmit" class="flex flex-column">
          <input
            type="email"
            inputmode="email"
            class="form-control"
            placeholder="Email"
            v-bind="email"
          />
          <small class="block text-red mt-1">{{ errors.email }}</small>

          <input
            type="password"
            class="form-control mt-2"
            placeholder="Password"
            v-bind="password"
          />
          <small class="block text-red mt-1">{{ errors.password }}</small>

          <button type="submit" class="btn btn-primary mt-3">Submit</button>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.form-wrapper {
  width: 100%;
  height: 100vh;
  padding: 3rem 1rem;

  background-image: radial-gradient(
    circle at 73% 67%,
    #a3c6f7ba 21%,
    #e8e8e85c 62%
  );
}
.login-box {
  width: 100%;
  max-width: 450px;
  border-radius: calc(var(--space) * 3);
}
</style>
