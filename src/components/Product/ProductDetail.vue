<template>
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
  await productStore.fetchProductbyId(route.params.id);
});
</script>
