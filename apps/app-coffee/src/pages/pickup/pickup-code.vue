<template>
  <div class="pickup-code">
    <div class="pickup-code__bg"></div>

    <div class="pickup-code__title">提货码</div>

    <div class="pickup-code__main">
      <div class="block">
        <div class="left">
          <div class="name">提货码</div>
          <div class="count">
            <div class="strong">{{ pickupCodeCount }}</div>
            <div class="unit">张</div>
          </div>
        </div>

        <div v-if="isLogin" class="right" @tap="toDetail">
          使用明细<image src="/static/arr-right@2x.png" />
        </div>
      </div>

      <div class="item" v-for="i in renderUnusedPks" :key="i.code">
        <image src="/static/pickup-bg@2x.png" />
        <div class="name">提货码</div>
        <div class="code">{{ i.code }}</div>
      </div>

      <div
        v-if="isLogin && unusedPickups.length > 3"
        @tap="isExpand = !isExpand"
        class="expand"
        :class="[isExpand && 'is-expanded']"
      >
        {{ isExpand ? '点击收起' : '展开全部' }}
        <image src="/static/arr-right@2x.png" />
      </div>
    </div>

    <div class="pickup-code__buy">
      <div class="title">套餐购买</div>

      <div v-for="i in pickups" :key="i.id" class="item">
        <div class="item-left">
          <div class="name">提货码{{ i.count }}张</div>
          <div class="desc">每杯低至{{ i.price }}元</div>
        </div>

        <div class="item-right">
          <div class="price">
            <div class="origin">{{ PICKUP_ORIGIN_PRICE * i.count }}元</div>
            <div class="strong">{{ i.amount }}</div>
            <div class="unit">元</div>
          </div>
          <van-button block round @tap="buyPickup(i)">购买</van-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PickupCodeAPIService } from '@/app/api/services/pickup-code-api'
import { PickupCodeComboAPIService } from '@/app/api/services/pickup-code-combo-api'
import { PICKUP_ORIGIN_PRICE } from '@/app/constant/global'
import { useAuthStore } from '@/store/auth'
import { payPickup } from '@/utils/pay'
import { Toast } from '@/utils/toast'
import { onShow } from '@dcloudio/uni-app'
import { computed } from 'vue'
import { ref } from 'vue'

const authStore = useAuthStore()
const isLogin = computed(() => authStore.token)

const unusedPickups = ref<any[]>([])
const pickups = ref<any[]>([])
const isExpand = ref(false)
const pickupCodeCount = computed(() => {
  return isLogin.value ? unusedPickups.value.length : 0
})
const renderUnusedPks = computed(() => {
  return isLogin.value ? unusedPickups.value.filter((i, index) => isExpand.value || index < 3) : []
})

onShow(() => {
  getAllPickup()
  isLogin.value && getUnusedPickups()
})
async function getAllPickup() {
  const { e, data } = await PickupCodeComboAPIService.pickupCodeComboControllerGetAll()
  if (e || !data) return
  pickups.value = data.map((i) => ({
    ...i,
    amount: i.amount / 100,
    price: Math.round((i.amount / 100 / i.count) * 100) / 100,
    discount: (PICKUP_ORIGIN_PRICE - i.amount / 100) * i.count,
  }))
}
async function getUnusedPickups() {
  const { e, data } = await PickupCodeAPIService.pickupCodeControllerGetMemberUnused()
  if (e || !data) return
  unusedPickups.value = data
}
function buyPickup({ id, count, amount }: any) {
  validateLogin() &&
    payPickup(id, () => {
      Toast('购买成功')
      wx.navigateTo({
        url: `/pages/pickup/pickup-buy?count=${count}&amount=${amount}`,
      })
    })
}

function toDetail() {
  wx.navigateTo({ url: '/pages/pickup/pickup-detail' })
}
function validateLogin() {
  if (!isLogin.value) {
    wx.navigateTo({ url: '/pages/auth/login' })
  } else {
    return true
  }
}
</script>

<style lang="scss">
@import '@/styles/export.scss';

