<template>
  <div class="pickup-detail">
    <van-tabs :active="active" sticky>
      <van-tab title="全部">
        <PickupDetailTab
          :types="[
            PickupCodeUsageDetailType.提货码使用,
            PickupCodeUsageDetailType.提货码购买,
            PickupCodeUsageDetailType.提货码赠送,
            PickupCodeUsageDetailType.提货码退回,
          ]"
        ></PickupDetailTab>
      </van-tab>
      <van-tab title="获得">
        <PickupDetailTab
          :types="[
            PickupCodeUsageDetailType.提货码购买,
            PickupCodeUsageDetailType.提货码赠送,
            PickupCodeUsageDetailType.提货码退回,
          ]"
        ></PickupDetailTab>
      </van-tab>
      <van-tab title="已使用">
        <PickupDetailTab :types="[PickupCodeUsageDetailType.提货码使用]"></PickupDetailTab
      ></van-tab>
    </van-tabs>
  </div>
</template>

<script setup lang="ts">
import PickupDetailTab from './pickup-detail-tab.vue'
import { PickupCodeUsageDetailType } from '@/app/api/services/enum'
import { ref } from 'vue'

const active = ref(0)
</script>

<style lang="scss">
@import '@/styles/export.scss';

@include b(pickup-detail) {
  width: 100%;
  height: 100vh;
  background: #f7f7f7;

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
