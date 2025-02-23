<template>
  <div class="container-default-DK">
    <article>
      <aside>
        <h1>Thanh toán</h1>
        <h2>____</h2>
        <div class="form-container">
          <form @submit.prevent="handlePayment">
            <div class="form-group">
              <input type="text" placeholder="Họ" v-model="customer.firstName" />
            </div>
            <div class="form-group">
              <input type="text" placeholder="Tên" v-model="customer.lastName" />
            </div>
            <div class="form-group">
              <input type="text" placeholder="Số điện thoại" v-model="customer.phone" />
            </div>
            <div class="form-group">
              <input type="text" placeholder="Địa chỉ cụ thể (số nhà, đường...)" v-model="customer.address" />
            </div>
  
            <!-- Địa chỉ giao hàng trên cùng một hàng -->
            <div class="address-group">
              <div class="form-group">
                <label>Tỉnh/Thành phố</label>
                <select v-model="selectedProvinceTo" @change="loadDistrictsTo">
                  <option value="" disabled>Chọn tỉnh/thành phố</option>
                  <option v-for="province in provinces" :key="province.province_id" :value="province.province_id">
                    {{ province.province_name }}
                  </option>
                </select>
              </div>
  
              <div class="form-group">
                <label>Quận/Huyện</label>
                <select v-model="selectedDistrictTo" @change="loadWardsTo">
                  <option value="" disabled>Chọn quận/huyện</option>
                  <option v-for="district in districtsTo" :key="district.district_id" :value="district.district_id">
                    {{ district.district_name }}
                  </option>
                </select>
              </div>
  
              <div class="form-group">
                <label>Phường/Xã</label>
                <select v-model="selectedWardTo" @change="validateShipping">
                  <option value="" disabled>Chọn phường/xã</option>
                  <option v-for="ward in wardsTo" :key="ward.ward_code" :value="ward.ward_code">
                    {{ ward.ward_name }}
                  </option>
                </select>
              </div>
            </div>
  
            <!-- Chọn phương thức vận chuyển -->
            <div class="form-group">
              <label>Phương thức vận chuyển</label>
              <select v-model="selectedShippingMethod" @change="calculateShippingFee" :disabled="!canSelectShipping">
                <option value="" disabled>Chọn phương thức</option>
                <option v-for="method in shippingMethods" :key="method.service_id" :value="method.service_id">
                  {{ method.short_name }}
                </option>
              </select>
            </div>
  
            <!-- Tổng tiền hàng -->
            <div class="form-group">
              <label>Tổng tiền hàng</label>
              <input type="text" :value="currencyFormat(totalPrice)" readonly />
            </div>
  
            <!-- Tổng tiền (gồm vận chuyển, thuế) -->
            <div class="form-group">
              <label>Tổng tiền (Vận chuyển, thuế ...)</label>
              <input type="text" :value="currencyFormat(finalTotal)" readonly />
            </div>
  
            <button class="submit-btn" @click="handleCheckout" :disabled="paymentStore.isLoading">
              Thanh toán VNPay
            </button>
            <router-link to="/card"><strong style="font-size: 14px; margin: 20px">←Quay lại</strong></router-link>
          </form>
        </div>
      </aside>
    </article>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useGHNStore } from "../../stores/ghnStore";
import { useCartStore } from "../../stores/cartStore";
import { usePaymentStore } from "../../stores/paymentStore";
import { useOrders } from "../../stores/OrderStore";
import { useUserStore } from "../../stores/userStore";

const ghnStore = useGHNStore();
const cartStore = useCartStore();
const paymentStore = usePaymentStore();
const orderStore = useOrders();
const userStore = useUserStore();

// Thông tin khách hàng
const customer = ref({
  firstName: "",
  lastName: "",
  phone: "",
  address: "",
});

// Danh sách tỉnh, quận, phường, phương thức vận chuyển
const provinces = computed(() => ghnStore.provinces);
const districtsTo = computed(() => ghnStore.districts);
const wardsTo = computed(() => ghnStore.wards);
const shippingMethods = computed(() => ghnStore.shippingMethods);



