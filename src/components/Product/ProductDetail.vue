<template>
  <Header></Header>
  <div class="boxspto">
    <p v-if="productStore.loading">Đang tải...</p>
    <p v-if="productStore.error" class="error">{{ productStore.error }}</p>
    <div class="boxsp" v-if="!productStore.loading && productStore.product">
      <div class="sp">
        <div class="sale">{{ productStore.product.discount }}%</div>
        <img
          :src="productStore.product.image"
          :alt="productStore.product.name"
        />
        <div class="tensp">
          <h2>{{ productStore.product.name }}</h2>
        </div>
        <div class="price">
          {{ productStore.product.salePrice }}₫
          <del> {{ productStore.product.originalPrice }}₫</del>
        </div>
        <div class="danhgia">
          <i
            v-for="star in 5"
            :key="star"
            class="fa-solid fa-star fa-2xs"
            :style="{
              color: star <= productStore.product.rating ? '#ff4d4f' : '#ccc',
            }"
          ></i>
          <label for="" style="font-size: 9px">
            ({{ productStore.product.reviews }} lượt đánh giá)
          </label>
        </div>
        <p><label>Thương Hiệu:</label> {{ productStore.product.author }}</p>
        <p><label>Danh mục:</label> {{ productStore.product.categoryName }}</p>
        <p><label>Mô tả:</label> {{ productStore.product.description }}</p>
        <p><label>Giá:</label> {{ productStore.product.price }} USD</p>
        <p>
          <label>Ngày mở bán:</label> {{ productStore.product.publishDate }}
        </p>
      </div>
    </div>
  </div>
  <footer>
    <Footer></Footer>
  </footer>
</template>

<script setup>
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import Header from "../menu-link/Header.vue";
import Footer from "../menu-link/Footer.vue";
import { useProductStore } from "../../stores/productStore";

const route = useRoute();
const productStore = useProductStore();

onMounted(async () => {
  // Kiểm tra nếu sản phẩm đã có trong cache thì dùng nó
  const productId = parseInt(route.params.id);
  if (!productStore.product || productStore.product.id !== productId) {
    await productStore.fetchProductbyId(productId);
  }
});
</script>

<style scoped>
.error {
  color: red;
}

.boxspto {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.boxsp {
  width: 80%;
  padding: 20px;
  border: 1px solid #ddd;
  background-color: #fff;
}

.sp img {
  width: 100%;
  height: auto;
  border-radius: 8px;
}

.sale {
  color: red;
  font-weight: bold;
}

.tensp h2 {
  font-size: 24px;
  font-weight: bold;
}

.price {
  font-size: 20px;
  color: green;
}

.danhgia i {
  color: #ff4d4f;
}

footer {
  margin-top: 30px;
}
</style>
