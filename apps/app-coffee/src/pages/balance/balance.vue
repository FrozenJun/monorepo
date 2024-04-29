<template>
  <div class="balance">
    <div class="balance__bg"></div>

    <back></back>

    <div class="balance__title">余额</div>

    <div class="balance__info">
      <div class="left">
        <div class="label">可用余额(元)</div>
        <div class="number">{{ userInfo?.balance || 0 }}</div>
      </div>
      <van-button block round @tap="toBuy">特惠充值</van-button>
    </div>

    <div class="balance__tabs">
      <van-tabs :active="active">
        <van-tab title="全部">
          <BalanceTab
            :types="[
              BalanceDetailType.余额付款,
              BalanceDetailType.余额充值,
              BalanceDetailType.余额退款,
            ]"
          ></BalanceTab>
        </van-tab>
        <van-tab title="收入">
          <BalanceTab
            :types="[BalanceDetailType.余额充值, BalanceDetailType.余额退款]"
          ></BalanceTab>
        </van-tab>
        <van-tab title="支出">
          <BalanceTab :types="[BalanceDetailType.余额付款]"></BalanceTab
        ></van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import back from '@/components/back.vue'
import BalanceTab from './balance-tab.vue'
import { BalanceDetailType } from '@/app/api/services/enum'
import { useUserStore } from '@/store/user'

const userStore = useUserStore()
const userInfo = computed(() => userStore.userInfo)

const active = ref(0)

function toBuy() {
  wx.navigateTo({ url: '/pages/balance/balance-recharge' })
}
</script>

<style lang="scss">
@import '@/styles/export.scss';

@include b(balance) {
  width: 100%;
  height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #fff;

  @include e(bg) {
    position: absolute;
    left: 0;
    top: 0;
    width: 750rpx;
    height: 450rpx;
    background: linear-gradient(180deg, #fcd287 0%, #fff 100%);
    z-index: 0;
  }

  @include e(title) {
    position: relative;
    margin-top: 110rpx;
    margin-bottom: 70rpx;
    font-family: PingFangSC, PingFang SC;
    font-weight: 500;
    font-size: 34rpx;
    color: #000000;
    line-height: 44rpx;
    text-align: center;
    font-style: normal;
  }

  @include e(info) {
    width: 686rpx;
    background: #36303c;
    border-radius: 16rpx;
    position: relative;
    padding: 48rpx 30rpx 48rpx 48rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .left {
      display: flex;
      flex-direction: column;
      .label {
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        font-size: 28rpx;
        color: #ffcf99;
        line-height: 40rpx;
        text-align: left;
        font-style: normal;
        margin-bottom: 8rpx;
        opacity: 0.5;
      }
      .number {
        font-family: DINPro, DINPro;
        font-weight: bold;
        font-size: 64rpx;
        color: #ffcf99;
        line-height: 82rpx;
        text-align: left;
        font-style: normal;
      }
    }
    .van-button {
      width: 176rpx;
      height: 80rpx;
      background: linear-gradient(270deg, #eacd93 0%, #e1bf80 100%);
      border-radius: 40rpx;
      border-color: #eacd93;

      font-family: PingFangSC, PingFang SC;
      font-weight: 500;
      font-size: 28rpx;
      color: #323238;
      line-height: 40rpx;
      text-align: center;
      font-style: normal;
    }
  }

  @include e(tabs) {
    width: 100%;
    flex: 1;
    height: calc(100vh - 450rpx);
    background: #f7f7f7;
  }

  @include e(content) {
    width: 100%;
    background: #f7f7f7;
    padding: 24rpx;
  }

  .van-tabs {
    height: 100%;
  }
  .van-tabs__content {
    height: calc(100% - 44px);
    overflow-y: auto;
  }
  .van-empty {
    width: 100%;
    height: 100%;
    padding-top: 240rpx;
    background: #f7f7f7;
    .van-empty__image,
    image {
      width: 326rpx;
      height: 254rpx;
    }
    .van-empty__description {
      margin-top: 46rpx;
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      font-size: 28rpx;
      color: #333333;
      line-height: 40rpx;
      text-align: left;
      font-style: normal;
    }
    .van-empty__bottom {
      margin-top: 24rpx;
    }
    .empty {
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      font-size: 28rpx;
      color: #999999;
      line-height: 40rpx;
      text-align: center;
      font-style: normal;
    }
  }
}
</style>
