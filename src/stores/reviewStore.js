import { defineStore } from "pinia";
import axiosInstance from "../axios/asios";

export const useReviewStore = defineStore("reviewStore", {
    state: () => ({
        reviews: [],
        loading: false,
        error: null,
    }),
    actions: {
        async fetchReviews(productId) {
            this.loading = true;
            this.error = null;
            try {
                const response = await axiosInstance.get(
                    `/store/reviews/${productId}`
                );
                if (response.data.code === 0) {
                    this.reviews = response.data.result;
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
