<template>
  <div class="pickup-detail-tab">
    <scroll-view
      v-if="list.length"
      scroll-y="true"
      class="pickup-detail-tab__content"
      @scrolltolower="loadMore"
    >
      <detail-item v-for="i in list" :key="i.id"></detail-item>
    </scroll-view>

    <van-empty v-else description="暂无明细" image="/static/pickup-empty.png">
      <div class="empty">使用明细将会展示在这里</div>
    </van-empty>
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
import { PropType } from 'vue'

const props = defineProps({
  types: {
    type: Array as PropType<PickupCodeUsageDetailType[]>,
    default: () => [],
  },
})

const list = ref<PickupCodeUsageDetailsVo[]>([])
const pageNo = ref(1)
const pageSize = 10
const isLoading = ref(false)

onShow(() => {
  getAll()
})
function getAll() {
  getDetails()
}
function loadMore() {
  console.log('loadMore')
  if (!isLoading.value) {
    pageNo.value++
    getDetails()
  }
}
async function getDetails() {
  Loading('加载中')
  const { e, data } =
    await PickupCodeUsageDetailsAPIService.pickupCodeUsageDetailsControllerMemberPage({
      page: pageNo.value,
      size: pageSize,
      types: props.types,
    })
  HideLoading()
  if (e) return
  list.value.push(...(data?.items || []))
}
</script>

<style lang="scss">
@import '@/styles/export.scss';

@include b(pickup-detail-tab) {
  @include e(content) {
    width: 100%;
    background: #f7f7f7;
    padding: 24rpx;
    height: 100%;
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
