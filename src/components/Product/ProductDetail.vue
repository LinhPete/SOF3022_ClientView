<template>
  <div class="boxspto">
    <p v-if="productStore.loading">Đang tải...</p>
    <p v-if="productStore.error" class="error">{{ productStore.error }}</p>
  
    <div class="boxsp" >
      <div class="product-container">
        <div class="image-section">
          <div class="thumbnail-container">
            <img v-for="(img, index) in product.otherImages" :key="index" :src="img"
              :alt="`Hình ảnh ${index + 1}`" @click="product.image = img" class="thumbnail" />
          </div>
          <div class="main-image-container">
            <div class="sale" v-if="product.discount">
              -{{ product.discount }}%
            </div>
            <img :src="product.image" :alt="product.name" class="main-image" />
          </div>
        </div>
        <div class="info-section">
          <h2 class="product-title">{{ product.name }}</h2>
  
          <div class="price">
            <span class="sale-price">{{ product.salePrice }}₫</span>
            <del class="original-price">{{ product.originalPrice }}₫</del>
          </div>
  
          <div class="danhgia">
            <i v-for="star in 5" :key="star" class="fa-solid fa-star fa-2xs" :style="{
                  color: star <= product.rating ? '#ff4d4f' : '#ccc',
                }"></i>
            <span class="review-count">({{ product.reviews }} lượt đánh giá)</span>
          </div>
  
          <div class="product-details">
            <div>
              <label>Thương hiệu:</label> {{ product.author }}
            </div>
            <div>
              <label>Danh mục:</label> {{ product.categoryName }}
            </div>
            <div><label>Giá:</label> {{ product.price }} USD</div>
            <div>
              <label>Ngày mở bán:</label> {{ product.publishDate }}
            </div>
          </div>
  
          <p class="description">
            <label>Mô tả:</label> {{ product.description }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useProductStore } from "../../stores/productStore";

const route = useRoute();
const productStore = useProductStore();
const product = ref({});

onMounted(async () => {
  const productId = parseInt(route.params.id);
  const response = await productStore.fetchProductbyId(productId);
  if(response){
    product.value = response;
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
