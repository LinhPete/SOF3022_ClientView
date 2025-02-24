<template>
  <div>
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
                  :src="getProdInfoFromLocalStorage(item.productId).image"
                  :alt="getProdInfoFromLocalStorage(item.productId).name"
                />
              </div>
              <div class="tenvagia">
                <label>
                  <b>{{ getProdInfoFromLocalStorage(item.productId).name }}</b>
                </label>
                <div class="duongdan" style="padding-top: 7px">
                  <label>
                    {{
                      formatCurrency(
                        getProdInfoFromLocalStorage(item.productId).price
                      )
                    }}
                  </label>
                </div>
                <div class="quantity-control">
                  <i class="fa-solid fa-minus quantity-btn" @click="updateQuantity(item.productId, -1)"
                    style="cursor: pointer"></i>
                  <input type="text" class="quantity-input" v-model="item.quantity" readonly />
                  <i class="fa-solid fa-plus quantity-btn" @click="updateQuantity(item.productId, 1)"
                    style="cursor: pointer"></i>
                </div>
              </div>
              <div class="xoagiohang">
                <i class="fa-solid fa-delete-left" @click="removeItem(index)"></i>
                <label>
                  <b>
                    {{
                      formatCurrency(
                        item.quantity *
                          getProdInfoFromLocalStorage(item.productId).price
                      )
                    }}
                  </b>

                </label>
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
              <router-link to="/order">
                <button @click="checkout">ĐẶT HÀNG</button>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </aside>
    <div v-else>
      <p>Giỏ hàng của bạn đang trống.</p>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useCartStore } from "../../stores/cartStore";
import { useRouter } from "vue-router";

const cartStore = useCartStore();
const router = useRouter();

const cartItems = computed(() => cartStore.cart);

const getProdInfoFromLocalStorage = (productId) => {
  let products = [];
  const storedProducts = localStorage.getItem("products");
  if (storedProducts) {
    try {
      const parsedData = JSON.parse(storedProducts);
      products = Array.isArray(parsedData)
        ? parsedData
        : Object.values(parsedData).flat();
    } catch (e) {
      console.error("Lỗi parse products từ localStorage:", e);
    }
  }
  return (
    products.find((product) => product.id === productId) || {
      name: "Đang tải...",
      price: 0,
      image: "",
    }
  );
};

const updateQuantity = async (productId, delta) => {
  await cartStore.updateQuantity(productId, delta);
};

const removeItem = (index) => {
  cartStore.removeFromCart(index);
};

const totalPrice = computed(() =>
  cartItems.value.reduce(
    (sum, item) =>
      sum + item.quantity * getProdInfoFromLocalStorage(item.productId).price,
    0
  )

);

const formatCurrency = (value) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    value
  );

const checkout = async () => {
  cartStore.setTotalPrice(totalPrice.value);
  await cartStore.updateCart();
  // Sau checkout, chuyển hướng trang nếu cần
  router.push("/order");
};

onMounted(async () => {
  await cartStore.fetchCart();
});
</script>
