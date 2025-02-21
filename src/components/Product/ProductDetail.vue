<template>
  <div class="boxspto">
    <p v-if="productStore.loading">Đang tải...</p>
    <p v-if="productStore.error" class="error">{{ productStore.error }}</p>
    
    <div class="boxsp" v-if="!productStore.loading && productStore.product">
      <div class="product-container">
        <!-- Hình ảnh sản phẩm -->
        <div class="image-section">
          <div class="thumbnail-container">
            <img
              v-for="(img, index) in productStore.product.otherImages"
              :key="index"
              :src="img"
              :alt="`Hình ảnh ${index + 1}`"
              @click="productStore.product.image = img"
              class="thumbnail"
            />
          </div>
          <div class="main-image-container">
            <div class="sale" v-if="productStore.product.discount">
              -{{ productStore.product.discount }}%
            </div>
            <img :src="productStore.product.image" :alt="productStore.product.name" class="main-image" />
          </div>
        </div>

        <!-- Thông tin sản phẩm -->
        <div class="info-section">
          <h2 class="product-title">{{ productStore.product.name }}</h2>
          
          <div class="price">
            <span class="sale-price">{{ productStore.product.salePrice }}₫</span>
            <del class="original-price">{{ productStore.product.originalPrice }}₫</del>
          </div>

          <div class="danhgia">
            <i
              v-for="star in 5"
              :key="star"
              class="fa-solid fa-star fa-2xs"
              :style="{ color: star <= productStore.product.rating ? '#ff4d4f' : '#ccc' }"
            ></i>
            <span class="review-count">({{ productStore.product.reviews }} lượt đánh giá)</span>
          </div>

          <div class="product-details">
            <div><label>Thương hiệu:</label> {{ productStore.product.author }}</div>
            <div><label>Danh mục:</label> {{ productStore.product.categoryName }}</div>
            <div><label>Giá:</label> {{ productStore.product.price }} USD</div>
            <div><label>Ngày mở bán:</label> {{ productStore.product.publishDate }}</div>
          </div>

          <p class="description"><label>Mô tả:</label> {{ productStore.product.description }}</p>
        </div>
      </div>
    </div>
  </div>
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

.product-info {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.product-info p {
  display: flex;
  align-items: center;
  margin: 0;
}

.product-info label {
  font-weight: bold;
  margin-right: 5px;
}


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

.product-container {
  display: flex;
  align-items: center;
  gap: 20px;
}

.thumbnail-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.thumbnail {
  width: 80px;
  height: 80px;
  cursor: pointer;
  border: 1px solid #ccc;
  border-radius: 5px;
  object-fit: cover;
}

.main-image-container {
  position: relative;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.main-image {
  width: 400px;
  height: 400px;
  object-fit: cover;
  border-radius: 10px;
}

.sale {
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: red;
  color: white;
  padding: 5px;
  font-size: 14px;
  border-radius: 5px;
}

.product-info {
  flex: 1;
}
</style>

