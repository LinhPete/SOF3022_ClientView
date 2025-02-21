<template>
  <section>
    <div class="boxduongdan">
      <div class="duongdan">
        <span>Trang chủ</span>
        <span>/</span>
        <span>Danh mục</span>
        <span>/</span>
        <span>{{ categoryName }}</span>
        <!-- Sử dụng tên danh mục động -->
      </div>
    </div>

    <div class="container-default-NA">
      <!-- Tiêu đề danh mục được hiển thị động -->
      <h1>{{ categoryName }}</h1>

      <div class="filter-container">
        <div class="filter">
          <span class="filter-icon"><i class="fa-solid fa-filter"></i></span>
          <span style="margin-right: 10px">BỘ LỌC</span>
          <span>|</span>
        </div>
        <div class="filter-item-gia">
          <label>
            <select>
              <option>GIÁ SẢN PHẨM</option>
              <option>Dưới 150.000đ</option>
              <option>Từ 150.000đ đến 200.000đ</option>
              <option>Từ 350.000đ đến 500.000đ</option>
              <option>Trên 500.000đ</option>
            </select>
          </label>
        </div>
        <div class="filter-item-size">
          <label>
            <select>
              <option>KÍCH THƯỚC</option>
              <option>Small</option>
              <option>Medium</option>
              <option>Large</option>
            </select>
          </label>
        </div>
        <div class="filter-item-popular">
          <label>
            <select>
              <option>SẮP XẾP</option>
              <option>A-Z</option>
              <option>GIÁ TĂNG DẦN</option>
              <option>GIÁ GIẢM DẦN</option>
            </select>
          </label>
        </div>
      </div>

      <!-- Container hiển thị danh sách sản phẩm -->
      <div class="boxspto">
        <p v-if="productStore.loading">Đang tải...</p>
        <p v-if="productStore.error" class="error">{{ productStore.error }}</p>
        <div class="boxsp" v-if="!productStore.loading && !productStore.error">
          <div
            class="sp"
            v-for="product in productsByCategory"
            :key="product.id"
          >
            <div class="sale">{{ product.discount }}%</div>
            <router-link :to="`/product-detail/${product.id}`">
              <img :src="product.image" :alt="product.name" />
            </router-link>
            <div class="tensp">
              <router-link :to="`/product/${product.id}`">
                <label>{{ product.name }}</label>
              </router-link>
            </div>
            <div class="price">
              {{ product.salePrice }}₫ <del> {{ product.originalPrice }}₫</del>
            </div>
            <div class="danhgia">
              <i
                v-for="star in 5"
                :key="star"
                class="fa-solid fa-star fa-2xs"
                :style="{ color: star <= product.rating ? '#ff4d4f' : '#ccc' }"
              ></i>
              <label for="" style="font-size: 9px">
                ({{ product.reviews }} lượt đánh giá)
              </label>
            </div>
            <h2>{{ product.name }}</h2>
            <p><label>Thương Hiệu:</label> {{ product.author }}</p>
            <p><label>Danh mục:</label> {{ product.categoryName }}</p>
            <p><label>Mô tả:</label> {{ product.description }}</p>
            <p><label>Giá:</label> {{ product.price }} USD</p>
            <p><label>Ngày mở bán:</label> {{ product.publishDate }}</p>
          </div>
        </div>
      </div>

      <div class="boxspto">
        <div class="boxsp" id="sptheonhasx"></div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import Header from "../menu-link/Header.vue";
import Footer from "../menu-link/Footer.vue";
import { useCategoryStore } from "../../stores/categoryStrore";
import { useProductStore } from "../../stores/productStore";

// Sử dụng route để lấy id từ URL
const route = useRoute();
const categoryId = ref(route.params.id || ""); // Lấy ID từ route

const categoryStore = useCategoryStore();
const productStore = useProductStore();

const categoryName = ref("");

async function loadCategory(id) {
  if (categoryStore.categories.length === 0) {
    await categoryStore.fetchCategory();
  }
  const cat = categoryStore.categories.find((category) => category.id == id);
  categoryName.value = cat ? cat.name : "Danh mục";
}

// Dùng computed() để lọc sản phẩm theo categoryId
const productsByCategory = computed(() => {
  let products = productStore.products;

  if (!products.length) {
    // Nếu store chưa có sản phẩm, lấy từ localStorage
    const storedProducts = localStorage.getItem("products");
    if (storedProducts) {
      products = JSON.parse(storedProducts);
    }
  }

  // Lọc sản phẩm theo categoryId
  return products.filter((product) => product.categoryId == categoryId.value);
});
watch(
  () => route.params.id,
  async (newId) => {
    if (newId) {
      categoryId.value = newId;
      await loadCategory(newId);
    }
  },
  { immediate: true }
);
</script>
<style>
/* Giữ nguyên style của bạn */
.error {
  color: red;
}
.product-item {
  /* Ví dụ style cho sản phẩm, bạn có thể điều chỉnh lại */
  margin-bottom: 1rem;
}
</style>
