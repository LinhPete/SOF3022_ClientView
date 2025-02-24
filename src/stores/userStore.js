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
    setToken(token) {
      this.token = token;
      localStorage.setItem("token", token);
    },
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

    async googleSignIn() {
      const Toast = useToast();
      try {
        // Chuyển hướng người dùng để đăng nhập với Google
        window.location.href =
          "http://localhost:8080/store/login/oauth2/authorization/google";
      } catch (error) {
        Toast.error("Đăng nhập thất bại!");
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
        return true;
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
        this.userInfo = null;
        return false;
      }
    },

    // Đăng xuất
    async logout() {
      try {
        const Toast = useToast();
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
      } catch (error) {
        console.error("Lỗi khi đăng xuất:", error);
      }
    },
    async updateUser(id, request) {
      try {
        if (!this.token) {
          return;
        }
        console.log(request);
        const response = await axiosInstance.put(`/store/users/${id}`, request);

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
    async forgotPassword(email) {
      try {
        await axiosInstance.get(`/store/reset-password/request?email=${email}`);
        return true;
      } catch (error) {
        return false;
      }
    },
    async resetPassword(password, token) {
      try {
        console.log(password);
        console.log(token);
        await axiosInstance.post(`/store/reset-password/reset`, null, {
          params: {
            newPassword: password,
            token: token,
          },
        });
        return true;
      } catch (error) {
        return false;
      }
    },
    async updateAvatar(userId, file) {
      this.loading = true;
      this.error = null;
      let response;
      try {
        const formData = new FormData();
        formData.append("avatar", file.get("avatar"));
        response = await axiosInstance.post(
          `/store/users/upload-avatar/${userId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (response.data.code === 0) {
          return response.data.result;
        } else {
          this.error = response.data.message;
          return this.error;
        }
      } catch (error) {
        alert("Lỗi API:", error.message);
        return null;
      } finally {
        this.loading = false;
      }
    },
  },
});
