import { defineStore } from "pinia";
import axiosInstance from "../axios/asios";

export const useReviewStore = defineStore("reviewStore", {
  state: () => ({
    reviews: [],
    loading: false,
    error: null,
    totalPages:1
  }),
  actions: {
    async fetchReviews(productId, page = 1) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axiosInstance.get(
          `/store/reviews/${productId}`,
          {
            params: {
                page : page
            },
          }
        );
        if (response.data) {
          this.reviews = response.data.content;
          this.totalPages = response.data.totalPages;
        } else {
          this.error = "Không có đánh giá nào!";
        }
      } catch (error) {
        this.error = "Lỗi kết nối đến máy chủ!";
      } finally {
        this.loading = false;
      }
    },

    async addReview(productId, reviewData) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axiosInstance.post("/store/reviews", {
          productId,
          ...reviewData,
        });
        if (response.data.code === 0) {
          return { success: true, message: "Gửi đánh giá thành công!" };
        } else {
          return { success: false, message: "Gửi đánh giá thất bại!" };
        }
      } catch (error) {
        return { success: false, message: "Lỗi kết nối đến máy chủ!" };
      } finally {
        this.loading = false;
      }
    },
  },
});
