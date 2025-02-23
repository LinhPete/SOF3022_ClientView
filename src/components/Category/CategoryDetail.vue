<template>
  <section>
    <div class="boxduongdan">
      <div class="duongdan">
        <span>Trang chủ</span>
        <span>/</span>
        <span>Danh mục</span>
        <span>/</span>
        <span>{{ categoryName }}</span>
      </div>
    </div>
    <div class="container-default-NA">
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
            v-for="product in productStore.products"
            :key="product.id"
          >
            <!-- <div class="sale">{{ product.discount }}%</div> -->
            <router-link :to="`/product/${product.id}`">
              <img :src="product.image" :alt="product.name" />
            </router-link>
            <div class="price">{{ product.price }}đ</div>
            <div class="danhgia">
              <i
                v-for="star in 5"
                :key="star"
                class="fa-solid fa-star fa-2xs"
                :style="{ color: star <= product.rating ? '#ff4d4f' : '#ccc' }"
              ></i>
              <label style="font-size: 9px">
                ({{ product.reviews }} lượt đánh giá)
              </label>
            </div>
            <h2>{{ product.name }}</h2>
            <p><label>Thương Hiệu:</label> {{ product.author }}</p>
            <p><label>Danh mục:</label> {{ categoryName }}</p>
            <p><label>Mô tả:</label> {{ product.description }}</p>
            <p><label>Giá:</label> {{ product.price }} USD</p>
            <p><label>Ngày mở bán:</label> {{ product.publishDate }}</p>
          </div>
        </div>
      </div>

      <!-- Phân trang -->
      <div v-if="totalPages > 1" class="pagination">
        <button
          v-for="page in totalPages"
          :key="page"
          :class="{ active: page === currentPage }"
          @click="changePage(page)"
        >
          {{ page }}
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { useCategoryStore } from "../../stores/categoryStrore";
import { useProductStore } from "../../stores/productStore";

const route = useRoute();
const categoryId = ref(route.params.id || "");
const categoryStore = useCategoryStore();
const productStore = useProductStore();

const currentPage = ref(1);
const totalPages = ref(1);
const categoryName = ref("Danh mục");

async function loadCategory(id) {
  if (categoryStore.categories.length === 0) {
    await categoryStore.fetchCategory();
  }
  const cat = categoryStore.categories.find((category) => category.id == id);
  categoryName.value = cat ? cat.name : "Danh mục";
}

async function loadProducts() {
  await productStore.fetchProductbyCategoryId(
    categoryId.value,
    currentPage.value
  );
  totalPages.value = productStore.totalPages;
}

onMounted(async () => {
  await loadCategory(categoryId.value);
  await loadProducts();
});

watch(
  () => route.params.id,
  async (newId) => {
    if (newId) {
      categoryId.value = newId;
      currentPage.value = 1;
      await loadCategory(newId);
      await loadProducts();
    }
  }
);

async function changePage(page) {
  currentPage.value = page;
  await loadProducts();
}
</script>

<style scoped>
.error {
  color: red;
}
.product-item {
  margin-bottom: 1rem;
}
.pagination {
  margin-top: 1rem;
}
.pagination button {
  margin: 0 5px;
  padding: 5px 10px;
  cursor: pointer;
}
.pagination button.active {
  font-weight: bold;
  background-color: #f0f0f0;
}
</style>
