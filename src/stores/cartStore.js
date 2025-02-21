import { defineStore } from "pinia";
import axiosInstance from "../axios/asios";
import { useProductStore } from "../stores/productStore";
import { useToast } from "vue-toast-notification";
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
    resetCart() {
      this.cart = [];
      localStorage.removeItem("cartInfo");
    },
    async addProductToCart(product) {
      this.loading = true;
      this.error = null;
      const Toast = useToast();
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const userId = userInfo ? userInfo.id : null;

      if (!userId) {
        Toast.open({
          message: "Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng",
          type: "warning",
          durition: 2000,
          position: "top-left",
        });
        return;
      }

      try {
        const existingItem = this.cart.find(
          (item) => item.productId === product.id
        );
        let updatedCart;
        if (existingItem) {
          existingItem.quantity += 1;
          updatedCart = this.cart.map((item) =>
            item.id === product.id
              ? { ...item, quantity: existingItem.quantity }
              : item
          );
        } else {
          await axiosInstance.post("store/cart", {
            userId: userId,
            productId: product.id,
            quantity: 1,
          });
          updatedCart = [...this.cart, { ...product, quantity: 1 }];
        }
        this.cart = updatedCart;
        localStorage.setItem("cartInfo", JSON.stringify(this.cart));
        alert(`Đã thêm ${product.name} vào giỏ hàng!`);
      } catch (error) {
        this.error = "Không thể thêm sản phẩm vào giỏ hàng";
      } finally {
        this.loading = false;
      }
    },

    async fetchCart() {
      this.loading = true;
      this.error = null;

      // Nếu có giỏ hàng lưu trong localStorage, sử dụng nó ngay
      const storedCart = JSON.parse(localStorage.getItem("cartInfo"));
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
        // Thay vì gọi productStore.fetchProductbyId cho từng item (gọi API nhiều lần),
        // hãy lấy danh sách sản phẩm từ localStorage (nếu có) để tìm thông tin sản phẩm
        let cachedProducts = [];
        const storedProducts = localStorage.getItem("products");
        if (storedProducts) {
          cachedProducts = JSON.parse(storedProducts);
        }
        // Nếu không có cache, bạn có thể gọi API qua productStore.fetchProductbyId
        const updatedCartItems = await Promise.all(
          cartItems.map(async (item) => {
            // Tìm sản phẩm trong cachedProducts theo productId
            let product = cachedProducts.find((p) => p.id === item.productId);
            if (!product) {
              // Nếu không có trong cache, gọi API từ productStore
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
        this.error = "Không thể tải giỏ hàng";
        this.cart = [];
      } finally {
        this.loading = false;
      }
    },

    async updateQuantity(productId, delta) {
      // Tìm chỉ số của mục có productId tương ứng
      const index = this.cart.findIndex((item) => item.productId === productId);
      if (index === -1) return;
      const newQuantity = this.cart[index].quantity + delta;
      if (newQuantity < 1) return;
      this.cart[index].quantity = newQuantity;
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
      const storedCart = JSON.parse(localStorage.getItem("cartInfo")) || [];
      if (storedCart.length === 0) {
        console.warn("Giỏ hàng trống!");
        return;
      }
      try {
        const payload = {
          items: storedCart, // Mỗi item cần có ít nhất { cartId, quantity } để API cập nhật
        };
        const response = await axiosInstance.put(
          "store/cart/update-carts",
          payload
        );
        console.log("Checkout thành công:", response.data);
        // Sau khi cập nhật thành công, bạn có thể xóa giỏ hàng khỏi store và localStorage
        this.cart = [];
      } catch (error) {
        console.error("Lỗi khi thực hiện checkout:", error);
      }
    },
  },
});
