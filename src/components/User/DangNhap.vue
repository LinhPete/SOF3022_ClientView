<template>
  <div class="container-default">
    <article>
      <h1>Đăng nhập</h1>
      <h2>____</h2>
    </article>
    <aside>
      <div class="form-container">
        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <input type="email" id="email" name="email" placeholder="Email" v-model="model.email" required />
          </div>
          <div class="form-group">
            <input type="password" id="password" name="password" placeholder="Mật khẩu" v-model="model.password"
              required />
          </div>

          <!-- Thông báo lỗi -->
          <p v-if="userStore.message" class="error-message">
            {{ userStore.message }}
          </p>

          <!-- Nút Đăng nhập -->
          <button type="submit" class="submit-btn">ĐĂNG NHẬP</button>

          <!-- Link Quên mật khẩu & Đăng ký -->
          <div class="links">
            <router-link to="/forgot-password">Quên mật khẩu?</router-link>
            <span>hoặc</span>
            <router-link to="/register">Đăng ký</router-link>
          </div>
        </form>
      </div>
    </aside>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useUserStore } from "../../stores/userStore";
import Header from "../menu-link/Header.vue";
import Footer from "../menu-link/Footer.vue";
const userStore = useUserStore();
import { useRouter } from "vue-router";
const router = useRouter();
const model = ref({
  email: "",
  password: "",
});

const handleLogin = async () => {
  const success = await userStore.handleLogin(
    model.value.email,
    model.value.password
  );
  if (success) {
    router.push("/"); // Chuyển hướng sau khi đăng nhập thành công
  }
};
</script>

<style>
/* Thêm CSS tùy chỉnh */
.form-container {
  max-width: 400px;
  margin: auto;
}

.form-group {
  margin-bottom: 15px;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.submit-btn {
  background-color: #007bff;
  color: white;
  padding: 10px;
  border: none;
  width: 100%;
  border-radius: 5px;
  cursor: pointer;
}

.submit-btn:hover {
  background-color: #0056b3;
}

.links {
  margin-top: 10px;
  font-size: 14px;
}

.links a {
  color: #007bff;
  text-decoration: none;
}

.links a:hover {
  text-decoration: underline;
}

.error-message {
  color: red;
  font-size: 14px;
  margin-bottom: 10px;
}
</style>
