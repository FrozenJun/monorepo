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
}
</style>
