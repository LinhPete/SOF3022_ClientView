<template>
  <div class="order-list-container">
    <h2>Đơn Hàng</h2>
    <!-- Grid hiển thị card cho từng đơn hàng với hiệu ứng fade -->
    <transition-group tag="div" name="card-fade" class="order-grid">
      <div class="order-card" v-for="order in orders" :key="order.id">
        <div class="card-header">
          <span class="order-id">Mã: {{ order.id }}</span>
          <span class="order-status">{{ order.status }}</span>
        </div>
        <div class="card-body">
          <p class="customer-name">Khách hàng: {{ order.emailUser }}</p>
          <p class="order-spending">Ngày đặt: {{ order.orderDate || 'N/A' }}</p>
          <p class="order-spending">Tổng tiền: {{currencyFormat(order.total) || 'N/A' }}</p>
        </div>
        <div class="card-footer">
          <button class="cancel-btn" @click="handleCancel(order.id)">Cancel</button>
        </div>
      </div>
    </transition-group>
  </div>
</template>
  
  <script setup>
import { computed, onMounted } from 'vue';
import { useOrders } from '../../stores/OrderStore';
import { useUserStore } from '../../stores/userStore';

const userStore = useUserStore();
const orderStore = useOrders();
const orders = computed(() => orderStore.orders);

const loadOrder = async () => {
  await userStore.fetchUserInfo();
  await orderStore.fetchAllOrdersByUserId(userStore.userInfo.id);
}

const handleCancel = async (orderId) => {
  await orderStore.cancelOrder(orderId);
}
// Bộ lọc hiển thị giá tiền
const currencyFormat = (value) => {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);
};
onMounted(async () => {
  await loadOrder();
});
  </script>
  
  <style scoped>
/* Container chung */
  .order-list-container {
    max-width: 1200px;
    margin: 50px auto;
    padding: 30px;
    background: #ffffff;
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    text-align: center;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }
  
  .order-list-container h2 {
    margin-bottom: 40px;
    font-size: 2.5em;
    color: #333;
  }
  
  /* Layout dạng grid cho các card */
  .order-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
  }
  
  /* Styles cho card đơn hàng */
  .order-card {
    background: #f0f8ff;
    border-radius: 12px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    position: relative;
  }
  
  .order-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
  }
  
  /* Header của card */
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    border-bottom: 1px solid #ddd;
    padding-bottom: 10px;
  }
  
  .order-id {
    font-weight: bold;
    color: #444;
    font-size: 1.1em;
  }
  
  .order-status {
    background-color: #4caf50;
    color: #fff;
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 0.8em;
  }
  
  /* Nội dung card */
  .card-body {
    text-align: left;
    margin-bottom: 20px;
  }
  
  .customer-name {
    font-size: 1.1em;
    margin-bottom: 8px;
    color: #333;
  }
  
  .order-spending {
    font-size: 0.95em;
    color: #666;
  }
  
  /* Footer chứa nút hành động */
  .card-footer {
    text-align: right;
  }
  
  .cancel-btn {
    background: linear-gradient(45deg, #ff4d4f, #ff7875);
    color: #fff;
    border: none;
    padding: 10px 20px;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.3s ease, transform 0.3s ease;
  }
  
  .cancel-btn:hover {
    transform: scale(1.05);
  }
  
  /* Hiệu ứng chuyển động cho các card */
  .card-fade-enter-active,
  .card-fade-leave-active {
    transition: all 0.5s ease;
  }
  
  .card-fade-enter-from,
  .card-fade-leave-to {
    opacity: 0;
    transform: translateY(20px);
  }
</style>
  