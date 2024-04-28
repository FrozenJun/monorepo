<template>
  <div class="personal">
    <van-cell-group class="cells">
      <van-cell title="头像" is-link>
        <image class="avatar" :src="data?.avatar || '/static/my-default.png'" />
      </van-cell>
      <van-cell @tap="toNickname" title="昵称" :value="data?.nickname || ''" is-link />
      <van-cell @tap="toPhone" title="手机号" :value="phone" is-link />
    </van-cell-group>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store/user'
import { Modal } from '@/utils/toast'
import { computed } from 'vue'

const userStore = useUserStore()
const data = computed(() => {
  return userStore.userInfo
})
const phone = computed(() => {
  const value = data.value?.phone || ''
  if (!value) return ''
  return value.slice(0, 3) + '****' + value.slice(7)
})

async function toPhone() {
  await Modal({
    title: '提示',
    content: '确定要更换手机号吗？',
    confirmColor: '#006241',
  })
  wx.navigateTo({ url: `/pages/my/phone` })
}
function toNickname() {
  wx.navigateTo({ url: `/pages/my/nickname?nickname=${data.value?.nickname}` })
}
</script>

<style lang="scss">
@import '@/styles/export.scss';

@include b(personal) {
  width: 100%;
  height: 100vh;
  background: #f7f7f7;
  padding: 24rpx;

  .van-cell {
    display: flex;
    align-items: center;
  }
  .avatar {
    width: 80rpx;
    height: 80rpx;
    border-radius: 50%;
  }
}
</style>
