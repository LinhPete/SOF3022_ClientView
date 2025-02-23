import { defineStore } from "pinia";
import axiosInstance from "../axios/asios";

export const useOrders = defineStore("orders", {
  state: () => ({
    orders: [],
    loading: false,
    error: null,
    totalPages: 1,
  }),
  actions: {
    async fetchOrders(page = 0) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axiosInstance.get(`/store/orders`, {
          params: { page },
        });

        if (response.data) {
          this.orders = response.data.content || [];
          this.totalPages = response.data.totalPages || 1;
          return { success: true };
        }
        return { success: false, message: "Không có dữ liệu đơn hàng!" };
      } catch (error) {
        this.error =
          error.response?.data?.message || "Lỗi lấy danh sách đơn hàng!";
        return { success: false, message: this.error };
      } finally {
        this.loading = false;
      }
    },

    async createOrder(order) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axiosInstance.post(`/store/orders`, order);
        if (response.data) {
          return {
            success: true,
            message: "Tạo đơn hàng thành công!",
            data: response.data.result,
          };
        }
        return { success: false, message: "Không thể tạo đơn hàng!" };
      } catch (error) {
        this.error = error.response?.data?.message || "Lỗi tạo đơn hàng!";
        return { success: false, message: this.error };
      } finally {
        this.loading = false;
      }
    },

    async getOrderById(orderId) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axiosInstance.get(`/store/orders/${orderId}`);
        return response.data
          ? { success: true, data: response.data.result }
          : { success: false, message: "Không tìm thấy đơn hàng!" };
      } catch (error) {
        this.error = error.response?.data?.message || "Lỗi lấy đơn hàng!";
        return { success: false, message: this.error };
      } finally {
        this.loading = false;
      }
    },

    async confirmOrder(orderId) {
      return this.updateOrderStatus(orderId, "confirm", "Xác nhận đơn hàng");
    },

    async shipOrder(orderId) {
      return this.updateOrderStatus(
        orderId,
        "ship",
        "Chuyển đơn hàng sang trạng thái SHIPPING"
      );
    },

    async completeOrder(orderId) {
      return this.updateOrderStatus(orderId, "complete", "Hoàn tất đơn hàng");
    },

    async cancelOrder(orderId) {
      return this.updateOrderStatus(orderId, "cancel", "Hủy đơn hàng");
    },

    async updateOrderStatus(orderId, action, actionText) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axiosInstance.put(
          `/store/orders/${orderId}/${action}`
        );
        if (response.data) {
          return {
            success: true,
            message: `${actionText} thành công!`,
            data: response.data.result,
          };
        }
        return { success: false, message: `${actionText} thất bại!` };
      } catch (error) {
        this.error = error.response?.data?.message || `${actionText} gặp lỗi!`;
        return { success: false, message: this.error };
      } finally {
        this.loading = false;
      }
    },
  },
});
