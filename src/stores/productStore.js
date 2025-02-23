import { defineStore } from "pinia";
import axiosInstance from "../axios/asios";

export const useProductStore = defineStore("products", {
  state: () => ({
    products: [],
    loading: false,
    error: null,
    totalPages: null,
  }),

  actions: {
    resetProduct() {
      this.products = {};
      this.product = null;
      localStorage.removeItem("products");
    },

    async fetchProduct(page = 1) {
      this.loading = true;
      this.error = null;

      try {
        const response = await axiosInstance.get(
          `/store/products?page=${page}`,
          {
            params: {
              page: page,
            },
          }
        );
        if (response) {
          this.products = response.data.content;
          this.totalPages = response.data.totalPages;
        } else {
          return { message: "Không thấy sản phẩm", products: [] };
        }

        localStorage.setItem("products", JSON.stringify(this.products));
      } catch (error) {
        this.error = "Không thể tải danh sách sản phẩm";
        console.error("Lỗi fetchProduct:", error);
      } finally {
        this.loading = false;
      }
    },

    // Lấy sản phẩm theo ID (không cache theo trang)
    async fetchProductbyId(productId) {
      if (!productId || isNaN(productId)) {
        console.error("fetchProductbyId nhận ID không hợp lệ:", productId);
        return null;
      }

      try {
        const response = await axiosInstance.get(
          `/store/products/${productId}`
        );
        return response.data.result;
      } catch (error) {
        console.error(`Lỗi khi lấy sản phẩm ID: ${productId}`, error);
        this.error = "Không thể lấy sản phẩm";
        return null;
      }
    },
    async fetchProductbyCategoryId(categoryId, page = 1) {
      try {
        const response = await axiosInstance.get(
          `/store/products/search/category/${categoryId}?pageNum=${page}`
        );
        if (response) {
          this.products = response.data.content;
          this.totalPages = response.data.totalPages;
        } else {
          return { message: "Category này không có sản phẩm", products: [] };
        }
      } catch (error) {
        console.error("Lỗi khi fetch sản phẩm theo category:", error);
      }
    },
  },
});
