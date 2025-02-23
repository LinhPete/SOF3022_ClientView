// import { defineStore } from "pinia";
// import axiosInstance from "../axios/asios";

// export const useCartStore = defineStore("cart", {
//   state: () => ({
//     cart: [],
//     loading: false,
//     error: null,
//     userInfo: JSON.parse(localStorage.getItem("userInfo")) || null,
//   }),
//   actions: {
//     async checkout() {
//       try {
//         const userInfo = JSON.parse(localStorage.getItem("userInfo"));
//         if (!userInfo) {
//           alert("Bạn cần đăng nhập để thanh toán!");
//           return;
//         }

//         await axiosInstance.post("store/cart/checkout", {
//           userId: userInfo.id,
//         });

//         this.cart = []; // Xóa giỏ hàng sau khi thanh toán
//         localStorage.removeItem("cartInfo");

//         alert("Thanh toán thành công!");
//       } catch (error) {
//         alert("Thanh toán thất bại, vui lòng thử lại!");
//       }
//     },
//   },
// });
