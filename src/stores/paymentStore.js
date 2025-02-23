import { defineStore } from "pinia";
import axiosInstance from "../axios/asios";

export const usePaymentStore = defineStore("payment", {
  state: () => ({
    paymentResult: null,
    paymentError: null,
    errorMessage: null,
    isLoading: false,
  }),
  actions: {
    async createPayment(paymentData) {
      try {
        this.isLoading = true;
        const response = await axiosInstance.get("/store/payment/vn-pay", {
          params: {
            amount: paymentData.amount,
            bankCode: paymentData.bankCode,
            orderId: paymentData.orderId,
          },
        });
        if (
          response.data &&
          response.data.code === 0 &&
          response.data.result
        ) {
          const paymentUrl =
            response.data.result.paymentUrl || response.data.result;
          window.location.href = paymentUrl; // Chuyển hướng đến VNPay
        } else {
          errorMessage.value =
            response.data.message || "Không thể tạo thanh toán VNPay";
        }
      } catch (error) {
        this.errorMessage = "Lỗi khi tạo thanh toán VNPay";
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },
    /**
     * handlePaymentCallback:
     * Xử lý callback từ VNPay khi thanh toán hoàn tất.
     * Endpoint /payment/vn-pay-callback trả về thông tin đơn hàng nếu thanh toán thành công.
     * Sau đó, chuyển hướng về trang chủ với thông báo cho khách hàng.
     */
    async handlePaymentCallback(queryParams) {
      try {
        this.isLoading = true;
        const { vnp_ResponseCode, vnp_TxnRef } = queryParams;
        const response = await axiosInstance.get(
          "/store/payment/vn-pay-callback",
          {
            params: { vnp_ResponseCode, vnp_TxnRef },
          }
        );
        if (response.data && response.data.result) {
            this.paymentResult = response.data.result;
          alert("Thanh toán thành công! Đơn hàng của bạn đã được hoàn tất.");
        } else {
          alert("Thanh toán thất bại!");
        }
        router.push("/"); // Điều hướng về trang chủ
      } catch (error) {
        this.errorMessage = "Lỗi khi xử lý callback thanh toán";
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },
  },
});
