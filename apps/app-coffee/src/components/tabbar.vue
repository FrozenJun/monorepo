<template>
  <div class="tabbar">
    <div class="tabbar-container">
      <slot></slot>
    </div>

    <van-tabbar :active="active" @change="onChange">
      <van-tabbar-item icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item icon="search">提货码</van-tabbar-item>
      <van-tabbar-item icon="friends-o">附近</van-tabbar-item>
      <van-tabbar-item icon="setting-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const active = ref(0)

function onChange(e: any) {
  console.log(e)
  switch (e.detail) {
    case 0:
      wx.navigateTo({ url: 'pages/home/home' })
      break
    case 1:
      wx.navigateTo({ url: 'pages/pickup/pickup-code' })
      break
    case 2:
      wx.navigateTo({ url: 'pages/home/home' })
      break
    case 3:
      wx.navigateTo({ url: 'pages/home/home' })
      break

    default:
      break
  }
}
</script>

<style lang="scss">
.tabbar {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .tabbar-container {
    width: 100%;
    flex: 1;
    margin-bottom: 100rpx;
  }
}
</style>
