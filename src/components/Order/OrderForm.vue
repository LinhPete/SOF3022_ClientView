<template>
  <div class="container-defaul">
    <article>
      <aside>
        <h1>Thanh toán</h1>
        <h2>____</h2>
        <div class="form-container">
          <form>
            <div class="form-group">
              <input type="text" placeholder="Họ và tên" v-model="customer.fullName" />
            </div>
            <div class="form-group">
              <input type="text" placeholder="Email" v-model="customer.email" />
            </div>
            <div class="form-group">
              <input type="text" placeholder="Số điện thoại" v-model="customer.phone" />
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
  
            <button type="button" class="submit-btn" @click="handleCheckout" :disabled="paymentStore.isLoading">
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
import { useRouter } from "vue-router";

const router = useRouter()
const ghnStore = useGHNStore();
const cartStore = useCartStore();
const paymentStore = usePaymentStore();
const orderStore = useOrders();
const userStore = useUserStore();

// Thông tin khách hàng
const customer = ref({});

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
const totalPrice = ref(100000);
const shippingFee = ref(0);
const finalTotal = computed(() => {
  return Number(totalPrice.value) + Number(shippingFee.value)
});

const loadCustomer = () => {
  customer.value = userStore.userInfo;
}

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

// Bộ lọc hiển thị giá tiền
const currencyFormat = (value) => {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);
};



const handleCheckout = async () => {

  const orderData = {
    // Lấy userId từ thông tin người dùng (giả sử userStore lưu id trong customer.value.id)
    userId: customer.value.id,

    // Tách họ và tên từ fullName (giả sử tên đầy đủ được nhập dạng "Tên Họ")
    rFirstname: customer.value.fullName ? customer.value.fullName.split(' ')[0] : "",
    rLastname: customer.value.fullName ? customer.value.fullName.split(' ').slice(1).join(' ') : "",

    // Số điện thoại người nhận
    rPhone: customer.value.phone,

    // Địa chỉ giao hàng (to*)
    toCity: parseInt(selectedProvinceTo.value, 10),
    toState: parseInt(selectedDistrictTo.value, 10),
    toWard: selectedWardTo.value,

    // Phương thức thanh toán (theo UI chỉ có VNPay)
    paymentMethod: "VNPay",

    // Mã dịch vụ vận chuyển (service_id)
    service_id: parseInt(selectedShippingMethod.value, 10),

    // Phí vận chuyển
    shippingFee: Number(shippingFee.value),

    // Tổng tiền hàng (subtotal)
    subtotal: Number(totalPrice.value),

    // Tổng thanh toán (tiền hàng + phí vận chuyển)
    total: Number(finalTotal.value)
  };

  const order = await orderStore.createOrder(orderData);
  await cartStore.deleteCartItemsByUserId(customer.value.id);
  await cartStore.resetCart();
  console.log(order.id)
  if (order) {
    const paymentData = {
      amount: finalTotal.value,
      bankCode: 'NCB',
      orderId: order.id
    };
    console.log(paymentData)
    const response = await paymentStore.createPayment(paymentData);
    if (response) {
      router.push("/order/list");
    }
  }
};

onMounted(() => {
  loadCustomer();
  loadTotalPrice();
  ghnStore.fetchProvinces();
});
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
