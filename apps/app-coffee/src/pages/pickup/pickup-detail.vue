<template>
  <div class="pickup-detail">
    <van-tabs :active="active" sticky>
      <van-tab title="全部">
        <scroll-view v-if="list.length" class="pickup-detail__content" @scrolltolower="getAll">
          <detail-item v-for="i in list" :key="i.id"></detail-item>
        </scroll-view>

        <van-empty v-else description="暂无明细" image="/static/pickup-empty.png">
          <div class="empty">使用明细将会展示在这里</div>
        </van-empty>
      </van-tab>
      <van-tab title="获得">
        <van-empty description="暂无明细" image="/static/pickup-empty.png">
          <div class="empty">使用明细将会展示在这里</div>
        </van-empty>
      </van-tab>
      <van-tab title="已使用">内容1 3</van-tab>
    </van-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DetailItem from './detail-item.vue'
import { HideLoading, Loading } from '@/utils/toast'
import { PickupCodeUsageDetailsAPIService } from '@/app/api/services/pickup-code-usage-details-api'
import { PickupCodeUsageDetailType } from '@/app/api/services/enum'
import type { PickupCodeUsageDetailsVo } from '@/app/api/models/pickup-code-usage-details-vo'
import { onShow } from '@dcloudio/uni-app'

const active = ref(0)
const list = ref<PickupCodeUsageDetailsVo[]>([])

onShow(() => {
  getAll()
})

function getAll() {
  getDetails([
    PickupCodeUsageDetailType.提货码使用,
    PickupCodeUsageDetailType.提货码购买,
    PickupCodeUsageDetailType.提货码赠送,
    PickupCodeUsageDetailType.提货码退回,
  ])
}
async function getDetails(types: PickupCodeUsageDetailType[]) {
  Loading('加载中')
  const { e, data } =
    await PickupCodeUsageDetailsAPIService.pickupCodeUsageDetailsControllerMemberPage({
      page: 1,
      size: 10,
      types,
    })
  HideLoading()
  if (e) return
  list.value = data?.items || []
}
</script>

<style lang="scss">
@import '@/styles/export.scss';

@include b(pickup-detail) {
  width: 100%;
  height: 100vh;
  background: #f7f7f7;

  @include e(content) {
    width: 100%;
    background: #f7f7f7;
    padding: 24rpx;
  }

  .van-empty {
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
