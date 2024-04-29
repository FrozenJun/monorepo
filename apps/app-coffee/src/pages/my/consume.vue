<template>
  <div class="consume">
    <scroll-view
      v-if="list.length"
      class="consume__content"
      @scrolltolower="loadMore"
      scroll-y="true"
      ><detail-item
        v-for="(i, index) in list"
        :key="i.id"
        :data="i"
        :hidden-line="index === list.length - 1"
      ></detail-item
    ></scroll-view>

    <van-empty v-else description="暂无明细" image="/static/pickup-empty.png">
      <div class="empty">消费明细将会展示在这里</div>
    </van-empty>
  </div>
</template>

<script setup lang="ts">
import { HideLoading, Loading } from '@/utils/toast'
import DetailItem from './consume-item.vue'
import { ConsumptionRecordAPIService } from '@/app/api/services/consumption-record-api'
import type { ConsumptionRecordMemberVo } from '@/app/api/models/consumption-record-member-vo'
import { ref } from 'vue'

const list = ref<ConsumptionRecordMemberVo[]>([])
const pageNo = ref(1)
const pageSize = 10
const isLoading = ref(false)

getDetails()
function loadMore() {
  if (!isLoading.value) {
    isLoading.value = true
    pageNo.value++
    getDetails()
  }
}
async function getDetails() {
  Loading('加载中...')
  const { e, data } = await ConsumptionRecordAPIService.consumptionRecordControllerMemberPage({
    page: pageNo.value,
    size: pageSize,
  })
  HideLoading()
  isLoading.value = false
  if (e) return
  list.value.push(...(data?.items || []))
}
</script>

<style lang="scss">
@import '@/styles/export.scss';

@include b(consume) {
  width: 100%;
  height: 100vh;
  background: #f7f7f7;

  @include e(content) {
    width: 100%;
    background: #f7f7f7;
    padding: 24rpx;
    box-sizing: border-box;
    height: calc(100vh - 44px);
  }

  .van-empty {
    padding-top: 180rpx;
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
