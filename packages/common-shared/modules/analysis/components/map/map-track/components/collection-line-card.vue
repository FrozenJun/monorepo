<script setup lang="ts">
import { TrackCollectionLine } from '../../map.dto'
import dayjs from 'dayjs'
import { PropType, computed } from 'vue'
import MapPopoverDevice from '../components/map-popover-device.vue'
const props = defineProps({
  data: {
    type: Object as PropType<TrackCollectionLine>,
    default: () => ({}),
  },
})

const time = computed(() => {
  if (props.data.startTime === props.data.endTime) {
    return `${dayjs(props.data.startTime).format('HH:mm')}`
  } else {
    return `${dayjs(props.data.startTime).format('HH:mm')}-${dayjs(props.data.endTime).format(
      'HH:mm'
    )}`
  }
})
</script>

<template>
  <div :class="['collection-line-card', !$attrs.isPeerDetail && 'is-show-border']">
    <div class="collection-line-card__date" v-if="data.date">{{ data.date }}</div>
    <div :class="['collection-line-card__content', $attrs.isReverse && 'is-reverse']" v-else>
      <div class="collection-line-card__left">
        <div class="collection-line-card__code">{{ data.objCode || data.imsi }}</div>
        <div class="collection-line-card__time">
          {{ time }}
        </div>
      </div>
      <div class="collection-line-card__right">
        <MapPopoverDevice
          :placement="$attrs.isReverse ? 'left' : 'right'"
          :device="data.device"
        ></MapPopoverDevice>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import 'common-core/styles/export.scss';

@include b(collection-line-card) {
  padding: 4px;
  @include when(show-border) {
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  }
  font-family: PingFangSC-Regular, PingFang SC;
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  color: rgba(0, 0, 0, 0.85);
  @include e(date) {
    font-weight: 550;
  }
  @include e(content) {
    display: flex;
    justify-content: space-between;
    align-items: start;
    @include e(left) {
      @include e(img) {
        width: 40px;
        height: 40px;
      }
      @include e(time) {
        padding-top: 4px;
        color: rgba(0, 0, 0, 0.45);
      }
    }
    @include when(reverse) {
      flex-direction: row-reverse;
    }
  }
}
</style>
