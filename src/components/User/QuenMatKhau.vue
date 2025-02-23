<template>
  <div class="container-default">
    <aside>
      <div class="form-container">
        <form>
          <div class="form-group">
            <h2>Phục hồi mật khẩu</h2>
            <div class="form-group">
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Nhập mật khẩu mới"
              />
            </div>
          </div>
          <div class="form-group">
            <input
              type="text"
              id="token"
              name="token"
              placeholder="Hãy nhập đoạn mã bạn nhận được từ mail"
            />
          </div>
          <!-- Nút Đăng ký -->
          <button type="submit" class="submit-btn">Khôi phục</button>
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
</template>

<script setup>
import Header from "../menu-link/Header.vue";
import Footer from "../menu-link/Footer.vue";
</script>

<style></style>
