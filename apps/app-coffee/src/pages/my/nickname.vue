<template>
  <div class="nickname">
    <van-field
      :value="name"
      name="name"
      placeholder="请输入新的昵称"
      :border="false"
      clearable
      @change="name = $event.detail"
    />

    <van-button :disabled="!name" @click="onSave" block round>保存</van-button>
  </div>
</template>

<script setup lang="ts">
import { MemberAPIService } from '@/app/api/services/member-api'
import { useUserStore } from '@/store/user'
import { HideLoading, Loading, Toast } from '@/utils/toast'
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'

const name = ref('')
onLoad((params: any) => {
  name.value = params.nickname
})

async function onSave() {
  Loading('保存中...')
  const { e } = await MemberAPIService.memberControllerUpdateNickname({
    nickname: name.value,
  })
  if (e) return HideLoading()
  await useUserStore().getUserDetail()
  HideLoading()
  Toast('修改成功')
  wx.navigateBack()
}
</script>

<style lang="scss">
@import '@/styles/export.scss';

@include b(nickname) {
  width: 100%;
  height: 100vh;
  background: #f7f7f7;
  padding: 24rpx;

  .van-cell {
    border-radius: 24rpx;
    padding: 32rpx !important;
    &::after {
      z-index: 100;
    }

    .van-cell__value {
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      font-size: 28rpx;
      line-height: 40rpx;
      text-align: left;
      font-style: normal;
      flex: 1;
    }
  }

  .van-button {
    width: 686rpx;
    height: 96rpx;
    border-radius: 48rpx;
    margin-top: 128rpx;

    font-family: PingFangSC, PingFang SC;
    font-weight: 500;
    font-size: 32rpx;
    color: #ffffff;
    line-height: 44rpx;
    font-style: normal;
    background: #006241;
  }
}
</style>
