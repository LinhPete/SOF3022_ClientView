<template>
  <hr />
  <div class="khungchuamenu">
    <div class="menu">
      <ul class="navbar">
        <li
          v-for="category in categoriesWithPath"
          :key="category.id"
          class="nav-item"
        >
          <router-link class="nav-link" :to="category.path">
            {{ category.name }}
          </router-link>
        </li>
      </ul>
    </div>
  </div>
  <hr />
</template>

<script setup>
import { onMounted, computed } from "vue";
import { useCategoryStore } from "../../stores/categoryStrore";
// Sử dụng store để truy xuất dữ liệu danh mục
const categoryStore = useCategoryStore();

// Lấy danh mục từ store khi component được mount
onMounted(() => {
  categoryStore.fetchCategory();
});

// Sử dụng computed để đảm bảo mỗi category có thuộc tính path
// Nếu không có path, tạo đường dẫn mặc định
const categoriesWithPath = computed(() =>
  categoryStore.categories.map((category) => ({
    ...category,
    path: category.path || `/category/${category.id}`, // Tạo đường dẫn mặc định
  }))
);
</script>

<style scoped>
.error {
  color: red;
}

.nav-item {
  font-weight: 20px;
  font-size: 25px;
}

hr {
  margin: 5px;
  height: 3px;
  border: none;
  background-color: black;
}
</style>
