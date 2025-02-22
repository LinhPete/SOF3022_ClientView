import { defineStore } from "pinia";
import axiosInstance from "../axios/asios";

export const useProductStore = defineStore("products", {
  state: () => ({
    products: (() => {
      try {
        return JSON.parse(localStorage.getItem("products")) || {};
      } catch (e) {
        return {};
      }
    })(),
    product: null,
    loading: false,
    error: null,
  }),

  actions: {
    async resetProduct() {
      this.products = {};
      this.product = null;
      localStorage.removeItem("products");
    },

    // Lấy danh sách sản phẩm theo trang
    async fetchProduct(page = 1) {
      if (this.products[page]) {
        return;
      }

      this.loading = true;
      this.error = null;

      try {
        const response = await axiosInstance.get(`/store/products?page=${page}`);
        const productsData = response.data.result || [];

        this.products = { ...this.products, [page]: productsData };
        localStorage.setItem("products", JSON.stringify(this.products));
      } catch (error) {
        this.error = "Không thể tải danh sách sản phẩm";
        console.error("Lỗi fetchProduct:", error);
      } finally {
        this.loading = false;
      }
    },

    // Lấy sản phẩm theo ID
    async fetchProductbyId(productId) {
      if (!productId || isNaN(productId)) {
        console.error("fetchProductbyId nhận ID không hợp lệ:", productId);
        return null;
      }
    
      try {
        const response = await axiosInstance.get(`/store/products/${productId}`);
        this.product = response.data.result;
        return this.product;
      } catch (error) {
        console.error(`Lỗi khi lấy sản phẩm ID: ${productId}`, error);
        this.error = "Không thể lấy sản phẩm";
        return null;
      }
    }
    
    
  },
});
