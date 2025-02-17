import { defineStore } from "pinia";
import axiosInstance from "../axios/asios";

export const useUserStore = defineStore("user", {
  state: () => ({
    userInfo: JSON.parse(localStorage.getItem("userInfo")) || null,
    token: localStorage.getItem("token") || null,
    message: "",
  }),

  actions: {
    // Xử lý đăng nhập
    async handleLogin(email, password) {
      try {
        const response = await axiosInstance.post("/store/auth/token", {
          email,
          password,
        });

        const token = response.data.result.token;
        this.token = token;
        localStorage.setItem("token", token);

        this.message = "Đăng nhập thành công!";

        // Lấy thông tin người dùng sau khi đăng nhập
        await this.fetchUserInfo();
        return true;
      } catch (error) {
        this.message = error.response?.data?.message || "Đăng nhập thất bại!";
        console.error("Lỗi khi đăng nhập:", error);
        return false;
      }
    },

    // Đăng ký và tự động đăng nhập
    async registerAndLogin(userInfo) {
      try {
        console.log("Bắt đầu đăng ký...");
        const registerResponse = await axiosInstance.post(
          "/store/users",
          userInfo
        );

        if (registerResponse.data) {
          // Đăng ký thành công, tiến hành đăng nhập
          return await this.handleLogin(userInfo.email, userInfo.password);
        } else {
          throw new Error("Đăng ký không thành công.");
        }
      } catch (error) {
        console.error("Lỗi khi đăng ký:", error);
        return false;
      }
    },

    // Lấy thông tin người dùng
    async fetchUserInfo() {
      try {
        if (!this.token) {
          console.warn("Không có token, không thể lấy thông tin người dùng.");
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
    logout() {
      this.token = null;
      this.userInfo = null;
      localStorage.removeItem("token");
      localStorage.removeItem("userInfo");
    },
  },
});
