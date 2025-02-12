<template>
  <div>
    <Header />
    <aside>
      <div class="giohang">
        <div class="sanphamgiohang">
          <div class="boxduongdan">
            <div class="duongdan" style="width: 90%">
              <label for=""
                >Có <b>{{ cart.length }} sản phẩm</b> trong giỏ hàng</label
              >
            </div>
          </div>

          <div v-for="(item, index) in cart" :key="item.id">
            <div class="khunggiohang">
              <div class="hinh">
                <img :src="item.image" alt="" />
              </div>
              <div class="tenvagia">
                <label for=""
                  ><b>{{ item.name }}</b></label
                >
                <div class="duongdan" style="padding-top: 7px">
                  <label for="">{{ formatCurrency(item.price) }}</label>
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
                ></i
                ><br /><br />
                <label for=""
                  ><b>{{
                    formatCurrency(item.price * item.quantity)
                  }}</b></label
                >
              </div>
            </div>
            <hr />
          </div>

          <div class="khunggiohang">
            <div class="ghichu">
              <b style="font-size: 12px; color: gray">Ghi chú đơn hàng</b><br />
              <input type="text" v-model="note" />
            </div>
          </div>
        </div>

        <div class="thanhtoan">
          <div class="boxthanhtoan">
            <div class="thanhtoannho">
              <label for=""><b>Thông tin đơn hàng</b></label>
              <hr />
              <div class="tongtien">
                <div class="chutongtien" style="font-size: 12px; color: gray">
                  <b>Tổng tiền</b>
                </div>
                <div class="sotongtien" style="font-size: 16px; color: red">
                  <b>{{ formatCurrency(totalPrice) }}</b>
                </div>
              </div>
              <hr />
              <button @click="checkout">THANH TOÁN</button>
            </div>
          </div>
          <label for="" style="color: gray; font-size: 12px; margin-top: 20px">
            <i class="fa-solid fa-share"></i> Tiếp tục mua hàng
          </label>
        </div>
      </div>
    </aside>
    <Footer />
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import Footer from "./menu-link/Footer.vue";
import Header from "./menu-link/Header.vue";

const cart = ref([
  {
    id: 1,
    name: "STAR PLUSH CHARM - WHITE",
    price: 70000,
    quantity: 1,
    image: "../assets/img/sp10.webp",
  },
  {
    id: 2,
    name: "STAR PLUSH CHARM - WHITE",
    price: 70000,
    quantity: 1,
    image: "../assets/img/sp1.webp",
  },
]);

const note = ref("");

const increaseQuantity = (index) => {
  cart.value[index].quantity++;
};

const decreaseQuantity = (index) => {
  if (cart.value[index].quantity > 1) {
    cart.value[index].quantity--;
  }
};

const removeItem = (index) => {
  cart.value.splice(index, 1);
};

const totalPrice = computed(() => {
  return cart.value.reduce((sum, item) => sum + item.price * item.quantity, 0);
});

const formatCurrency = (value) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};

const checkout = () => {
  alert("Thanh toán đơn hàng thành công!");
};
</script>

<style scoped></style>
