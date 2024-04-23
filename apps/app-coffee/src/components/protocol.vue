<template>
  <van-checkbox
    :value="checked"
    checked-color="#006241"
    @change="checked = !checked"
    class="protocol"
    >我已阅读、理解并接受以下规定
    <navigator class="navigator" url="/pages/protocols/coffee-protocol"
      >《耀美咖啡用户协议》</navigator
    >
    <navigator class="navigator" url="/pages/protocols/privacy-protocol">《隐私协议》</navigator>
    <navigator class="navigator" url="/pages/protocols/pay-protocol">《支付协议》</navigator>
  </van-checkbox>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const checked = ref(false)
</script>

<style lang="scss">
.protocol {
  display: block;
  width: 654rpx;
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 22rpx;
  line-height: 38rpx;
  text-align: left;
  font-style: normal;
  margin: 0 auto;

  .van-checkbox__label {
    color: #999999;
  }

  .navigator {
    display: inline-block;
    color: #006241;
  }
}
</style>
