<script setup lang="ts">
const emits = defineEmits(['search'])
const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
})

function onSearch() {
  emits('search')
}
</script>

<template>
  <div class="fusion-search">
    <a-button type="primary" block @click="onSearch" :loading="loading">检索</a-button>
  </div>
</template>

<style lang="scss">
@import 'common-core/styles/export.scss';

@include b(fusion-search) {
  width: 100%;
  height: fit-content;
  position: absolute;
  background: #fff;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0 12px 12px;
}
</style>
