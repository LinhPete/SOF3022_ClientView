import { defineStore } from "pinia";
import axiosInstance from "../axios/asios";
export const useProductStore = defineStore("products", {
  state: () => ({
    products: JSON.parse(localStorage.getItem("products")) || [],
    product: null,
  }),
  actions: {
    async resetProduct() {
      this.product = [];
      localStorage.removeItem("products");
    },
    // Hàm lấy danh sách product
    async fetchProduct() {
      if (this.products && this.products.length > 0) return;
      this.loading = true;
      this.error = null;

      try {
        const response = await axiosInstance.get("/store/products");
        this.products = response.data.result;
        localStorage.setItem("products", JSON.stringify(this.products));
      } catch (error) {
        this.error = "Không thể tải danh sách sản phẩm ";
      } finally {
        this.loading = false;
      }
    },
    async fetchProductbyId(productId) {
      const cachedProduct = this.products.find((p) => p.id === productId);
      if (cachedProduct) {
        this.product = cachedProduct;
        return cachedProduct;
      }

      try {
        console.log("Fetching product with id:", productId);
        const response = await axiosInstance.get(
          `/store/products/${productId}`
        );
        const product = response.data.result || null;
        if (product) {
          // Thêm sản phẩm vừa lấy được vào mảng products để cache
          this.products.push(product);
          localStorage.setItem("products", JSON.stringify(this.products));
          this.product = product;
        }
        return product;
      } catch (error) {
        console.error(`Lỗi khi lấy sản phẩm ID: ${productId}`, error);
        return null;
      }
    },
  },
});
