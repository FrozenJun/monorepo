<script setup lang="ts">
import emptyImg from '../../../assets/images/empty/search-empty.png'

const props = defineProps({
  searched: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <a-empty
    class="fusion-obj-empty"
    :image="emptyImg"
    :imageStyle="{ display: 'flex', justifyContent: 'center' }"
    :description="searched ? '没有找到相关信息' : '输入信息以开始检索'"
  >
    <slot></slot>
  </a-empty>
</template>

<style lang="scss">
@import 'common-core/styles/export.scss';

@include b(fusion-obj-empty) {
  width: 100%;
  flex: 1;
  margin: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .ant-empty-description {
    color: #999;
  }
}
</style>