// Các biến chọn vị trí
const selectedProvinceTo = ref("");
const selectedDistrictTo = ref("");
const selectedWardTo = ref("");
const selectedShippingMethod = ref("");

// Giá trị tổng tiền
const totalPrice = ref(100000); // Giả sử tổng tiền hàng ban đầu
const shippingFee = ref(0);
const finalTotal = computed(() => {
  console.log("totalPrice.value:", totalPrice.value);
  console.log("Kiểu dữ liệu của totalPrice.value:", typeof totalPrice.value);
  console.log("shippingFee.value:", shippingFee.value)
  return Number(totalPrice.value) + Number(shippingFee.value)
});

const loadTotalPrice = () => {
  const response = cartStore.totalPrice;
  if (response) {
    totalPrice.value = response;
  }
}

// Kiểm tra có thể chọn phương thức vận chuyển không
const canSelectShipping = computed(() => selectedProvinceTo.value && selectedDistrictTo.value && selectedWardTo.value);

// Khi chọn tỉnh, tải danh sách quận/huyện
const loadDistrictsTo = async () => {
  selectedDistrictTo.value = "";
  selectedWardTo.value = "";
  await ghnStore.fetchDistricts({ province_id: parseInt(selectedProvinceTo.value, 10) });
};

// Khi chọn quận/huyện, tải danh sách phường/xã
const loadWardsTo = async () => {
  selectedWardTo.value = "";
  await ghnStore.fetchWards({ district_id: parseInt(selectedDistrictTo.value, 10) });
};

// Khi chọn đủ địa chỉ, kiểm tra điều kiện chọn phương thức vận chuyển
const validateShipping = async () => {
  if (canSelectShipping.value) {
    await ghnStore.fetchShippingMethods({ to_district: parseInt(selectedDistrictTo.value, 10) });
  }
};

// Khi chọn phương thức vận chuyển, tính phí vận chuyển
const calculateShippingFee = async () => {
  if (!canSelectShipping.value || !selectedShippingMethod.value) return;

  const request = {
    to_district_id: parseInt(selectedDistrictTo.value, 10) || 0,
    to_ward_code: selectedWardTo.value || "",
    service_id: parseInt(selectedShippingMethod.value, 10) || 0,
    insurance_value: Number(totalPrice.value) || 0,
    cod_failed_amount: (Number(totalPrice.value) * 10 / 100) || 0,
    coupon: ""
  };
  const response = await ghnStore.fetchShippingFee(request);
  if (response)
    shippingFee.value = ghnStore.shippingFee;
};

// Gọi API để lấy danh sách tỉnh khi component được mount
onMounted(() => {
  loadTotalPrice();
  ghnStore.fetchProvinces();
});

// Xử lý thanh toán
const handlePayment = () => {
  alert(`Đơn hàng của bạn đã được xử lý. Tổng tiền: ${currencyFormat(finalTotal.value)}`);
};

// Bộ lọc hiển thị giá tiền
const currencyFormat = (value) => {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);
};

// Ví dụ dữ liệu thanh toán được gửi lên backend (bao gồm amount, bankCode, orderId, ...)
const paymentData = {
  amount: finalTotal.value,       // Số tiền thanh toán (sẽ được nhân 100 trong backend nếu cần)
  bankCode: 'NCB',      // Mã ngân hàng (nếu có)
  orderId: '12345'      // Mã đơn hàng
};


const orderData = {

}


const handleCheckout = async () => {



  await paymentStore.createPayment(paymentData);
};
</script> 

<style scoped>
body {
  margin-top: 50px;
}

label {
  font-size: 18px;
}

select,
input {
  width: 100%;
  padding: 8px;
  margin-top: 5px;
}

.address-group {
  display: flex;
  gap: 10px;
}

.address-group .form-group {
  flex: 1;
}
</style>
