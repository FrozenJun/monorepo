<template>
  <van-icon class="back" name="arrow-left" size="48rpx" @tap="back" />
</template>

<script setup lang="ts">
function back() {
  wx.navigateBack()
}
</script>

<style lang="scss">
@import '@/styles/export.scss';

@include b(back) {
  position: absolute;
  top: 108rpx;
  left: 24rpx;
}
</style>
