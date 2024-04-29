<template>
  <div class="personal">
    <button class="button" open-type="chooseAvatar" @chooseavatar="onChooseavatar"></button>
    <van-cell-group class="cells">
      <van-cell title="头像" is-link>
        <image
          class="avatar"
          mode="aspectFill"
          :src="data?.avatarUrl || '/static/my-default.png'"
        />
      </van-cell>
      <van-cell @tap="toNickname" title="昵称" :value="data?.nickname || ''" is-link />
      <van-cell @tap="toPhone" title="手机号" :value="phone" is-link />
    </van-cell-group>
  </div>
</template>

<script setup lang="ts">
import { MemberAPIService } from '@/app/api/services/member-api'
import { useUserStore } from '@/store/user'
import { HideLoading, Loading, Modal, Toast } from '@/utils/toast'
import { computed, ref } from 'vue'

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
  Modal({
    title: '提示',
    content: '确定要更换手机号吗？',
    confirmColor: '#006241',
  })
    .then(() => {
      wx.navigateTo({ url: `/pages/my/phone` })
    })
    .catch(() => {})
}
function toNickname() {
  wx.navigateTo({ url: `/pages/my/nickname?nickname=${data.value?.nickname}` })
}

/**
 * 用户头像
 */
function onChooseavatar(e: any) {
  const path = e.detail.avatarUrl
  if (!path) return
  Loading('正在上传...')
  wx.getFileSystemManager().readFile({
    filePath: path,
    encoding: 'base64',
    async success(res: any) {
      if (!res.data.startsWith('data:image')) {
        res.data = 'data:image/png;base64,' + res.data
      }
      const { e } = await MemberAPIService.memberControllerUpdateAvatar({ base64: res.data })
      if (e) return HideLoading()
      await useUserStore().getUserDetail()
      HideLoading()
      Toast('修改成功')
    },
    fail() {
      HideLoading()
    },
  })
}
</script>

<style lang="scss">
@import '@/styles/export.scss';

@include b(personal) {
  width: 100%;
  height: 100vh;
  background: #f7f7f7;
  padding: 24rpx;
  position: relative;

  .van-cell {
    display: flex;
    align-items: center;
  }
  .avatar {
    width: 80rpx;
    height: 80rpx;
    border-radius: 50%;
  }

  .button {
    position: absolute;
    left: 48rpx;
    top: 46rpx;
    width: 654rpx;
    height: 114rpx;
    opacity: 0;
    z-index: 100;
  }
}
</style>
