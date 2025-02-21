<template>
  <div>
  <div class="dongdau">
    <p>
      Miễn phí vận chuyển với đơn hàng trên 500K. Hàng pre-order còn được giảm
      thêm 5%.
    </p>
  </div>
  <div class="container">
    <div class="container1">
      <a href="/">
        <div class="swe"><img src="/src/assets/img/logo.webp" alt="" /></div>
      </a>
      <div class="seach">
        <input type="search" placeholder="Tìm kiếm sản phẩm..." />
        <button>
          <i class="fa-solid fa-magnifying-glass" style="color: #ffffff"></i>
        </button>
      </div>
      <div class="login">
        <UserDropMenu />
      </div>
      <div class="cart">
        <router-link to="/card">
          <i class="fa-solid fa-bag-shopping fa-xl" style="padding: 10px"></i>
          <span v-if="totalItems > 0" class="cart-badge">{{ totalItems }}</span>
        </router-link>
      </div>
    </div>
  </div>
  <Menu></Menu>
</div>
</template>

<script setup>
import { computed } from "vue";
import Menu from "./Menu.vue";
import UserDropMenu from "./UserDropMenu.vue";
import { useCartStore } from "../../stores/cartStore";

// Sử dụng store để lấy thông tin giỏ hàng
const cartStore = useCartStore();
const totalItems = computed(() => cartStore.totalCartItems);
</script>

<style scoped>
.cart {
  position: relative;
  font-size: 24px;
  cursor: pointer;
}

.cart-badge {
  position: absolute;
  top: -5px;
  right: -10px;
  background: red;
  color: white;
  font-size: 12px;
  font-weight: bold;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
