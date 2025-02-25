<template>
  <section class="profile-container">
    <!-- Card hiển thị avatar và thông tin cơ bản -->
    <div class="profile-card">
      <div class="avatar-container" @mouseover="hover = true" @mouseleave="hover = false">
        <img :src="user.avatar || defaultAvatar" alt="Avatar" class="avatar-image" @click="openModal"
          :class="{ hovered: hover }" />
        <!-- Overlay hiển thị biểu tượng camera khi hover -->
        <div class="avatar-overlay" @click.stop="triggerFileUpload">
          <i class="fas fa-camera"></i>
        </div>
        <input ref="fileInput" type="file" accept="image/*" @change="handleAvatarUpload" hidden />
      </div>
      <h2 class="user-name">{{ user.fullName }}</h2>
      <p class="user-email">{{ user.email }}</p>
    </div>
  
    <!-- Card hiển thị thông tin cá nhân và form chỉnh sửa -->
    <div class="info-card">
      <transition name="fade">
        <div v-if="!isEditing" key="view">
          <h2>Thông tin cá nhân</h2>
          <div class="user-info">
            <p><strong>Số điện thoại:</strong> {{ user.phone }}</p>
            <p><strong>Ngày sinh:</strong> {{ user.birthday }}</p>
            <p><strong>Giới tính:</strong> {{ displayGender }}</p>
          </div>
          <button class="btn-edit" @click="toggleEdit">Chỉnh sửa thông tin</button>
        </div>
        <div v-else key="edit">
          <h2>Chỉnh sửa thông tin cá nhân</h2>
          <form @submit.prevent="handleUpdate" class="edit-form">
            <div class="form-group">
              <label>Họ tên</label>
              <input type="text" v-model="editableUser.fullName" placeholder="Họ tên" />
            </div>
            <div class="form-group">
              <label>Số điện thoại</label>
              <input type="text" v-model="editableUser.phone" placeholder="Số điện thoại" />
            </div>
            <div class="form-group">
              <label>Ngày sinh</label>
              <input type="date" v-model="editableUser.birthday" />
            </div>
            <div class="form-group">
              <label>Giới tính</label>
              <div class="radio-group">
                <label>
                  <input type="radio" value="true" v-model="editableUser.gender" /> Nam
                </label>
                <label>
                  <input type="radio" value="false" v-model="editableUser.gender" /> Nữ
                </label>
              </div>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn-save">Lưu</button>
              <button type="button" class="btn-cancel" @click="toggleEdit">Hủy</button>
            </div>
          </form>
        </div>
      </transition>
    </div>
  
    <!-- Modal xem ảnh avatar với hiệu ứng zoom mượt -->
    <div v-if="isModalOpen" class="modal" @click.self="closeModal">
      <div class="modal-content">
        <img :src="user.avatar || defaultAvatar" alt="Avatar" class="modal-avatar" />
        <button class="close-button" @click="closeModal">&times;</button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useUserStore } from "../../stores/userStore";
import { useToast } from "vue-toast-notification";

const userStore = useUserStore();
const toast = useToast();

// Biến điều khiển chế độ chỉnh sửa và modal
const isEditing = ref(false);
const isModalOpen = ref(false);
const hover = ref(false);
const fileInput = ref(null);
const editableUser = ref({});

// Ảnh mặc định nếu user.avatar chưa được set
const defaultAvatar = "https://via.placeholder.com/150";

// Lấy thông tin người dùng từ store
const user = computed(() => userStore.userInfo || {});

// Hiển thị giới tính
const displayGender = computed(() => {
  if (typeof user.value.gender === "boolean") {
    return user.value.gender ? "Nam" : "Nữ";
  }
  return user.value.gender;
});

// Khi chuyển sang chế độ edit, sao chép dữ liệu hiện tại sang editableUser
const toggleEdit = () => {
  isEditing.value = !isEditing.value;
  if (isEditing.value) {
    editableUser.value = { ...user.value };
  }
};

