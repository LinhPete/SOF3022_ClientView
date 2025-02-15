<template>
  <div>
    <Header />
    <aside v-if="cartStore.cart.length > 0">
      <div class="giohang">
        <div class="sanphamgiohang">
          <div class="boxduongdan">
            <div class="duongdan" style="width: 90%">
              <label for=""
                >Có <b>{{ cartStore.cart.length }} sản phẩm</b> trong giỏ
                hàng</label
              >
            </div>
          </div>
          <div v-for="(item, index) in cartStore.cart" :key="item.id">
            <div class="khunggiohang">
              <div class="hinh">
                <img :src="getProdImg(item.productId)" :alt="item.name" />
              </div>
              <div class="tenvagia">
                <label
                  ><b>{{ item.name }}</b></label
                >
                <div class="duongdan" style="padding-top: 7px">
                  <label>{{ formatCurrency(item.price) }}</label>
                </div>
                <div class="quantity-control">
                  <button @click="decreaseQuantity(index)" class="quantity-btn">
                    -
                  </button>
                  <input
                    type="text"
                    class="quantity-input"
                    v-model="item.quantity"
                    readonly
                  />
                  <button @click="increaseQuantity(index)" class="quantity-btn">
                    +
                  </button>
                </div>
              </div>
              <div class="xoagiohang">
                <i
                  class="fa-solid fa-delete-left"
                  @click="removeItem(index)"
                ></i>
                <label
                  ><b>{{
                    formatCurrency(item.price * item.quantity)
                  }}</b></label
                >
              </div>
            </div>
            <hr />
          </div>
        </div>

        <div class="thanhtoan">
          <div class="boxthanhtoan">
            <div class="thanhtoannho">
              <label><b>Thông tin đơn hàng</b></label>
              <hr />
              <div class="tongtien">
                <div class="chutongtien"><b>Tổng tiền</b></div>
                <div class="sotongtien">
                  <b>{{ formatCurrency(totalPrice) }}</b>
                </div>
              </div>
              <hr />
              <button @click="checkout">THANH TOÁN</button>
            </div>
          </div>
        </div>
      </div>
    </aside>

    <div v-else>
      <p>Giỏ hàng của bạn đang trống.</p>
    </div>

    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useCartStore } from "../../stores/cartStore";
import Header from "../menu-link/Header.vue";
import Footer from "../menu-link/Footer.vue";
import { useProductStore } from "../../stores/productStore";
// Sử dụng store để truy cập giỏ hàng
const cartStore = useCartStore();
const note = ref("");

onMounted(() => {
  cartStore.fetchCart();
});

const increaseQuantity = (index) => {
  const item = cartStore.cart[index];
  if (item) {
    cartStore.updateQuantity(index, item.quantity + 1);
  }
};

const decreaseQuantity = (index) => {
  const item = cartStore.cart[index];
  if (item && item.quantity > 1) {
    cartStore.updateQuantity(index, item.quantity - 1);
  }
};

const totalPrice = computed(() => {
  return (
    cartStore.cart?.reduce(
      (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
      0
    ) || 0
  );
});

const productStore = useProductStore();

const getProdImg = computed(() => (prodId) => {
  const product = productStore.products.find((p) => p.id === prodId);
  return product?.image ?? "path/to/default/image.jpg";
});

const formatCurrency = (value) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};

const removeItem = (index) => {
  cartStore.removeFromCart(index);
  cartStore.fetchCart();
};

const checkout = () => {
  if (!cartStore.cart.length) {
    alert("Giỏ hàng trống, không thể thanh toán!");
    return;
  }
  // Nếu chưa có phương thức checkout, bạn có thể gọi API hoặc xử lý đặt hàng tại đây
  console.log("Chức năng thanh toán đang được phát triển...");
};
</script>
