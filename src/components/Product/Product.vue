<template>
  <article>
    <p>Sản phẩm đang giảm giá</p>
    <div class="boxspto">
      <p v-if="productStore.loading">Đang tải...</p>
      <p v-if="productStore.error" class="error">{{ productStore.error }}</p>
      <div class="boxsp" id="spmoinhat" v-if="!productStore.loading && !productStore.error">
        <div class="sp" v-for="product in productStore.products" :key="product.id">
          
          <!-- Sale Label -->
          <div class="sale" v-if="product.discount">-{{ product.discount }}%</div>

          <!-- Ảnh sản phẩm -->
          <router-link :to="`/product/${product.id}`" class="product-image">
            <img :src="product.image" :alt="product.name" />
          </router-link>

          <!-- Thông tin sản phẩm -->
          <div class="tensp">
            <router-link :to="`/product/${product.id}`">
              <label>{{ product.name }}</label>
            </router-link>
          </div>

          <div class="price">
            <span class="sale-price">{{ product.salePrice }}₫</span>
            <del class="original-price">{{ product.originalPrice }}₫</del>
          </div>

          <div class="danhgia">
            <i
              v-for="star in 5"
              :key="star"
              class="fa-solid fa-star fa-2xs"
              :style="{ color: star <= product.rating ? '#ff4d4f' : '#ccc' }"
            ></i>
            <label class="review-count">({{ product.reviews }} lượt đánh giá)</label>
          </div>

          <!-- Giỏ hàng (hover mới hiển thị) -->
          <div class="cart-hover" @click="cartStore.addProductToCart(product)">
            <i class="fa-solid fa-bag-shopping fa-lg"></i>
          </div>

        </div>
      </div>
    </div>
  </article>
</template>

<script setup>
import { onMounted } from "vue";
import { useProductStore } from "../../stores/productStore";
import { useCartStore } from "../../stores/cartStore"; 

const productStore = useProductStore();
const cartStore = useCartStore();

onMounted(async () => {
  await productStore.fetchProduct();
});
</script>

<style scoped>
/* Tổng thể */
.boxspto {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.boxsp {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  justify-content: center;
}

/* Mỗi sản phẩm */
.sp {
  position: relative;
  width: 200px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: white;
  text-align: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.sp:hover {
  transform: translateY(-5px);
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
}

/* Nhãn giảm giá */
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

/* Hình ảnh */
.product-image img {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 5px;
  transition: opacity 0.2s ease;
}

.product-image:hover img {
  opacity: 0.8;
}

/* Tên sản phẩm */
.tensp label {
  display: block;
  font-weight: bold;
  font-size: 14px;
  margin: 10px 0;
  text-decoration: none;
  color: #333;
}

/* Giá */
.price {
  font-size: 16px;
  margin-bottom: 8px;
}

.sale-price {
  color: red;
  font-weight: bold;
}

.original-price {
  color: gray;
  font-size: 14px;
  margin-left: 5px;
}

/* Đánh giá */
.danhgia {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 3px;
  font-size: 12px;
}

.review-count {
  font-size: 10px;
  color: gray;
}

/* Hiệu ứng hover giỏ hàng */
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
  transition: transform 0.2s ease, background 0.2s ease;
}

.sp:hover .cart-hover {
  transform: scale(1);
}

.cart-hover:hover {
  background: red;
}

.cart-hover i {
  font-size: 18px;
}
</style>
