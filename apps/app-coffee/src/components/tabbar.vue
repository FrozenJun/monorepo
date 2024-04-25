<template>
  <div class="tabbar">
    <div class="tabbar-container">
      <slot></slot>
    </div>

    <van-tabbar :active="active" @change="onChange">
      <van-tabbar-item icon="home-o">标签</van-tabbar-item>
      <van-tabbar-item icon="search">标签</van-tabbar-item>
      <van-tabbar-item icon="friends-o">标签</van-tabbar-item>
      <van-tabbar-item icon="setting-o">标签</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const active = ref(0)

function onChange() {}
</script>

<style lang="scss">
.tabbar {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .tabbar-container {
    width: 100%;
    flex: 1;
  }
}
</style>
