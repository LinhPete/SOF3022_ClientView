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
            v-for="product in productsByCategory"
            :key="product.id"
          >
            <div class="sale">{{ product.discount }}%</div>
            <router-link :to="`/product/${product.id}`">
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
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useCategoryStore } from "../../stores/categoryStrore";
import { useProductStore } from "../../stores/productStore";

const route = useRoute();
const categoryId = ref(route.params.id || "");

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

const productsByCategory = computed(() => {
  let allProducts = [];
  const prods = productStore.products;
  if (prods && typeof prods === "object" && !Array.isArray(prods)) {
    allProducts = Object.values(prods).flat();
  } else if (Array.isArray(prods)) {
    allProducts = prods;
  }

  return allProducts.filter(
    (product) => product.categoryId == categoryId.value
  );
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
<style scoped>
.error {
  color: red;
}
.product-item {
  margin-bottom: 1rem;
}
</style>
