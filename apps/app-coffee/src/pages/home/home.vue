<template>
  <tabbar>
    <div class="home">
      <div class="home__top">
        <image class="home__img" src="/static/banner@2x.png" />

        <div class="home__info">
          <image class="home__info-bg" src="/static/home-bg@2x.png" />
        </div>
      </div>

      <image class="home__pay" src="/static/pay@2x.png" />
    </div>
  </tabbar>
</template>

<script setup lang="ts">
import tabbar from '@/components/tabbar.vue'
</script>

<style lang="scss">
@import '@/styles/export.scss';

@include b(home) {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  @include e(top) {
    position: relative;
    width: 100%;
    height: 596rpx;
    margin-bottom: 24rpx;

    @include e(img) {
      left: 0;
      top: 0;
      position: absolute;
      height: 580rpx;
      width: 100%;
      z-index: 0;
    }

    @include e(info) {
      width: 686rpx;
      height: 148rpx;
      margin: 0 auto;
      position: relative;
      margin-top: 448rpx;

      @include e(info-bg) {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
      }
    }
  }

  @include e(pay) {
    width: 686rpx;
    height: 178rpx;
  }
}
</style>
