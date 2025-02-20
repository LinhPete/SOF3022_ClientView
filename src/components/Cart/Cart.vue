<template>
  <div>
    <Header />
    <aside v-if="cartItems.length > 0">
      <div class="giohang">
        <div class="sanphamgiohang">
          <div class="boxduongdan">
            <div class="duongdan" style="width: 90%">
              <label>
                Có <b>{{ cartItems.length }} sản phẩm</b> trong giỏ hàng
              </label>
            </div>
          </div>
          <div v-for="(item, index) in cartItems" :key="item.productId">
            <div class="khunggiohang">
              <div class="hinh">
                <img
                  :src="getProdInfo(item.productId).image"
                  :alt="getProdInfo(item.productId).name"
                />
              </div>
              <div class="tenvagia">
                <label
                  ><b>{{ getProdInfo(item.productId).name }}</b></label
                >
                <div class="duongdan" style="padding-top: 7px">
                  <label>{{
                    formatCurrency(getProdInfo(item.productId).price)
                  }}</label>
                </div>
                <div class="quantity-control">
                  <button
                    @click="updateQuantity(item.productId, -1)"
                    class="quantity-btn"
                  >
                    -
                  </button>
                  <input
                    type="text"
                    class="quantity-input"
                    v-model="item.quantity"
                    readonly
                  />
                  <button
                    @click="updateQuantity(item.productId, 1)"
                    class="quantity-btn"
                  >
                    +
                  </button>
                </div>
              </div>
              <div class="xoagiohang">
                <i
                  class="fa-solid fa-delete-left"
                  @click="cartStore.removeFromCart(index, item.id)"
                ></i>
                <label
                  ><b>{{
                    formatCurrency(
                      item.quantity * getProdInfo(item.productId).price
                    )
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
              <router-link to="/payment">
                <button @click="checkout">THANH TOÁN</button>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </aside>
    <Footer />
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useCartStore } from "../../stores/cartStore";
import { useProductStore } from "../../stores/productStore";
import Header from "../menu-link/Header.vue";
import Footer from "../menu-link/Footer.vue";

const productStore = useProductStore();
const cartStore = useCartStore();
const cartItems = computed(() => cartStore.cart);

onMounted(async () => {
  await cartStore.fetchCart();
  await Promise.all(
    cartStore.cart.map(async (item) => {
      if (!productMap.value[item.productId]) {
        const prod = await productStore.fetchProductbyId(item.productId);
      }
    })
  );
});
const productMap = computed(() =>
  productStore.products.reduce((map, product) => {
    map[product.id] = product;
    return map;
  }, {})
);

const getProdInfo = (productId) =>
  productMap.value[productId] || { name: "Đang tải...", price: 0, image: "" };

const updateQuantity = async (productId, delta) => {
  await cartStore.updateQuantity(productId, delta);
};

const totalPrice = computed(() =>
  cartItems.value.reduce(
    (sum, item) => sum + item.quantity * getProdInfo(item.productId).price,
    0
  )
);

const formatCurrency = (value) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    value
  );

const checkout = async () => {
  await cartStore.updateCart();
  router.push("payment");
};
</script>
