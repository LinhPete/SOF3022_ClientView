<template>
  <article>
    <p class="title">Danh sách sản phẩm</p>
    <div class="boxspto">
      <p v-if="productStore.loading">Đang tải...</p>
      <p v-if="productStore.error" class="error">{{ productStore.error }}</p>
  
      <div class="boxsp" v-if="!productStore.loading && !productStore.error">
        <div class="sp" v-for="product in displayedProducts" :key="product.id">
          <div class="sale" v-if="product.discount">-{{ product.discount }}%</div>
  
          <router-link :to="`/product/${product.id}`" class="product-image">
            <img :src="product.image" :alt="product.name" />
          </router-link>
  
          <div class="tensp">
            <router-link :to="`/product/${product.id}`">
              <label>{{ product.name }}</label>
            </router-link>
          </div>
  
          <div class="price">
            <span class="original-price">{{ product.price }}₫</span>
          </div>
  
          <div class="danhgia">
            <i v-for="star in 5" :key="star" class="fa-solid fa-star fa-2xs"
              :style="{ color: star <= product.rating ? '#ff4d4f' : '#ccc' }"></i>
            <label class="review-count">({{ product.reviews }} đánh giá)</label>
          </div>
  
          <div class="cart-hover" @click="cartStore.addProductToCart(product)">
            <i class="fa-solid fa-bag-shopping fa-lg"></i>
          </div>
        </div>
      </div>
  
      <div class="pagination" v-if="totalPages > 1">
        <div class="pagination-container">
          <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1"
            class="pagination-btn next">&#x276E;</button>
          <span>Trang {{ currentPage }} / {{ totalPages }}</span>
          <button @click="changePage(currentPage + 1)" :disabled="currentPage >= totalPages"
            class="pagination-btn prev">&#x276F;</button>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useProductStore } from "../../stores/productStore";
import { useCartStore } from "../../stores/cartStore";

const productStore = useProductStore();
const cartStore = useCartStore();
const currentPage = ref(1);
const totalPages = ref(1);

const displayedProducts = computed(() => productStore.products || []);

const fetchProducts = async (page) => {
  await productStore.fetchProduct(page);
  totalPages.value = productStore.totalPages;
};

const changePage = (newPage) => {
  if (newPage >= 1 && newPage <= totalPages.value) {
    currentPage.value = newPage;
    fetchProducts(newPage);
  }
};

onMounted(() => fetchProducts(currentPage.value));
</script>

<style scoped>
.boxspto {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.boxsp {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  justify-content: center;
  perspective: 1000px;
}

.sp {
  position: relative;
  width: 200px;
  padding: 15px;
  border-radius: 10px;
  background: linear-gradient(135deg, #f9f9f9, #e6e6e6);
  text-align: center;
  transform-style: preserve-3d;
  transition: transform 0.5s ease, box-shadow 0.3s ease;
}

.sp:hover {
  transform: rotateY(10deg) rotateX(10deg) scale(1.05);
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.3);
}

.sale {
  position: absolute;
  top: 10px;
  left: 10px;
  background: red;
  color: white;
  padding: 5px;
  font-size: 14px;
  border-radius: 5px;
}

.product-image img {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 5px;
  transition: transform 0.3s ease;
}

.product-image:hover img {
  transform: scale(1.1);
}

.tensp label {
  font-weight: bold;
  font-size: 14px;
  color: #333;
}

.price {
  font-size: 16px;
  font-weight: bold;
  color: red;
}

.danhgia {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 3px;
  font-size: 12px;
}

.cart-hover {
  position: absolute;
  bottom: 15px;
  right: 15px;
  width: 40px;
  height: 40px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  cursor: pointer;
  transform: scale(0);
  transition: transform 0.3s ease, background 0.3s ease;
}

.sp:hover .cart-hover {
  transform: scale(1);
}

.cart-hover:hover {
  background: red;
}

/* Hiệu ứng chung cho nút */
button {
  position: relative;
  display: inline-block;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: bold;
  color: #fff;
  background: linear-gradient(135deg, #ff416c, #ff4b2b);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

/* Hiệu ứng hover với ánh sáng động */
button:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(255, 65, 108, 0.6);
  background: linear-gradient(135deg, #ff4b2b, #ff416c);
}

/* Hiệu ứng nhấn xuống với 3D */
button:active {
  transform: scale(0.95);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
}

/* Hiệu ứng phát sáng xung quanh */
button::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 50%);
  transition: opacity 0.4s ease-in-out;
  opacity: 0;
}

button:hover::before {
  opacity: 1;
}

/* Hiệu ứng riêng cho nút trong form đánh giá */
.submit-button {
  background: linear-gradient(135deg, #007bff, #0056b3);
}

.submit-button:hover {
  background: linear-gradient(135deg, #0056b3, #007bff);
  box-shadow: 0 8px 20px rgba(0, 123, 255, 0.6);
}

.submit-button:active {
  transform: scale(0.95);
}

/* Nút phân trang */
.pagination button {
  background: linear-gradient(135deg, #d3dfe6, #9bc0ff);
  margin: 5px;
}

.pagination button:hover {
  box-shadow: 0 8px 20px rgba(141, 193, 221, 0.6);
}

.pagination button:active {
  transform: scale(0.95);
}

.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 20px;
  position: relative;
  z-index: 10;
}

.pagination-btn {
  background: rgba(0, 255, 255, 0.2);
  border: 2px solid cyan;
  color: cyan;
  font-size: 24px;
  padding: 15px 20px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  box-shadow: 0px 0px 10px cyan, 0px 0px 40px rgba(0, 255, 255, 0.5);
}

.pagination-btn:hover {
  background: cyan;
  color: black;
  transform: scale(1.2) rotate(10deg);
  box-shadow: 0px 0px 20px cyan, 0px 0px 50px rgba(0, 255, 255, 0.7);
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  box-shadow: none;
}

.pagination-btn.prev {
  transform: perspective(500px) rotateY(10deg);
}

.pagination-btn.next {
  transform: perspective(500px) rotateY(-10deg);
}
</style>
