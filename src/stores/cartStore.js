// cartStore.js
import { defineStore } from "pinia";
import axiosInstance from "../axios/asios";
import { useProductStore } from "../stores/productStore";
import { useToast } from "vue-toast-notification";

export const useCartStore = defineStore("cart", {
  state: () => ({
    cart: (() => {
      try {
        return JSON.parse(localStorage.getItem("cartInfo")) || [];
      } catch (e) {
        return [];
      }
    })(),
    userInfo: (() => {
      try {
        return JSON.parse(localStorage.getItem("userInfo")) || null;
      } catch (e) {
        return null;
      }
    })(),
    loading: false,
    error: null,
  }),
  getters: {
    totalCartItems(state) {
      return (state.cart ?? []).reduce(
        (total, item) => total + (item.quantity ?? 0),
        0
      );
    },
  },
  actions: {
    resetCart() {
      this.cart = [];
      localStorage.removeItem("cartInfo");
    },
    async addProductToCart(product) {
      this.loading = true;
      this.error = null;
      const Toast = useToast();
      const userInfo = this.userInfo;
      const userId = userInfo ? userInfo.id : null;

      if (!userId) {
        Toast.open({
          message: "Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng",
          type: "warning",
          durition: 2000,
          position: "top-left",
        });
        this.loading = false;
        return;
      }

      try {
        const existingItem = this.cart.find(
          (item) => item.productId === product.id
        );
        let updatedCart;
        if (existingItem) {
          existingItem.quantity += 1;
          // Dùng productId để so sánh trong map
          updatedCart = this.cart.map((item) =>
            item.productId === product.id
              ? { ...item, quantity: existingItem.quantity }
              : item
          );
        } else {
          const response = await axiosInstance.post("store/cart", {
            userId: userId,
            productId: product.id,
            quantity: 1,
          });
          const newCartItem = {
            id: response.data.result.id,
            productId: product.id,
            quantity: 1,
            name: product.name,
            price: product.price,
            image: product.image,
            amount: product.price,
            userId: userId,
          };
          updatedCart = [...this.cart, newCartItem];
        }
        this.cart = updatedCart;
        localStorage.setItem("cartInfo", JSON.stringify(this.cart));
        Toast.open({
          message: `Đã thêm ${product.name} vào giỏ hàng!`,
          type: "success",
          durition: 2000,
          position: "top-left",
        });
      } catch (error) {
        console.error("Error addProductToCart:", error);
        this.error = "Không thể thêm sản phẩm vào giỏ hàng";
      } finally {
        this.loading = false;
      }
    },

    async fetchCart() {
      this.loading = true;
      this.error = null;

      const storedCart = (() => {
        try {
          return JSON.parse(localStorage.getItem("cartInfo"));
        } catch (e) {
          return [];
        }
      })();
      if (Array.isArray(storedCart) && storedCart.length > 0) {
        this.cart = storedCart;
        this.loading = false;
        return;
      }

      const userInfo = this.userInfo;
      const userId = userInfo ? userInfo.id : null;
      if (!userId) {
        this.loading = false;
        this.error = "Bạn cần đăng nhập để xem giỏ hàng!";
        return;
      }

      try {
        const response = await axiosInstance.get(`store/cart/items/${userId}`);
        const cartItems = response.data.result;
        let cachedProducts = [];
        const storedProducts = localStorage.getItem("products");
        if (storedProducts) {
          try {
            cachedProducts = JSON.parse(storedProducts);
            // Vì products lưu ở dạng object phân trang, flatten chúng:
            cachedProducts = Object.values(cachedProducts).flat();
          } catch (e) {
            cachedProducts = [];
          }
        }
        const updatedCartItems = await Promise.all(
          cartItems.map(async (item) => {
            // Tìm sản phẩm theo productId
            let product = cachedProducts.find((p) => p.id === item.productId);
            if (!product) {
              const productStore = useProductStore();
              product = await productStore.fetchProductbyId(item.productId);
            }
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
        console.error("Error fetchCart:", error);
        this.error = "Không thể tải giỏ hàng";
        this.cart = [];
      } finally {
        this.loading = false;
      }
    },

    async updateQuantity(productId, delta) {
      const index = this.cart.findIndex((item) => item.productId === productId);
      if (index === -1) return;
      const newQuantity = this.cart[index].quantity + delta;
      if (newQuantity < 1) return;
      this.cart[index].quantity = newQuantity;
      // Nếu cần, tính lại amount
      this.cart[index].amount = this.cart[index].price * newQuantity;
      localStorage.setItem("cartInfo", JSON.stringify(this.cart));
    },

    async removeFromCart(index) {
      if (index < 0 || index >= this.cart.length) return;
      const cartId = this.cart[index].id;
      try {
        await axiosInstance.delete(`store/cart/${cartId}`);
        this.cart.splice(index, 1);
        localStorage.setItem("cartInfo", JSON.stringify(this.cart));
      } catch (error) {
        console.error("Lỗi khi xóa sản phẩm khỏi giỏ hàng:", error);
      }
    },

    async updateCart() {
      const storedCart = (() => {
        try {
          return JSON.parse(localStorage.getItem("cartInfo")) || [];
        } catch (e) {
          return [];
        }
      })();
      if (storedCart.length === 0) {
        console.warn("Giỏ hàng trống!");
        return;
      }
      try {
        const payload = {
          items: storedCart, // Mỗi item cần có { cartId, quantity } hoặc { productId, quantity }
        };
        const response = await axiosInstance.put(
          "store/cart/update-carts",
          payload
        );
        console.log("Checkout thành công:", response.data);
        localStorage.removeItem("cartInfo");
      } catch (error) {
        console.error("Lỗi khi thực hiện checkout:", error);
      }
    },
  },
});
