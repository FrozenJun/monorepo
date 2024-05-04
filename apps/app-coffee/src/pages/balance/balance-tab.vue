<template>
  <div class="balance-tab">
    <scroll-view
      v-if="list.length"
      scroll-y="true"
      class="balance-tab__content"
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
      <div class="empty">余额明细将会展示在这里</div>
    </van-empty>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DetailItem from './balance-item.vue'
import { HideLoading, Loading } from '@/utils/toast'
import { onShow } from '@dcloudio/uni-app'
import type { PropType } from 'vue'
import { BalanceDetailsAPIService } from '@/app/api/services/balance-details-api'
import type { BalanceDetailsVo } from '@/app/api/models/balance-details-vo'
import type { BalanceDetailType } from '@/app/api/services/enum'

const props = defineProps({
  types: {
    type: Array as PropType<BalanceDetailType[]>,
    default: () => [],
  },
})

const list = ref<BalanceDetailsVo[]>([])
const pageNo = ref(1)
const pageSize = 10
const total = ref(0)
const isLoading = ref(false)

getDetails()
function loadMore() {
  if (!isLoading.value && total.value > list.value.length) {
    isLoading.value = true
    pageNo.value++
    getDetails()
  }
}
async function getDetails() {
  Loading('加载中')
  const { e, data } = await BalanceDetailsAPIService.balanceDetailsControllerMemberPage({
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

@include b(balance-tab) {
  @include e(content) {
    width: 100%;
    background: #f7f7f7;
    padding: 24rpx;
    box-sizing: border-box;
    height: calc(100vh - 44px - 450rpx);
  }
}
</style>