// Hàm cập nhật thông tin cá nhân
const handleUpdate = async () => {
  try {
    const user = {
      ...editableUser.value
    }
    console.log(user)
    const success = await userStore.updateUser(userStore.userInfo.id, user);
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

// Mở modal xem ảnh avatar
const openModal = () => {
  isModalOpen.value = true;
};

// Đóng modal
const closeModal = () => {
  isModalOpen.value = false;
};

// Trigger input file khi người dùng click vào overlay
const triggerFileUpload = () => {
  fileInput.value.click();
};

// Hàm xử lý upload avatar (giả sử store có hàm updateAvatar)
const handleAvatarUpload = async (event) => {
  const file = event.target.files[0];
  if (file) {
    const formData = new FormData();
    formData.append("avatar", file);
    try {
      const updatedAvatar = await userStore.updateAvatar(userStore.userInfo.id, formData);
      if (updatedAvatar) {
        toast.open({
          message: "Cập nhật avatar thành công!",
          type: "success",
          duration: 3000,
        });
        
      } else {
        toast.open({
          message: "Cập nhật avatar thất bại!",
          type: "error",
          duration: 3000, 
        });
      }
    } catch (error) {
      console.error("Lỗi cập nhật avatar:", error);
      toast.open({
        message: "Có lỗi xảy ra khi cập nhật avatar!",
        type: "error",
        duration: 3000,
      });
    }
  }
};

onMounted(async () => {
  await userStore.fetchUserInfo();
});
</script>

<style scoped>
/* Container tổng */
.profile-container {
  display: flex;
  gap: 2rem;
  padding: 2rem;
  justify-content: center;
  align-items: flex-start;
  flex-wrap: wrap;
  background: #f0f2f5;
}

/* Card avatar */
.profile-card {
  background: #fff;
  border-radius: 15px;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.profile-card:hover {
  transform: translateY(-5px);
}

/* Avatar container với hiệu ứng 3D */
.avatar-container {
  position: relative;
  width: 150px;
  height: 150px;
  margin: 0 auto 1rem auto;
  perspective: 1000px;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  border: 5px solid #007bff;
  transition: transform 0.5s, box-shadow 0.5s;
}

.avatar-image.hovered {
  transform: rotateY(15deg) scale(1.05);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

/* Overlay khi hover avatar */
.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.4);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
  cursor: pointer;
}

.avatar-container:hover .avatar-overlay {
  opacity: 1;
}

/* Thông tin cơ bản */
.user-name {
  font-size: 1.5rem;
  margin: 0.5rem 0;
  color: #333;
}

.user-email {
  font-size: 1rem;
  color: #666;
}

/* Card thông tin cá nhân */
.info-card {
  background: #fff;
  border-radius: 15px;
  padding: 2rem;
  flex: 1;
  min-width: 300px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.info-card h2 {
  margin-bottom: 1rem;
  color: #007bff;
}

.user-info p {
  margin: 0.5rem 0;
  font-size: 1rem;
  color: #444;
}

.btn-edit {
  background: #007bff;
  color: #fff;
  border: none;
  padding: 0.8rem 1.2rem;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 1rem;
  transition: background 0.3s;
}

.btn-edit:hover {
  background: #0056b3;
}

/* Form chỉnh sửa */
.edit-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group input {
  padding: 0.8rem;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.radio-group {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
}

.btn-save {
  background: #28a745;
  color: #fff;
  border: none;
  padding: 0.8rem 1.2rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-save:hover {
  background: #218838;
}

.btn-cancel {
  background: #dc3545;
  color: #fff;
  border: none;
  padding: 0.8rem 1.2rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-cancel:hover {
  background: #c82333;
}

/* Hiệu ứng chuyển fade cho form */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Modal xem ảnh avatar */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  position: relative;
  background: #fff;
  padding: 1rem;
  border-radius: 10px;
  max-width: 500px;
  width: 90%;
  animation: zoomIn 0.3s ease;
}

@keyframes zoomIn {
  from {
    transform: scale(0.5);
    opacity: 0;
  }

  to {
    transform: scale(1);
    opacity: 1;
  }
}

.modal-avatar {
  width: 100%;
  border-radius: 10px;
}

.close-button {
  position: absolute;
  top: 5px;
  right: 10px;
  background: transparent;
  border: none;
  font-size: 2rem;
  color: #333;
  cursor: pointer;
}
</style>
