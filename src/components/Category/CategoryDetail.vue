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
            <select v-model="selectedPrice">
              <option value="">GIÁ SẢN PHẨM</option>
              <option value="<150000">Dưới 150.000đ</option>
              <option value="150000-350000">Từ 150.000đ đến 350.000đ</option>
              <option value="350000-500000">Từ 350.000đ đến 500.000đ</option>
              <option value=">500000">Trên 500.000đ</option>
            </select>
          </label>
        </div>
        <div class="filter-item-size">
          <label>
            <select v-model="selectedSize">
              <option value="">KÍCH THƯỚC</option>
              <option value="S">Small</option>
              <option value="M">Medium</option>
              <option value="L">Large</option>
            </select>
          </label>
        </div>
        <div class="filter-item-popular">
          <label>
            <select v-model="selectedSort">
              <option value="">SẮP XẾP</option>
              <option value="A-Z">A-Z</option>
              <option value="price_asc">GIÁ TĂNG DẦN</option>
              <option value="price_desc">GIÁ GIẢM DẦN</option>
            </select>
          </label>
        </div>
      </div>
  
      <!-- Danh sách sản phẩm -->
      <div class="boxspto">
        <p v-if="productStore.loading">Đang tải...</p>
        <p v-if="productStore.error" class="error">{{ productStore.error }}</p>
        <div class="boxsp" v-if="!productStore.loading && !productStore.error">
          <div class="sp" v-for="product in productStore.products" :key="product.id">
            <router-link :to="`/product/${product.id}`">
              <img :src="product.image" :alt="product.name" />
            </router-link>
            <div class="price">{{ product.price }}đ</div>
            <h2>{{ product.name }}</h2>
          </div>
        </div>
      </div>
  
      <!-- Phân trang -->
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

const selectedPrice = ref("");
const selectedSize = ref("");
const selectedSort = ref("");
const currentPage = ref(1);
const totalPages = ref(1);
const categoryName = ref("Danh mục");

// Hàm chuyển đổi giá trị selectedPrice thành priceMin và priceMax
function parsePrice(priceString) {
  let priceMin = 0;
  // Sử dụng giá trị max lớn làm mặc định cho trường hợp ">" và không chọn
  let priceMax = 1000000000;
  if (priceString.startsWith("<")) {
    priceMax = parseInt(priceString.slice(1));
    priceMin = 0;
  } else if (priceString.startsWith(">")) {
    priceMin = parseInt(priceString.slice(1));
    priceMax = 1000000000;
  } else if (priceString.includes("-")) {
    const parts = priceString.split("-");
    priceMin = parseInt(parts[0]);
    priceMax = parseInt(parts[1]);
  }
  return { priceMin, priceMax };
}

// Hàm xử lý áp dụng các bộ lọc
async function applyFilters() {
  // Nếu có lựa chọn sắp xếp thì ưu tiên gọi hàm sắp xếp (lưu ý: store hiện không kết hợp sắp xếp với bộ lọc khác)
  if (selectedSort.value) {
    if (selectedSort.value === "A-Z") {
      await productStore.fetchProductByCategoryOrderByNameAsc(categoryId.value, currentPage.value);
    } else if (selectedSort.value === "price_asc") {
      await productStore.fetchProductByCategoryOrderByPriceAsc(categoryId.value, currentPage.value);
    } else if (selectedSort.value === "price_desc") {
      await productStore.fetchProductByCategoryOrderByPriceDesc(categoryId.value, currentPage.value);
    }
  } else if (selectedPrice.value || selectedSize.value) {
    // Nếu có bộ lọc theo giá và kích thước cùng lúc
    if (selectedPrice.value && selectedSize.value) {
      const { priceMin, priceMax } = parsePrice(selectedPrice.value);
      await productStore.fetchProductByCategorySizeAndPrice(
        categoryId.value,
        selectedSize.value,
        priceMin,
        priceMax,
        currentPage.value
      );
    } else if (selectedPrice.value) {
      // Chỉ lọc theo giá
      const { priceMin, priceMax } = parsePrice(selectedPrice.value);
      console.log({ priceMin, priceMax })
      await productStore.fetchProductByCategoryAndPrice(
        categoryId.value,
        priceMin,
        priceMax,
        currentPage.value
      );
    } else if (selectedSize.value) {
      // Chỉ lọc theo kích thước
      await productStore.fetchProductByCategoryAndSize(
        categoryId.value,
        selectedSize.value,
        currentPage.value
      );
    }
  } else {
    // Không có bộ lọc nào được chọn, gọi hàm mặc định theo danh mục
    await productStore.fetchProductbyCategoryId(categoryId.value, currentPage.value);
  }
  totalPages.value = productStore.totalPages;
}

async function loadCategory(id) {
  if (categoryStore.categories.length === 0) {
    await categoryStore.fetchCategory();
  }
  const cat = categoryStore.categories.find((category) => category.id == id);
  categoryName.value = cat ? cat.name : "Danh mục";
}

onMounted(async () => {
  await loadCategory(categoryId.value);
  await applyFilters();
});

// Nếu thay đổi route (chuyển danh mục) thì load lại category và sản phẩm
watch(
  () => route.params.id,
  async (newId) => {
    if (newId) {
      categoryId.value = newId;
      currentPage.value = 1;
      await loadCategory(newId);
      await applyFilters();
    }
  }
);

// Watch các bộ lọc, mỗi khi thay đổi sẽ đặt lại trang hiện tại và gọi applyFilters
watch([selectedPrice, selectedSize, selectedSort], async () => {
  currentPage.value = 1;
  await applyFilters();
});

// Hàm xử lý phân trang, mỗi khi chuyển trang sẽ gọi lại applyFilters
async function changePage(page) {
  currentPage.value = page;
  await applyFilters();
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
  display: flex;
  align-items: center;
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

.error {
  color: red;
}

.sp {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
}

.sp:hover {
  transform: scale(1.05) rotate(1deg);
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.3);
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
  box-shadow: 0px 0px 10px cyan, 0px 0px 40px rgba(64, 74, 74, 0.5);
}

.pagination-btn:hover {
  background: cyan;
  color: black;
  transform: scale(1.2) rotate(10deg);
  box-shadow: 0px 0px 20px cyan, 0px 0px 50px rgba(0, 255, 255, 0.288);
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
