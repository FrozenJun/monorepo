<template>
  <div class="balance-recharge">
    <div class="balance-recharge__main">
      <div class="blocks">
        <div
          class="item"
          @tap="active = index"
          v-for="(i, index) in list"
          :key="i.id"
          :class="[active === index && 'active']"
        >
          <div class="number">
            <div class="strong">{{ i.amount }}</div>
            元
          </div>
          <div class="desc">
            送{{ i.giftAmount }}到手
            <div class="strong">{{ i.giftAmount + i.amount }}元</div>
          </div>
        </div>
      </div>

      <van-button @tap="buy">立即充值</van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BalanceComboAPIService } from '@/app/api/services/balance-combo-api'
import { payBalance } from '@/utils/pay'
import { HideLoading, Loading, Toast } from '@/utils/toast'
import { onShow } from '@dcloudio/uni-app'
import { ref } from 'vue'

const list = ref<any[]>([])
const active = ref(0)

onShow(getList)
async function getList() {
  Loading('加载中...')
  const { e, data } = await BalanceComboAPIService.balanceComboControllerGetAll()
  HideLoading()
  if (e) return
  list.value =
    data?.map((i) => ({ ...i, amount: i.amount / 100, giftAmount: i.giftAmount / 100 })) || []
}
function buy() {
  const { id, amount, giftAmount } = list.value[active.value] || {}
  if (!id) return
  payBalance(id, () => {
    Toast('充值成功')
    wx.navigateTo({
      url: `/pages/balance/balance-result?amount=${amount}&giftAmount=${giftAmount}`,
    })
  })
}
</script>

<style lang="scss">
@import '@/styles/export.scss';

@include b(balance-recharge) {
  width: 100%;
  height: 100vh;
  background: #f7f7f7;
  padding: 24rpx;

  @include e(main) {
    width: 702rpx;
    height: 612rpx;
    background: #ffffff;
    border-radius: 16rpx;
    padding: 32rpx 28rpx 80rpx;
    display: flex;
    flex-direction: column;
    align-items: center;

    .blocks {
      width: 100%;
      height: 344rpx;
      display: flex;
      flex-wrap: wrap;
      gap: 20rpx;

      .item {
        width: 202rpx;
        height: 152rpx;
        background: #f8f9f9;
        border-radius: 8rpx;
        border: 2rpx solid #f8f9f9;
        margin-bottom: 20rpx;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        transition: border-color 0.3s;

        &.active {
          border-color: #fe5500;
          background: #fff6f2;
          .number {
            color: #fe5500;
          }
          .desc {
            color: #fe5500;
          }
        }

        .number {
          font-family: PingFangSC, PingFang SC;
          font-weight: 500;
          font-size: 34rpx;
          color: #1f1f1f;
          line-height: 56rpx;
          text-align: center;
          font-style: normal;
          margin-bottom: 8rpx;
          display: flex;
          align-items: flex-end;

          .strong {
            font-size: 40rpx;
            line-height: 56rpx;
            margin-right: 8rpx;
          }
        }
        .desc {
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          font-size: 24rpx;
          color: #666666;
          line-height: 34rpx;
          text-align: center;
          font-style: normal;
          display: flex;
          .strong {
            color: #fe5500;
          }
        }
      }
    }
  }

  .van-button {
    width: 646rpx;
    height: 96rpx;
    background: #fe5500;
    border-radius: 48rpx;
    margin-top: 60rpx;
    font-family: PingFangSC, PingFang SC;
    font-weight: 500;
    font-size: 32rpx;
    color: #ffffff;
    line-height: 44rpx;
    text-align: left;
    font-style: normal;
  }
}
</style>
