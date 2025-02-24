<template>
  <div class="container-default">
    <aside>
      <div class="form-container">
        <form>
          <h2>Phục hồi mật khẩu</h2>
          <div class="form-group" v-if="sended == false">
  
            <div class="form-group">
              <input v-model="email" type="email" id="email" name="email" placeholder="Nhập email khôi phục mới" />
            </div>
            <button type="button" @click="handleFogotPass">Gửi</button>
          </div>
          <div class="form-group" v-if="sended">
  
            <div class="form-group">
              <input v-model="request.password" type="password" id="password" name="password"
                placeholder="Nhập mật khẩu mới" />
            </div>
            <input v-model="request.token" type="text" id="token" name="token"
              placeholder="Hãy nhập đoạn mã bạn nhận được từ mail" />
            <button type="button" @click="handleResetPassword" class="submit-btn">Khôi phục</button>
          </div>
          <!-- Nút Đăng ký -->
  
          <!-- Link quay lại -->
          <router-link to="/"><a class="back-link"><strong style="font-size: 14px; margin-right: 10px">← </strong>Quay lại
              trang chủ</a>
          </router-link>
        </form>
      </div>
    </aside>
  </div>
</template>

<script setup>

import { ref } from "vue";
import { useUserStore } from "../../stores/userStore";
import { useToast } from "vue-toast-notification";
const toast = useToast();


const userStore = useUserStore();

const sended = ref(false);
const email = ref("");
const request = ref({
  password: "",
  token: "",
})

const handleFogotPass = async () => {
  await userStore.forgotPassword(email.value)
  sended.value = true;
}
const handleResetPassword = async () => {
  const requestReset = { ...request.value };
  console.log(requestReset);
  const response = await userStore.resetPassword(requestReset.password, requestReset.token);
  if (response) {
    toast.success("Mật khẩu đã được khôi phục");
  } else {
    toast.open("Không thể thay đổi mật khẩu");
  }
}
</script>

<style></style>
