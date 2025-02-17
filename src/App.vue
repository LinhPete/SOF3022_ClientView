<script setup>
// import DangNhap from "./components/DangNhap.vue";
// import DangKy from "./components/DangKy.vue";
// import ThanhToan from "./components/ThanhToan.vue";
// import TrangChu from "./components/TrangChu.vue";
// import QuenMatKhau from "./components/QuenMatKhau.vue";
import { RouterView } from "vue-router";
import Header from "./components/menu-link/header.vue";
import Footer from "./components/menu-link/Footer.vue";
</script>
<template>
  <div>
    <Header></Header>
    <!-- <DangNhap></DangNhap> -->
    <!-- <ThanhToan></ThanhToan> -->
    <!-- <TrangChu></TrangChu> -->
    <RouterView />
    <Footer></Footer>
  </div>
</template>

<style scoped></style>
