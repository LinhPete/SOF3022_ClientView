import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("../components/Home/Home.vue"),
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../components/User/DangNhap.vue"),
    },
    {
      path: "/register",
      name: "register",
      component: () => import("../components/User/DangKy.vue"),
    },
    {
      path: "/user-info",
      name: "userInfo",
      component: () => import("../components/User/UserInfo.vue"),
    },
    {
      path: "/forgot-password",
      name: "forgotpassword",
      component: () => import("../components/User/QuenMatKhau.vue"),
    },
    {
      path: "/card",
      name: "card",
      component: () => import("../components/Cart/Cart.vue"),
    },
    {
      path: "/order",
      name: "order",
      component: () => import("../components/Order/OrderForm.vue"),
    },
    {
      path: "/outerWear",
      name: "PuterWear",
      component: () => import("../components/Category/CategoryDetail.vue"),
    },
    {
      path: "/category/:id",
      name: "Category Detail",
      component: () => import("../components/Category/CategoryDetail.vue"),
      props: true, // Giúp truyền param 'id' vào component dưới dạng prop
    },
    {
      path: "/product/:id",
      name: "Product Detail",
      component: () => import("../components/Product/ProductDetail.vue"),
      props: true,
    },
    {
      path: "/order/list",
      name: "OrderList",
      component: () => import("../components/Order/OrderList.vue"),
      props: true,
    },
  ],
});

export default router;
