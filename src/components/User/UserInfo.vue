<template>
  <section class="container-default-DK">
    <aside>
      <div class="form-container">
        <!-- Hiển thị thông tin cá nhân nếu không ở chế độ edit -->
        <div v-if="!isEditing">
          <h2>Thông tin cá nhân</h2>
          <div class="user-info">
            <p><label>Họ Tên:</label> {{ user.fullName }}</p>
            <p><label>Email:</label> {{ user.email }}</p>
            <p><label>Số điện thoại:</label> {{ user.phone }}</p>
            <p>
              <label>Ngày sinh:</label>
              {{ user.birthday }}
            </p>
            <p><label>Giới tính:</label> {{ displayGender }}</p>
          </div>
          <button class="submit-btn" @click="toggleEdit">
            Chỉnh sửa thông tin
          </button>
        </div>

        <!-- Form chỉnh sửa thông tin cá nhân -->
        <div v-else>
          <h2>Chỉnh sửa thông tin cá nhân</h2>
          <form @submit.prevent="handleUpdate">
            <div class="form-group">
              <input
                type="text"
                id="ho"
                name="ho"
                placeholder="Họ"
                v-model="editableUser.fullName"
              />
            </div>
            <div class="form-group">
              <label>
                <input
                  type="radio"
                  name="gender"
                  :value="false"
                  v-model="editableUser.gender"
                />
                Nữ
                <input
                  type="radio"
                  name="gender"
                  :value="true"
                  v-model="editableUser.gender"
                />
                Nam
              </label>
            </div>
            <div class="form-group">
              <input
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                placeholder="Số điện thoại"
                v-model="editableUser.phone"
              />
            </div>
            <div class="form-group">
              <input
                type="date"
                id="dob"
                name="dob"
                v-model="editableUser.birthday"
              />
            </div>
            <div class="form-group">
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Email"
                v-model="editableUser.email"
                disabled
              />
            </div>
            <!-- Nếu cần thêm các trường khác, bạn có thể bổ sung ở đây -->

            <!-- Nút lưu và hủy -->
            <button type="submit" class="submit-btn">Lưu</button>
            <button type="button" class="submit-btn" @click="toggleEdit">
              Hủy
            </button>
          </form>
        </div>
      </div>
    </aside>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useUserStore } from "../../stores/userStore";
import { useToast } from "vue-toast-notification";

const userStore = useUserStore();
const toast = useToast();

const isEditing = ref(false);
const editableUser = ref({});

// Sử dụng computed để lấy thông tin người dùng từ store
const user = computed(() => userStore.userInfo || {});

// Khi chuyển sang edit, sao chép thông tin hiện có
const toggleEdit = () => {
  isEditing.value = !isEditing.value;
  if (isEditing.value) {
    editableUser.value = { ...user.value };
  }
};

const handleUpdate = async () => {
  try {
    const success = await userStore.updateUser(editableUser.value);
    if (success) {
      toast.open({
        message: "Cập nhật thông tin thành công!",
        type: "success",
        duration: 3000,
      });
      isEditing.value = false;
    } else {
      toast.open({
        message: "Cập nhật thất bại!",
        type: "error",
        duration: 3000,
      });
    }
  } catch (error) {
    console.error("Lỗi cập nhật:", error);
    toast.open({
      message: "Có lỗi xảy ra trong quá trình cập nhật!",
      type: "error",
      duration: 3000,
    });
  }
};

onMounted(async () => {
  if (!userStore.userInfo) {
    await userStore.fetchUserInfo();
  }
});
const displayGender = computed(() => {
  if (typeof user.value.gender === "boolean") {
    return user.value.gender ? "Nam" : "Nữ";
  }
  return user.value.gender;
});
</script>

<style scoped>
/* Giữ nguyên CSS của bạn */
.form-container {
  max-width: 400px;
  margin: auto;
  padding: 20px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
.user-info p {
  margin: 10px 0;
}
.submit-btn {
  display: block;
  width: 100%;
  margin-top: 15px;
  padding: 10px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.submit-btn:hover {
  background: #0056b3;
}
</style>
