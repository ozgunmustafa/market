import { createRouter, createWebHistory } from "vue-router";
const routes = [
  { path: "/", name: "home", component: () => import("../pages/Home.vue") },
  {
    path: "/login",
    name: "login",
    component: () => import("../pages/Login.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: () => import("../pages/NotFound.vue"),
  },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const publicPages = ["/login"];
  const isPublicPage = publicPages.includes(to.path);

  if (!isPublicPage) {
    if (localStorage.getItem("AccessToken")) {
      next();
    } else {
      next({ name: "login" });
    }
  } else next();
});

export default router;
