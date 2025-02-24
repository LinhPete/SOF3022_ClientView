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
      this.products = [];
      this.error = null;
      localStorage.removeItem("products");
    },

    async fetchProduct(page = 1) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axiosInstance.get(
          `/store/products?page=${page}`
        );
        if (response) {
          this.products = response.data.content;
          this.totalPages = response.data.totalPages;
          localStorage.setItem("products", JSON.stringify(this.products));
        } else {
          return { message: "Không thấy sản phẩm", products: [] };
        }
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

    // Lấy sản phẩm theo danh mục
    async fetchProductbyCategoryId(categoryId, page = 1) {
      this.loading = true;
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
        this.error = "Không thể tải sản phẩm theo danh mục";
      } finally {
        this.loading = false;
      }
    },

    // Lấy sản phẩm theo khoảng giá toàn cục
    async fetchProductByPriceRange(priceMin, priceMax, page = 1) {
      this.loading = true;
      try {
        const response = await axiosInstance.get(
          `/store/products/search/price?priceMin=${priceMin}&priceMax=${priceMax}&pageNum=${page}`
        );
        if (response) {
          this.products = response.data.content;
          this.totalPages = response.data.totalPages;
        }
      } catch (error) {
        console.error("Lỗi khi fetch sản phẩm theo khoảng giá:", error);
        this.error = "Không thể tải sản phẩm theo khoảng giá";
      } finally {
        this.loading = false;
      }
    },

    // Lấy sản phẩm theo danh mục và khoảng giá
    async fetchProductByCategoryAndPrice(
      categoryId,
      priceMin,
      priceMax,
      page = 1
    ) {
      this.loading = true;
      try {
        const response = await axiosInstance.get(
          `/store/products/search/category/${categoryId}/price?priceMin=${priceMin}&priceMax=${priceMax}&pageNum=${page}`
        );
        if (response) {
          this.products = response.data.content;
          this.totalPages = response.data.totalPages;
        }
      } catch (error) {
        console.error(
          "Lỗi khi fetch sản phẩm theo danh mục và khoảng giá:",
          error
        );
        this.error = "Không thể tải sản phẩm theo khoảng giá và danh mục";
      } finally {
        this.loading = false;
      }
    },

    // Lấy sản phẩm theo danh mục và kích thước
    async fetchProductByCategoryAndSize(categoryId, size, page = 1) {
      this.loading = true;
      try {
        const response = await axiosInstance.get(
          `/store/products/search/category/${categoryId}/size?size=${size}&pageNum=${page}`
        );
        if (response) {
          this.products = response.data.content;
          this.totalPages = response.data.totalPages;
        }
      } catch (error) {
        console.error(
          "Lỗi khi fetch sản phẩm theo danh mục và kích thước:",
          error
        );
        this.error = "Không thể tải sản phẩm theo kích thước và danh mục";
      } finally {
        this.loading = false;
      }
    },

    // Lấy sản phẩm theo danh mục, kích thước và khoảng giá
    async fetchProductByCategorySizeAndPrice(
      categoryId,
      size,
      priceMin,
      priceMax,
      page = 1
    ) {
      this.loading = true;
      try {
        const response = await axiosInstance.get(
          `/store/products/search/category/${categoryId}/filter?size=${size}&priceMin=${priceMin}&priceMax=${priceMax}&pageNum=${page}`
        );
        if (response) {
          this.products = response.data.content;
          this.totalPages = response.data.totalPages;
        }
      } catch (error) {
        console.error(
          "Lỗi khi fetch sản phẩm theo danh mục, kích thước và khoảng giá:",
          error
        );
        this.error = "Không thể tải sản phẩm theo các tiêu chí lọc";
      } finally {
        this.loading = false;
      }
    },

    // Lấy sản phẩm theo danh mục, sắp xếp theo tên A-Z
    async fetchProductByCategoryOrderByNameAsc(categoryId, page = 1) {
      this.loading = true;
      try {
        const response = await axiosInstance.get(
          `/store/products/sort/name/asc/${categoryId}?pageNum=${page}`
        );
        if (response) {
          this.products = response.data.content;
          this.totalPages = response.data.totalPages;
        }
      } catch (error) {
        console.error(
          "Lỗi khi fetch sản phẩm theo danh mục sắp xếp tên A-Z:",
          error
        );
        this.error = "Không thể tải sản phẩm sắp xếp theo tên";
      } finally {
        this.loading = false;
      }
    },

    // Lấy sản phẩm theo danh mục, sắp xếp theo tên Z-A
    async fetchProductByCategoryOrderByNameDesc(categoryId, page = 1) {
      this.loading = true;
      try {
        const response = await axiosInstance.get(
          `/store/products/sort/name/desc/${categoryId}?pageNum=${page}`
        );
        if (response) {
          this.products = response.data.content;
          this.totalPages = response.data.totalPages;
        }
      } catch (error) {
        console.error(
          "Lỗi khi fetch sản phẩm theo danh mục sắp xếp tên Z-A:",
          error
        );
        this.error = "Không thể tải sản phẩm sắp xếp theo tên";
      } finally {
        this.loading = false;
      }
    },
    async fetchProductByCategoryOrderByPriceAsc(categoryId, page = 1) {
      this.loading = true;
      try {
        const response = await axiosInstance.get(
          `/store/products/search/category/${categoryId}/sort/price/asc?pageNum=${page}`
        );
        if (response) {
          this.products = response.data.content;
          this.totalPages = response.data.totalPages;
        }
      } catch (error) {
        console.error(
          "Lỗi khi fetch sản phẩm theo danh mục sắp xếp giá tăng dần:",
          error
        );
        this.error = "Không thể tải sản phẩm theo giá";
      } finally {
        this.loading = false;
      }
    },
    // Lấy sản phẩm theo danh mục, sắp xếp theo giá giảm dần
    async fetchProductByCategoryOrderByPriceDesc(categoryId, page = 1) {
      this.loading = true;
      try {
        const response = await axiosInstance.get(
          `/store/products/search/category/${categoryId}/sort/price/desc?pageNum=${page}`
        );
        if (response) {
          this.products = response.data.content;
          this.totalPages = response.data.totalPages;
        }
      } catch (error) {
        console.error(
          "Lỗi khi fetch sản phẩm theo danh mục sắp xếp giá giảm dần:",
          error
        );
        this.error = "Không thể tải sản phẩm theo giá";
      } finally {
        this.loading = false;
      }
    },
  },
});
