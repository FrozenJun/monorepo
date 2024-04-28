<template>
  <div class="order-paid">
    <success></success>
  </div>
</template>

<script setup lang="ts">
import success from '@/components/success.vue'
</script>

<style lang="scss">
@import '@/styles/export.scss';

@include b(order-paid) {
  width: 750rpx;
  height: 100vh;

  .van-button {
    width: 422rpx;
    height: 96rpx;
    background: #006241;
    border-radius: 48rpx;
    font-family: PingFangSC, PingFang SC;
    font-weight: 500;
    font-size: 32rpx;
    color: #ffffff;
    line-height: 44rpx;
    text-align: left;
    font-style: normal;
  }
}
</style>
