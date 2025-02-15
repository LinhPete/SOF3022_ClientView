import { defineStore } from "pinia";
import axiosInstance from "../axios/asios";
export const useProductStore = defineStore("products", {
  state: () => ({
    products: [],
    product: null,
    loading: false,
    error: null,
  }),
  actions: {
    // Hàm lấy danh sách product
    async fetchProduct() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axiosInstance.get("/store/products");
        this.products = response.data.result;
      } catch (error) {
        this.error = "Không thể tải danh sách sản phẩm ";
      } finally {
        this.loading = false;
      }
    },
    async fetchProductbyId(id) {
      try {
        const response = await axiosInstance.get(`/store/products/${id}`);
        this.product = response.data.result || null; // Trả về `null` nếu sản phẩm không tồn tại
      } catch (error) {
        console.error(`Lỗi khi lấy sản phẩm ID: ${id}`, error);
        return null;
      }
    },
  },
});
