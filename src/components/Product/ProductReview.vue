<template>
  <div class="review-section">
    <h3>Đánh giá sản phẩm</h3>

    <p v-if="reviewStore.loading" class="loading">Đang tải đánh giá...</p>
    <p v-if="reviewStore.error" class="error">{{ reviewStore.error }}</p>


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

    <div class="review-form">
      <h4>Viết đánh giá của bạn</h4>
      <div class="rating">
        <label>Chọn số sao:</label>
        <span v-for="star in 5" :key="star" class="fa-solid fa-star" :class="{ active: star <= formData.rating }" @click="formData.rating = star"></span>
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

const formData = ref({
  rating: 0,
  headline: "",
  comment: "",
  userId: null,
});

onMounted(async () => {
  try {
    await authStore.fetchUserInfo();

    // Kiểm tra nếu userInfo tồn tại trước khi gán giá trị
    formData.value.userId = authStore.userInfo?.id || null;

    // Kiểm tra nếu API bị lỗi thì xử lý thay vì crash
    await reviewStore.fetchReviews(productId);
    reviews.value = reviewStore.reviews || []; // Đảm bảo reviews luôn là mảng
  } catch (error) {
    console.error("Lỗi khi tải đánh giá:", error);
    reviewStore.error = "Không thể tải đánh giá. Vui lòng thử lại!";
  }
});


const submitReview = async () => {
  // Kiểm tra nếu người dùng chưa đăng nhập
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
    formData.value = { rating: 0, headline: "", comment: "", userId: authStore.user?.id || null };
  } else {
    alert(result.message);
  }
};

</script>

<style scoped>
.review-section {
  width: 100%;
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  border-radius: 12px;
  background: #f9f9f9;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

h3 {
  text-align: center;
  color: #333;
}

.loading,
.error {
  text-align: center;
  color: red;
  font-size: 14px;
}

.review-list {
  max-height: 300px;
  overflow-y: auto;
  padding-right: 5px;
}

.scrollable-reviews {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.review-item {
  padding: 15px;
  border-radius: 8px;
  background: #fff;
  color: #333;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.review-author {
  font-weight: bold;
  color: #555;
}

.review-stars i {
  font-size: 16px;
  color: #ccc;
}

.review-stars i.active {
  color: #ff9900;
}

.review-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
}

.rating {
  display: flex;
  gap: 5px;
}

.rating .fa-star {
  cursor: pointer;
  font-size: 22px;
  transition: color 0.2s;
}

.rating .fa-star.active {
  color: #ff9900;
}

.input-field {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
}

.submit-button {
  background: #ff4d4f;
  color: white;
  border: none;
  padding: 12px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 6px;
  transition: background 0.3s;
}

.submit-button:hover {
  background: #d9363e;
}
</style>
