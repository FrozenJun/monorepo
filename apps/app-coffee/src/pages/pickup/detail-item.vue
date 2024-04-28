<template>
  <div class="detail-item">
    <div class="left">
      <image src="/static/icon.png" />

      <div class="detail-item__main">
        <div class="name">冰美式</div>
        <div class="desc">数量 *1 | No.9007 橘子水晶崇文酒店</div>
        <div class="code">
          已使用提货码：
          <div class="del">00948329</div>
        </div>
        <div class="time">03-18 11:32</div>
      </div>
    </div>
    <div class="right">
      <div class="status">已退回</div>
    </div>

    <div class="line"></div>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss">
@import '@/styles/export.scss';

detail-item {
  &:first-child {
    .detail-item {
      border-top-left-radius: 24rpx;
      border-top-right-radius: 24rpx;
    }
  }
  &:last-child {
    .detail-item {
      border-bottom-left-radius: 24rpx;
      border-bottom-right-radius: 24rpx;
    }
  }
}
@include b(detail-item) {
  width: 702rpx;
  display: flex;
  padding: 32rpx 24rpx 34rpx;
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  position: relative;

  .left {
    display: flex;

    image {
      width: 48rpx;
      height: 48rpx;
      margin-right: 24rpx;
    }

    @include e(main) {
      flex-direction: column;
      display: flex;
      flex: 1;

      .name {
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        font-size: 28rpx;
        color: #000000;
        line-height: 40rpx;
        text-align: left;
        font-style: normal;
        margin-bottom: 16rpx;
      }
      .desc {
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        font-size: 24rpx;
        color: #666666;
        line-height: 34rpx;
        text-align: left;
        font-style: normal;
        margin-bottom: 16rpx;
      }
      .code {
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        font-size: 24rpx;
        color: #666666;
        line-height: 34rpx;
        text-align: left;
        font-style: normal;
        margin-bottom: 16rpx;
        display: flex;
        align-items: center;
      }
      .del {
        text-decoration-line: line-through;
      }
      .time {
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        font-size: 24rpx;
        color: #888888;
        line-height: 34rpx;
        text-align: left;
        font-style: normal;
      }
    }
  }

  .right {
    margin-left: 16rpx;
    .status {
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      font-size: 24rpx;
      color: #ff8f1f;
      line-height: 34rpx;
      text-align: right;
      font-style: normal;
    }
  }

  .line {
    position: absolute;
    left: 96rpx;
    bottom: 0;
    width: 606rpx;
    height: 4rpx;
    background-color: #efefef;
  }
}
</style>
