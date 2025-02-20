<script setup>
// import DangNhap from "./components/DangNhap.vue";
// import DangKy from "./components/DangKy.vue";
// import ThanhToan from "./components/ThanhToan.vue";
// import TrangChu from "./components/TrangChu.vue";
// import QuenMatKhau from "./components/QuenMatKhau.vue";
import { RouterView } from "vue-router";
</script>
<template>
  <div>
    <!-- <DangNhap></DangNhap> -->
    <!-- <ThanhToan></ThanhToan> -->
    <!-- <TrangChu></TrangChu> -->
    <router-view :key="$route.fullPath"></router-view>
  </div>
</template>

<style scoped></style>
