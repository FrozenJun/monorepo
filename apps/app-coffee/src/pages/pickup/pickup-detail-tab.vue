<template>
  <div class="pickup-detail-tab">
    <scroll-view
      v-if="list.length"
      scroll-y="true"
      class="pickup-detail-tab__content"
      @scrolltolower="loadMore"
    >
      <detail-item
        v-for="(i, index) in list"
        :key="i.id"
        :data="i"
        :hidden-line="index === list.length - 1"
      ></detail-item>
    </scroll-view>

    <van-empty v-else description="暂无明细" image="/static/pickup-empty.png">
      <div class="empty">使用明细将会展示在这里</div>
    </van-empty>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DetailItem from './pickup-item.vue'
import { HideLoading, Loading } from '@/utils/toast'
import { PickupCodeUsageDetailsAPIService } from '@/app/api/services/pickup-code-usage-details-api'
import type { PickupCodeUsageDetailType } from '@/app/api/services/enum'
import type { PickupCodeUsageDetailsVo } from '@/app/api/models/pickup-code-usage-details-vo'
import { onShow } from '@dcloudio/uni-app'
import type { PropType } from 'vue'

const props = defineProps({
  types: {
    type: Array as PropType<PickupCodeUsageDetailType[]>,
    default: () => [],
  },
})

const list = ref<PickupCodeUsageDetailsVo[]>([])
const pageNo = ref(1)
const pageSize = 10
const total = ref(0)
const isLoading = ref(false)

onShow(() => {
  getDetails()
})
function loadMore() {
  if (!isLoading.value && total.value > list.value.length) {
    isLoading.value = true
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
  isLoading.value = false
  if (e) return
  total.value = data?.total || 0
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
    box-sizing: border-box;
    height: calc(100vh - 44px);
  }
}
</style>
