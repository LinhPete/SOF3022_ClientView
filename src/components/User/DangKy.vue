<template>
  <div>
    <div class="container-default-DK">
      <aside>
        <div class="form-container">
          <form @submit.prevent="handleRegister">
            <div class="form-group">
              <input
                type="text"
                id="ho"
                name="ho"
                placeholder="Họ"
                v-model="user.firstName"
              />
            </div>
            <div class="form-group">
              <input
                type="text"
                id="ten"
                name="ten"
                placeholder="Tên"
                v-model="user.lastName"
              />
            </div>
            <div class="form-group">
              <label>
                <input
                  type="radio"
                  name="gender"
                  :value="false"
                  v-model="user.gender"
                />
                Nữ
                <input
                  type="radio"
                  name="gender"
                  :value="true"
                  v-model="user.gender"
                />
                Nam
              </label>
            </div>
            <div class="form-group">
              <input
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                placeholder="Số điện thoại"
                v-model="user.phone"
              />
            </div>
            <div class="form-group">
              <input type="date" id="dob" name="dob" v-model="user.birthday" />
            </div>
            <div class="form-group">
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Email"
                v-model="user.email"
              />
            </div>
            <div class="form-group">
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Mật khẩu"
                v-model="user.password"
              />
            </div>
            <!-- Các phần input khác -->

            <!-- Phần ghi chú -->
            <p class="note">
              This site is protected by reCAPTCHA and the Google
              <a href="https://policies.google.com/privacy" target="_blank"
                >Privacy Policy</a
              >
              and
              <a href="https://policies.google.com/terms" target="_blank"
                >Terms of Service</a
              >
              apply.
            </p>

            <!-- Nút Đăng ký -->
            <button type="submit" class="submit-btn">ĐĂNG KÝ</button>

            <!-- Link quay lại -->
            <router-link to="/"
              ><a class="back-link"
                ><strong style="font-size: 14px; margin-right: 10px">← </strong
                >Quay lại trang chủ</a
              >
            </router-link>
          </form>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from "../../stores/userStore";
import { ref } from "vue";
import { useRouter } from "vue-router"; // Thêm import này
import { useToast } from "vue-toast-notification";
const router = useRouter(); // Khai báo router
const userStore = useUserStore();
const toast = useToast();
const user = ref({
  email: "",
  password: "", // Thêm trường xác nhận mật khẩu
  firstName: "",
  lastName: "",
  gender: false,
  birthday: "",
  phone: "",
});

const handleRegister = async () => {
  if (
    !user.value.email ||
    !user.value.password ||
    !user.value.firstName ||
    !user.value.lastName ||
    !user.value.phone ||
    !user.value.birthday
  ) {
    toast.open({
      message: "Vui lòng nhập đầy đủ thông tin!",
      type: "warning",
      duration: 3000,
      position: "top-right",
    });
    return;
  }

  try {
    // Đảm bảo `await` được sử dụng để đợi kết quả của `registerAndLogin`
    const success = await userStore.registerAndLogin({
      email: user.value.email,
      password: user.value.password,
      firstName: user.value.firstName,
      lastName: user.value.lastName,
      gender: user.value.gender,
      phone: user.value.phone,
      birthday: new Date(user.value.birthday).toISOString().split("T")[0],
    });

    if (success) {
      toast.open({
        message: "Đăng ký và đăng nhập thành công",
        type: "success",
        duration: 3000,
        position: "top-right",
      });
      router.push("/");
    } else {
      toast.open({
        message: "Đăng ký hoặc đăng nhập thất bại",
        type: "error",
        duration: 3000,
        position: "top-right",
      });
    }
  } catch (error) {
    console.error("Lỗi khi đăng ký:", error);
  }
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
</style>
