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
                <img :src="getProdInfo(item.productId).image" :alt="getProdInfo(item.productId).name" />
              </div>
              <div class="tenvagia">
                <label><b>{{ getProdInfo(item.productId).name }}</b></label>
                <div class="duongdan" style="padding-top: 7px">
                  <label>{{
                    formatCurrency(getProdInfo(item.productId).price)
                    }}</label>
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
                  <b>{{
                    formatCurrency(
                    item.quantity * getProdInfo(item.productId).price
                    )
                    }}</b>
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
import { useProductStore } from "../../stores/productStore";
import { useRouter } from "vue-router";

const productStore = useProductStore();
const cartStore = useCartStore();
const router = useRouter();

const cartItems = computed(() => cartStore.cart);

// Flatten tất cả sản phẩm từ productStore.products (object phân trang) thành 1 mảng
const allProducts = computed(() => {
  const prods = productStore.products;
  return Object.values(prods).flat();
});

const productMap = computed(() => {
  return allProducts.value.reduce((map, product) => {
    map[product.id] = product;
    return map;
  }, {});
});

const getProdInfo = (productId) =>
  productMap.value[productId] || { name: "Đang tải...", price: 0, image: "" };

const updateQuantity = async (productId, delta) => {
  await cartStore.updateQuantity(productId, delta);
};

const removeItem = (index) => {
  cartStore.removeFromCart(index);
};

const totalPrice = computed(() => cartItems.value.reduce(
  (sum, item) => sum + item.quantity * getProdInfo(item.productId).price,
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
  // Đảm bảo cho từng item trong cart có thông tin sản phẩm, nếu chưa có, gọi fetchProductbyId
  await Promise.all(
    cartStore.cart.map(async (item) => {
      if (!productMap.value[item.productId]) {
        await productStore.fetchProductbyId(item.productId);
      }
    })
  );
});
</script>
