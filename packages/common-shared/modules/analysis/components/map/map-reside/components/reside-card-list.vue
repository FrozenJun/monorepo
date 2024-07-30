<script setup lang="ts">
import { PropType } from 'vue'
import ResideCard from './reside-card.vue'
import Pagination from 'commom-core/ant-design/pagination/pagination.vue'

const props = defineProps({
  loading: Boolean,
  deviceData: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
  activeDeviceId: String,
  pagination: {
    type: Object as PropType<PaginationAdapter>,
    default: () => ({}),
  },
})
defineEmits(['card-click'])
</script>
<template>
  <a-spin :spinning="loading">
    <div class="reside-card-list__main gl-scroll-bar" v-if="deviceData.length">
      <ResideCard
        class="reside-card-list__card"
        v-for="item in deviceData"
        :data="item"
        @click="$emit('card-click', item)"
        :isActive="activeDeviceId === item.id"
      ></ResideCard>
    </div>
    <div class="reside-card-list__empty" v-else><a-empty></a-empty></div>
    <div class="reside-card-list__footer" v-if="deviceData.length">
      <div class="total">共{{ pagination.total || 0 }}条</div>
      <Pagination :c="pagination"></Pagination>
    </div>
  </a-spin>
</template>
<style lang="scss">
@import 'common-core/styles/export.scss';
@include b(reside-card-list) {
  @include e(main) {
    height: 100%;
    overflow-y: auto;
    @include e(card) {
      margin-top: 8px;
      cursor: pointer;
      @include e(empty) {
        display: flex;
        flex-direction: column;
        justify-content: center;
        height: 50vh;
      }
      @include e(footer) {
        .total {
          color: rgb(102, 102, 102);
        }
        padding: 8px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }
  }
}
</style>
