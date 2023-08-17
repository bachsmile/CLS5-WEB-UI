<script setup lang="ts">
interface Props {
  maxWidth?: string
  maxHeight?: string
}
const props = withDefaults(defineProps<Props>(), ({
  maxWidth: '100%',
  maxHeight: '500px',
}))
</script>

<template>
  <div>
    <div
      class="scroll-wrapper"
      :style="{ width: maxWidth, height: maxHeight }"
    >
      <div class="scrollable-content">
        <!-- Nội dung cuộn ở đây -->
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Vùng cha để giới hạn việc hiển thị thanh cuộn */
.scroll-wrapper {
  overflow: hidden; /* Ẩn thanh cuộn mặc định */
  /* Các thuộc tính khác để tùy chỉnh giao diện vùng cha (tùy chọn) */
  border: 1px solid #ccc; /* Tùy chỉnh viền cho vùng cha */
}

/* Áp dụng một kích thước cụ thể cho vùng cuộn */
.scrollable-content {
  width: 100%; /* Đảm bảo nội dung không bị tràn ra ngoài vùng cha */
  height: 100%; /* Đảm bảo nội dung không bị tràn ra ngoài vùng cha */
  overflow: hidden; /* Ẩn thanh cuộn mặc định */
  /* Các thuộc tính khác để tùy chỉnh giao diện cuộn (tùy chọn) */
  padding: 10px; /* Tùy chỉnh đệm cho khoảng cách giữa nội dung và lề của phần tử cha */
}

/* Khi hover vào vùng cuộn, hiển thị thanh cuộn */
.scroll-wrapper:hover .scrollable-content{
  overflow-y: overlay;
}
</style>\
