import { defineStore } from "pinia";
import axiosInstance from "../axios/asios";

export const usePaymentStore = defineStore("payment", {
  state: () => ({
    paymentResult: null,
    paymentError: null,
    errorMessage: null,
  }),
  actions: {
    async createPayment(paymentData) {
      try {
        isLoading.value = true;
        const response = await axiosInstance.get("/payment/vn-pay", {
          params: paymentData,
        });
        if (
          response.data &&
          response.data.code === "ok" &&
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
        errorMessage.value = "Lỗi khi tạo thanh toán VNPay";
        console.error(error);
      } finally {
        isLoading.value = false;
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
        isLoading.value = true;
        const { vnp_ResponseCode, vnp_TxnRef } = queryParams;
        const response = await axiosInstance.get("/payment/vn-pay-callback", {
          params: { vnp_ResponseCode, vnp_TxnRef },
        });
        if (response.data && response.data.result) {
          paymentResult.value = response.data.result;
          alert("Thanh toán thành công! Đơn hàng của bạn đã được hoàn tất.");
        } else {
          alert("Thanh toán thất bại!");
        }
        router.push("/"); // Điều hướng về trang chủ
      } catch (error) {
        errorMessage.value = "Lỗi khi xử lý callback thanh toán";
        console.error(error);
      } finally {
        isLoading.value = false;
      }
    },
  },
});
