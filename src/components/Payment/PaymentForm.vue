<template>
  <div class="container-default-DK">
    <article>
      <aside>
        <h1>Thanh toán</h1>
        <h2>____</h2>
        <div class="form-container">
          <form>
            <div class="form-group">
              <input type="text" placeholder="Họ" />
            </div>
            <div class="form-group">
              <input type="text" placeholder="Tên" />
            </div>
            <div class="form-group">
              <input type="text" placeholder="Số điện thoại" />
            </div>
            <div class="form-group">
              <input type="text" placeholder="Địa chỉ" />
            </div>
            <div class="form-group">
              <label for="">Tổng tiền hàng </label>
              <input type="text" readonly />
            </div>
            <div class="form-group">
              <label for="">Tổng tiền (Vận chuyển,thuế ....) </label>
              <input type="text" readonly />
            </div>
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
            <button type="submit" class="submit-btn">Thanh toán</button>
            <router-link to="/card"
              ><strong style="font-size: 14px; margin: 20px"
                >←Quay lại</strong
              ></router-link
            >
          </form>
        </div>
      </aside>
    </article>
  </div>
</template>
<script setup></script>
<style scoped>
body {
  margin-top: 50px;
}
label {
  font-size: 18px;
}
</style>