@include b(pickup-code) {
  width: 100%;
  min-height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #f7f7f7;

  @include e(bg) {
    position: absolute;
    left: 0;
    top: 0;
    width: 750rpx;
    height: 362rpx;
    background: linear-gradient(180deg, #fcd287 0%, #f7f7f7 100%);
    z-index: 0;
  }
  @include e(title) {
    position: relative;
    margin-top: 110rpx;
    margin-bottom: 38rpx;
    font-family: PingFangSC, PingFang SC;
    font-weight: 500;
    font-size: 34rpx;
    color: #000000;
    line-height: 44rpx;
    text-align: center;
    font-style: normal;
  }
  @include e(main) {
    width: 686rpx;
    background: #ffffff;
    border-radius: 16rpx;
    position: relative;
    padding: 32rpx 32rpx 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 24rpx;

    .block {
      width: 622rpx;
      height: 154rpx;
      border-bottom: 2rpx solid rgba(0, 0, 0, 0.06);
      display: flex;
      justify-content: space-between;
      padding: 0 0 32rpx 16rpx;
      align-items: center;
      margin-bottom: 46rpx;

      .left {
        display: flex;
        flex-direction: column;
        .name {
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          font-size: 28rpx;
          color: #000000;
          line-height: 40rpx;
          text-align: left;
          font-style: normal;
          opacity: 0.5;
        }
        .count {
          display: flex;
          align-items: flex-end;
        }
        .strong {
          font-family: DINPro, DINPro;
          font-weight: bold;
          font-size: 64rpx;
          color: #000000;
          line-height: 82rpx;
          text-align: left;
          font-style: normal;
        }
        .unit {
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          font-size: 24rpx;
          color: #000000;
          line-height: 34rpx;
          text-align: left;
          font-style: normal;
          margin-left: 8rpx;
          margin-bottom: 9rpx;
          opacity: 0.5;
        }
      }
      .right {
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        font-size: 24rpx;
        color: #666666;
        line-height: 34rpx;
        text-align: right;
        font-style: normal;
        display: flex;
        align-items: center;

        image {
          width: 24rpx;
          height: 24rpx;
        }
      }
    }

    .item {
      margin-bottom: 32rpx;
      width: 622rpx;
      height: 92rpx;
      position: relative;
      padding: 26rpx 0 26rpx 54rpx;
      display: flex;
      align-items: center;

      image {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: 0;
      }
      .name {
        position: relative;
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        font-size: 28rpx;
        color: #f95731;
        line-height: 40rpx;
        text-align: left;
        font-style: normal;
        margin-right: 132rpx;
      }
      .code {
        position: relative;
        font-family: DINPro, DINPro;
        font-weight: 500;
        font-size: 40rpx;
        color: #f95731;
        line-height: 52rpx;
        text-align: left;
        font-style: normal;
      }
    }
    .expand {
      display: flex;
      align-items: center;
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      font-size: 24rpx;
      color: #666666;
      line-height: 34rpx;
      text-align: right;
      font-style: normal;
      margin-bottom: 32rpx;

      &.is-expanded {
        image {
          transform: rotate(270deg);
        }
      }

      image {
        transition: all 0.3s;
        width: 24rpx;
        height: 24rpx;
        transform: rotate(90deg);
        margin-left: 16rpx;
      }
    }
  }

  @include e(buy) {
    width: 686rpx;
    background: #ffffff;
    border-radius: 16rpx;
    position: relative;
    padding: 24rpx 24rpx 0;
    display: flex;
    flex-direction: column;

    .title {
      font-family: PingFangSC, PingFang SC;
      font-weight: 500;
      font-size: 32rpx;
      color: #000000;
      line-height: 44rpx;
      text-align: left;
      font-style: normal;
      margin-bottom: 32rpx;
    }

    .item {
      width: 638rpx;
      height: 172rpx;
      background: #fff9f3;
      border-radius: 8rpx;
      padding: 32rpx;
      margin-bottom: 24rpx;
      display: flex;
      justify-content: space-between;
    }
    .item-left {
      display: flex;
      flex-direction: column;
      .name {
        margin-bottom: 10rpx;
        font-family: PingFangSC, PingFang SC;
        font-weight: 500;
        font-size: 32rpx;
        color: #000000;
        line-height: 44rpx;
        text-align: left;
        font-style: normal;
      }
      .desc {
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        font-size: 24rpx;
        color: #666666;
        line-height: 34rpx;
        text-align: left;
        font-style: normal;
      }
    }
    .item-right {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-end;

      .price {
        margin-bottom: 18rpx;
        display: flex;
        align-items: flex-end;
      }
      .origin {
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        font-size: 24rpx;
        color: #999999;
        line-height: 1;
        text-align: left;
        font-style: normal;
        text-decoration-line: line-through;
        margin-right: 8rpx;
      }
      .strong {
        font-family: PingFangSC, PingFang SC;
        font-weight: 500;
        font-size: 40rpx;
        color: #fe5500;
        line-height: 1;
        text-align: left;
        font-style: normal;
        margin-right: 2rpx;
      }
      .unit {
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        font-size: 24rpx;
        color: #fe5500;
        line-height: 1;
        text-align: left;
        font-style: normal;
      }

      .van-button {
        width: 120rpx;
        height: 48rpx;
        background: linear-gradient(270deg, #fe2f2b 0%, #fe612c 100%);
        border-radius: 24rpx;
        padding: 0 36rpx;

        font-family: PingFangSC, PingFang SC;
        font-weight: 500;
        font-size: 24rpx;
        color: #ffffff;
        line-height: 2;
        text-align: left;
        font-style: normal;
      }
    }
  }
}
</style>
