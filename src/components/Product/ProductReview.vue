<template>
  <div class="review-section">
    <h3>Đánh giá sản phẩm</h3>
  
    <!-- Thông báo tải dữ liệu và lỗi -->
    <div v-if="reviewStore.loading || reviewStore.error" class="status-msg">
      <p v-if="reviewStore.loading" class="loading">Đang tải đánh giá...</p>
      <p v-if="reviewStore.error" class="error">{{ reviewStore.error }}</p>
    </div>
  
    <!-- Danh sách đánh giá -->
    <div v-if="reviews.length > 0" class="review-list">
      <div class="scrollable-reviews">
        <div v-for="review in reviews" :key="review.id" class="review-item">
          <div class="review-header">
            <span class="review-author">{{ review.username || 'Người dùng ẩn danh' }}</span>
            <span class="review-stars">
              <i v-for="star in 5" :key="star" class="fa-solid fa-star" :class="{ active: star <= review.rating }"></i>
            </span>
          </div>
          <h4 class="review-title">{{ review.headline }}</h4>
          <p class="review-content">{{ review.comment }}</p>
        </div>
      </div>
    </div>
    <!-- Phân trang -->
    <div v-if="reviews.length > 0" class="pagination">
      <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1">Trang trước</button>
      <span>Trang {{ currentPage }} / {{ totalPages }}</span>
      <button @click="changePage(currentPage + 1)" :disabled="currentPage >= totalPages">Trang sau</button>
    </div>
    <!-- Form đánh giá -->
    <div class="review-form">
      <h4>Viết đánh giá của bạn</h4>
      <div class="rating">
        <label>Chọn số sao:</label>
        <span v-for="star in 5" :key="star" class="fa-solid fa-star" :class="{ active: star <= formData.rating }"
          @click="formData.rating = star"></span>
      </div>
      <input v-model="formData.headline" type="text" placeholder="Tiêu đề đánh giá" class="input-field" />
      <textarea v-model="formData.comment" placeholder="Nhận xét của bạn" class="input-field"></textarea>
      <button @click="submitReview" class="submit-button">Gửi đánh giá</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useReviewStore } from "../../stores/reviewStore";
import { useRoute } from "vue-router";
import { useUserStore } from "../../stores/userStore.js";

const route = useRoute();
const reviewStore = useReviewStore();
const authStore = useUserStore();
const productId = parseInt(route.params.id);
const reviews = ref([]);
const currentPage = ref(1);
const totalPages = ref(1);

const formData = ref({
  rating: 0,
  headline: "",
  comment: "",
  userId: null,
});

onMounted(async () => {
  try {
    await authStore.fetchUserInfo();
    formData.value.userId = authStore.userInfo?.id || null;
    await fetchReviews(currentPage.value);
    reviews.value = reviewStore.reviews || [];
  } catch (error) {
    console.error("Lỗi khi tải đánh giá:", error);
    reviewStore.error = "Không thể tải đánh giá. Vui lòng thử lại!";
  }
});

const fetchReviews = async (page) => {
  try {
    await reviewStore.fetchReviews(productId, page);
    reviews.value = reviewStore.reviews || [];
    totalPages.value = reviewStore.totalPages || 1; 
  } catch (error) {
    console.error("Lỗi khi tải đánh giá:", error);
    reviewStore.error = "Không thể tải đánh giá. Vui lòng thử lại!";
  }
};

const changePage = (newPage) => {
  if (newPage >= 1 && newPage <= totalPages.value) {
    currentPage.value = newPage;
    fetchReviews(newPage);
  }
};
const submitReview = async () => {
  if (!authStore.userInfo.id) {
    alert("Vui lòng đăng nhập để bình luận!");
    return;
  }

  formData.value.userId = authStore.userInfo?.id || null;

  if (!formData.value.rating || !formData.value.comment.trim() || !formData.value.headline.trim()) {
    alert("Vui lòng nhập đầy đủ thông tin đánh giá!");
    return;
  }

  const reviewPayload = {
    productId,
    ...formData.value,
  };

  const result = await reviewStore.addReview(productId, reviewPayload);
  if (result.success) {
    alert("Gửi đánh giá thành công!");
    await reviewStore.fetchReviews(productId);
    reviews.value = reviewStore.reviews || [];
    formData.value = { rating: 0, headline: "", comment: "", userId: authStore.user?.id || null };
  } else {
    alert(result.message);
  }
};
</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
}

.pagination button {
  background: #007bff;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
}

.pagination button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.pagination span {
  font-size: 1.1rem;
  font-weight: bold;
}

/* Tổng quan cho section */
.review-section {
  position: absolute;
  top: 0;
  right: 2%;
  width: 700px;
  max-height: 90px;
  margin: 1rem auto;
  padding: 2rem;
  background: #eacadc8d;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Tiêu đề chính */
.review-section h3 {
  text-align: center;
  color: #333;
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
}

/* Thông báo trạng thái */
.status-msg {
  text-align: center;
  margin-bottom: 1.5rem;
}

.loading,
.error {
  font-size: 1rem;
  color: #d9534f;
}

/* Danh sách đánh giá */
.review-list {
  max-height: 400px;
  overflow-y: auto;
  margin-bottom: 1.5rem;
}

.scrollable-reviews {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Card đánh giá */
.review-item {
  background: #f7f7f7;
  padding: 1.2rem;
  border-radius: 0.8rem;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.review-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Header đánh giá */
.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.review-author {
  font-weight: 600;
  color: #555;
  font-size: 1.1rem;
}

/* Đánh giá sao */
.review-stars {
  display: flex;
}

.review-stars i {
  font-size: 1.2rem;
  color: #ccc;
  margin-left: 0.1rem;
}

.review-stars i.active {
  color: #ffc107;
}

/* Tiêu đề và nội dung đánh giá */
.review-title {
  font-size: 1.3rem;
  color: #333;
  margin: 0.5rem 0;
}

.review-content {
  font-size: 1rem;
  color: #666;
  line-height: 1.5;
}

/* Form đánh giá */
.review-form {
  background: #f9f9f9;
  padding: 1.5rem;
  border-radius: 0.8rem;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.05);
}

.review-form h4 {
  margin-bottom: 1rem;
  color: #333;
  font-size: 1.5rem;
}

/* Phần chọn số sao trong form */
.rating {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.rating label {
  margin-right: 0.5rem;
  font-size: 1rem;
  color: #555;
}

.rating .fa-star {
  font-size: 1.5rem;
  color: #ddd;
  cursor: pointer;
  transition: color 0.3s;
}

.rating .fa-star.active {
  color: #ffc107;
}

/* Input và textarea */
.input-field {
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.input-field:focus {
  outline: none;
  border-color: #007bff;
}

/* Button gửi đánh giá */
.submit-button {
  display: inline-block;
  background: #007bff;
  color: #fff;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s;
}

.submit-button:hover {
  background: #0056b3;
}
</style>
