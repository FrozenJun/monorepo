<template>
  <div class="order-tab">
    <scroll-view
      v-if="list.length"
      scroll-y="true"
      class="order-tab__content"
      @scrolltolower="loadMore"
    >
      <order-item
        v-for="(i, index) in list"
        :key="i.id"
        :data="i"
        :hidden-line="index === list.length - 1"
      ></order-item>
    </scroll-view>

    <van-empty v-else description="暂无历史订单" image="/static/order-empty.png">
      <div class="empty">历史订单将会展示在这里\n请先去下单哦～</div>
      <van-button @tap="toNear">去喝一杯</van-button>
    </van-empty>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import OrderItem from './order-item.vue'
import { HideLoading, Loading } from '@/utils/toast'
import type { OrderStatus } from '@/app/api/services/enum'
import { onShow } from '@dcloudio/uni-app'
import type { PropType } from 'vue'
import { OrderAPIService } from '@/app/api/services/order-api'
import type { OrderMemberVo } from '@/app/api/models/order-member-vo'

const props = defineProps({
  types: {
    type: Array as PropType<OrderStatus[]>,
    default: () => [],
  },
})

const list = ref<OrderMemberVo[]>([])
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
  const { e, data } = await OrderAPIService.orderControllerMemberPage({
    page: pageNo.value,
    size: pageSize,
    status: props.types,
  })
  HideLoading()
  isLoading.value = false
  if (e) return
  total.value = data?.total || 0
  list.value.push(...(data?.items || []))
}
function toNear() {
  wx.switchTab({ url: '/pages/home/nearby' })
}
</script>

<style lang="scss">
@import '@/styles/export.scss';

@include b(order-tab) {
  @include e(content) {
    width: 100%;
    background: #f7f7f7;
    padding: 24rpx;
    box-sizing: border-box;
    height: calc(100vh - 44px);
  }
}
</style>
