<template>
  <div class="container-default">
    <aside>
      <div class="form-container">
        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <input type="email" id="email" name="email" placeholder="Email" v-model="model.email" required />
          </div>
          <div class="form-group">
            <input type="password" id="password" name="password" placeholder="Mật khẩu" v-model="model.password" required />
          </div>

          <!-- Thông báo lỗi -->
          <p v-if="userStore.message" class="error-message">{{ userStore.message }}</p>

          <!-- Nút Đăng nhập -->
          <button type="submit" class="submit-btn">ĐĂNG NHẬP</button>
        </form>

        <!-- Đăng nhập bằng SSO -->
        <div class="sso-buttons">
          <button @click="googleLogin" class="google-btn">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1200px-Google_%22G%22_logo.svg.png" alt="Google" /> Đăng nhập với Google
          </button>
          <button @click="loginWithFacebook" class="facebook-btn">
            <img src="https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png" alt="Facebook" /> Đăng nhập với Facebook
          </button>
        </div>

        <!-- Link Quên mật khẩu & Đăng ký -->
        <div class="links">
          <router-link to="/forgot-password">Quên mật khẩu?</router-link>
          <span>hoặc</span>
          <router-link to="/register">Đăng ký</router-link>
        </div>
      </div>
    </aside>
  </div>
</template>


<script setup>
import { ref } from "vue";
import { useUserStore } from "../../stores/userStore";
import { useRouter } from "vue-router";
import { useToast } from "vue-toast-notification";
import { GoogleLogin } from "vue3-google-login";

const userStore = useUserStore();
const router = useRouter();
const toast = useToast();

const model = ref({
  email: "",
  password: "",
});

const handleLogin = async () => {
  const success = await userStore.handleLogin(model.value.email, model.value.password);
  if (success) {
    toast.open({
      message: "Đăng nhập thành công",
      type: "success",
      duration: 2000,
      position: "top-right",
    });
    router.push("/");
  }
};

const googleLogin = () => {
  GoogleLogin({
    clientId: "CLIENT_ID",
    callback: async (response) => {
      if (response.credential) {
        await userStore.googleSignIn(response.credential);
      }
    },
  });
};

const loginWithFacebook = () => {
  userStore.loginWithFacebook();
};
</script>

<style scoped>
.form-container {
  max-width: 400px;
  margin: auto;
  padding: 20px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 15px;
}

input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
}

.submit-btn {
  background-color: #007bff;
  color: white;
  padding: 12px;
  border: none;
  width: 100%;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
}

.submit-btn:hover {
  background-color: #0056b3;
}

.sso-buttons {
  margin-top: 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.google-btn, .facebook-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  border: none;
  width: 100%;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
}

.google-btn {
  background-color: #db4437;
  color: white;
}

.facebook-btn {
  background-color: #3b5998;
  color: white;
}

.google-btn img, .facebook-btn img {
  width: 20px;
  height: 20px;
  margin-right: 10px;
}

.links {
  margin-top: 10px;
  font-size: 14px;
  text-align: center;
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
