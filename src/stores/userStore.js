import { defineStore } from "pinia";
import axiosInstance from "../axios/asios";
import { useToast } from "vue-toast-notification";
import { useCartStore } from "./cartStore";
import { useProductStore } from "./productStore";
export const useUserStore = defineStore("user", {
  state: () => ({
    userInfo: JSON.parse(localStorage.getItem("userInfo")) || null,
    token: localStorage.getItem("token") || null,
    message: "",
  }),

  actions: {
    // Xử lý đăng nhập
    async handleLogin(email, password) {
      const Toast = useToast();
      try {
        const response = await axiosInstance.post("/store/auth/token", {
          email,
          password,
        });
        const token = response.data.result.token;
        this.token = token;
        localStorage.setItem("token", token);
        // Lấy thông tin người dùng sau khi đăng nhập
        await this.fetchUserInfo();
        return true;
      } catch (error) {
        this.message = error.response?.data?.message || "Đăng nhập thất bại!";
        Toast.open({
          message: "Đăng nhập thất bại sai thông tin.Vui lòng nhập lại",
          type: "error",
          duration: 2000,
          position: "top-right",
        });
        console.error("Lỗi khi đăng nhập:", error);
        return false;
      }
    },

    async googleSignIn(googleToken) {
      const Toast = useToast();
      try {
        const response = await axiosInstance.post("/store/auth/google", {
          token: googleToken,
        });
        const { token, user } = response.data;

        this.token = token;
        this.userInfo = user;
        localStorage.setItem("token", token);
        localStorage.setItem("userInfo", JSON.stringify(user));

        Toast.open({
          message: "Đăng nhập thành công!",
          type: "success",
          duration: 3000,
          position: "top-right",
        });
      } catch (error) {
        Toast.open({
          message: "Đăng nhập thất bại!",
          type: "error",
          duration: 3000,
          position: "top-right",
        });
        console.error("Google SSO Error:", error);
      }
    },

    // Đăng ký và tự động đăng nhập
    async registerAndLogin(userInfo) {
      try {
        const registerResponse = await axiosInstance.post(
          "/store/users",
          userInfo
        );
        if (registerResponse.data) {
          return await this.handleLogin(userInfo.email, userInfo.password);
        } else {
          throw new Error("Đăng ký không thành công.");
        }
      } catch (error) {
        return false;
      }
    },

    // Lấy thông tin người dùng
    async fetchUserInfo() {
      try {
        if (!this.token) {
          return;
        }
        const response = await axiosInstance.get("/store/users/myInfo", {
          headers: { Authorization: `Bearer ${this.token}` },
        });

        if (response.data && response.data.result) {
          this.userInfo = response.data.result;
          localStorage.setItem("userInfo", JSON.stringify(this.userInfo));
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
        this.userInfo = null;
      }
    },

    // Đăng xuất
    async logout() {
      try {
        const token = localStorage.getItem("token"); // Lấy token từ localStorage
        const Toast = useToast();
        if (token) {
          Toast.open({
            message: "Bạn đã đăng xuất",
            type: "success",
            duration: 1500,
            position: "top-right",
          });
          localStorage.removeItem("userInfo");
          localStorage.removeItem("token");
          const cartStore = useCartStore();
          const productStore = useProductStore();
          productStore.resetProduct();
          cartStore.resetCart();
          this.userInfo = null;
        } else {
          console.log("Không có token để đăng xuất.");
        }
      } catch (error) {
        console.error("Lỗi khi đăng xuất:", error);
      }
    },
    async updateUser(updateData) {
      try {
        if (!this.token) {
          return;
        }
        const response = await axiosInstance.put(
          `/store/users/${this.userId}`,
          {
            updateData,
          }
        );

        if (response.data && response.data.result) {
          this.userInfo = response.data.result;
          localStorage.setItem("userInfo", JSON.stringify(this.userInfo));
          return true;
        }
        return false;
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
        this.userInfo = null;
      }
    },
  },
});
