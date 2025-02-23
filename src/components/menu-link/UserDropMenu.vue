<template>
  <div class="relative">
    <!-- ICON USER -->
    <div @click="toggleDropdown" class="user-icon">
      <i class="fa-regular fa-user fa-xl"></i>
      <span v-if="userStore.userInfo" style="padding-left: 15px">
        {{ userStore.userInfo.fullName }}
      </span>
    </div>

    <!-- DROPDOWN MENU -->
    <div v-if="isOpen" class="dropdown">
      <p v-if="!userStore.userInfo">
        <router-link to="/register" class="dropdown-item">Đăng ký</router-link>
      </p>
      <p v-if="!userStore.userInfo">
        <router-link to="/login" class="dropdown-item">Đăng nhập</router-link>
      </p>
      <p v-if="userStore.userInfo">
        <router-link to="/user-info" class="dropdown-item"
          >Thông tin cá nhân</router-link
        >
      </p>
      <p v-if="userStore.userInfo">
        <router-link to="/order/list" class="dropdown-item"
          >Thông tin đơn hàng</router-link
        >
      </p>
      <p v-if="userStore.userInfo">
        <button @click="logout" class="dropdown-item">Đăng xuất</button>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useUserStore } from "../../stores/userStore";
import { useRouter } from "vue-router";

const router = useRouter();
const userStore = useUserStore();
const isOpen = ref(false);

// Toggle dropdown menu
const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};
// Đăng xuất người dùng và chuyển hướng về trang đăng nhập
const logout = () => {
  isOpen.value = false; // Đóng dropdown
  userStore.logout(); // Xóa giỏ hàng khi đăng xuất
  setTimeout(() => {
    router.push("/login");
  }, 1500);
};

// Lấy thông tin người dùng khi component được mount
// onMounted(() => {
//   if (!userStore.userInfo) {
//     userStore.fetchUserInfo();
//   }
// }
</script>

<style scoped>
/* Kiểu dáng icon user */
.user-icon {
  align-items: center;
  cursor: pointer;
  padding: 10px;
  border-radius: 8px;
  transition: background 0.3s ease;
}

.user-icon:hover {
  background: #f5f5f5;
}

/* Dropdown menu */
.dropdown {
  position: absolute;
  margin-top: 8px;
  width: 180px;
  background: white;
  border-radius: 8px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  z-index: 1;
}

/* Các mục trong dropdown */
.dropdown-item {
  display: block;
  width: 100%;
  padding: 10px 15px;
  text-align: left;
  font-size: 14px;
  color: #333;
  text-decoration: none;
  background: white;
  border: none;
  cursor: pointer;
  transition: background 0.3s ease;
}

/* Hiệu ứng hover */
.dropdown-item:hover {
  background: #f0f0f0;
}
</style>
