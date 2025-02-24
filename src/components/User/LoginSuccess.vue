
<template>
    <div class="flex items-center justify-center h-screen">
        <div class="text-center">
            <h2 class="text-xl font-semibold">Đang xử lý đăng nhập...</h2>
            <p v-if="loading">Vui lòng chờ...</p>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import axios from "axios";

import { useUserStore } from "../../stores/userStore";
import { useRouter } from "vue-router";
const userStore = useUserStore();
const loading = ref(true);
const route = useRouter()

const sendCodeToBackend = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");

  if (!code) {
    console.error("Không tìm thấy mã code từ Google");
    return;
  }

  try {
    const response = await axios.post("http://localhost:8080/store/auth/callback", {
      code: code,
    });

    console.log("User Info:", response.data);
    userStore.setToken(response.data.jwt_token);
    const isLogged = await userStore.fetchUserInfo();
    if (isLogged) {
      route.push("/")
    } else {
      route.push("/login")
    }
  } catch (error) {
    console.error("Lỗi gửi code:", error);
  }
};

onMounted(() => {
  sendCodeToBackend();
});
</script>


<style scoped>

</style>
