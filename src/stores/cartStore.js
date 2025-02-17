import { defineStore } from "pinia";
import axiosInstance from "../axios/asios";
import { useProductStore } from "../stores/productStore";
// const productStore = useProductStore();
export const useCartStore = defineStore("cart", {
  state: () => ({
    cart: JSON.parse(localStorage.getItem("cartInfo")) || [], // Load từ localStorage
    userInfo: JSON.parse(localStorage.getItem("userInfo")) || null,
    loading: false,
    error: null,
  }),
  getters: {
    // Tính tổng số sản phẩm trong giỏ hàng
    totalCartItems(state) {
      return (state.cart ?? []).reduce(
        (total, item) => total + (item.quantity ?? 0),
        0
      );
    },
  },
  actions: {
    async addProductToCart(product) {
      this.loading = true;
      this.error = null;

      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const userId = userInfo ? userInfo.id : null;

      if (!userId) {
        alert("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng!");
        return;
      }

      try {
        const existingItem = this.cart.find((item) => item.id === product.id);
        let updatedCart;
        if (existingItem) {
          existingItem.quantity += 1;
          await axiosInstance.put("store/cart/items", {
            userId: userId,
            productId: product.id,
            quantity: existingItem.quantity,
          });
          updatedCart = this.cart.map((item) =>
            item.id === product.id
              ? { ...item, quantity: existingItem.quantity }
              : item
          );
        } else {
          await axiosInstance.post("store/cart/items", {
            userId: userId,
            productId: product.id,
            quantity: 1,
          });
          updatedCart = [...this.cart, { ...product, quantity: 1 }];
        }
        this.cart = updatedCart;
        localStorage.setItem("cartInfo", JSON.stringify(this.cart));
        alert(`Đã thêm ${product.name} vào giỏ hàng!`);
        console.log(`Đã thêm ${product.name} vào giỏ hàng!`);
      } catch (error) {
        this.error = "Không thể thêm sản phẩm vào giỏ hàng";
      } finally {
        this.loading = false;
      }
    },

    async fetchCart() {
      this.loading = true;
      this.error = null;

      // Kiểm tra nếu đã có cart trong localStorage thì không cần gọi API
      const storedCart = JSON.parse(localStorage.getItem("cartInfo"));
      // Nếu `storedCart` tồn tại nhưng là mảng rỗng, không gọi API
      if (Array.isArray(storedCart) && storedCart.length > 0) {
        this.cart = storedCart;
        this.loading = false;
        return;
      }

      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const userId = userInfo ? userInfo.id : null;

      if (!userId) {
        this.loading = false;
        this.error = "Bạn cần đăng nhập để xem giỏ hàng!";
        return;
      }

      try {
        const response = await axiosInstance.get(`store/cart/items/${userId}`);
        const cartItems = response.data.result;

        const updatedCartItems = await Promise.all(
          cartItems.map(async (item) => {
            const productStore = useProductStore();
            const product = await productStore.fetchProductbyId(item.productId);
            return {
              ...item,
              name: product?.name || "Sản phẩm không tồn tại",
              image: product?.image || "",
              price: product?.price || 0,
            };
          })
        );

        this.cart = updatedCartItems;
        localStorage.setItem("cartInfo", JSON.stringify(this.cart));
      } catch (error) {
        this.error = "Không thể tải giỏ hàng";
        this.cart = [];
      } finally {
        this.loading = false;
      }
    },
    async logout() {
      try {
        const token = localStorage.getItem("token"); // Lấy token từ localStorage

        if (token) {
          // Gọi API logout từ server
          await axiosInstance.post("store/auth/logout", { token });
          localStorage.removeItem("userInfo");
          localStorage.removeItem("token");
          localStorage.removeItem("cartInfo");
          this.cart = [];
          this.userInfo = null;
          window.location.reload();
          console.log("Đã đăng xuất thành công.");
        } else {
          console.log("Không có token để đăng xuất.");
        }
      } catch (error) {
        console.error("Lỗi khi đăng xuất:", error);
      }
    },

    async updateQuantity(index, newQuantity) {
      if (newQuantity < 1) return;
      const item = this.cart[index];
      if (!item) return;

      if (!this.userInfo || !this.userInfo.id) {
        console.error("Lỗi: Không tìm thấy thông tin người dùng.");
        return;
      }
      try {
        await axiosInstance.post("store/cart/items", {
          userId: this.userInfo.id,
          productId: item.productId,
          quantity: newQuantity,
        });
        item.quantity = newQuantity;
        localStorage.setItem("cartInfo", JSON.stringify(this.cart));
      } catch (error) {
        console.error("Lỗi khi cập nhật số lượng sản phẩm:", error);
      }
    },

    removeFromCart(index) {
      if (index < 0 || index >= this.cart.length) return;
      // Xóa sản phẩm khỏi giỏ hàng
      this.cart.splice(index, 1);
      // Nếu giỏ hàng trống, xóa luôn khỏi localStorage
      localStorage.setItem("cartInfo", JSON.stringify(this.cart));
      // if (this.cart.length === 0) {
      //   localStorage.removeItem("cartInfo");
      // } else {
      //   localStorage.setItem("cartInfo", JSON.stringify(this.cart));
      // }
    },
  },
});
