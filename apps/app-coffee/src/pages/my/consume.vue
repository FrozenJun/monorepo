<template>
  <div class="consume"><detail-item v-for="i in 6" :key="i"></detail-item></div>
</template>

<script setup lang="ts">
import DetailItem from '@/components/detail-item.vue'
</script>

<style lang="scss">
@import '@/styles/export.scss';

@include b(consume) {
  width: 100%;
  height: 100vh;
  background: #f7f7f7;
  padding: 24rpx;
  overflow-y: auto;
}
</style>
