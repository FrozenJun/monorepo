<script setup lang="ts">
import { TrackIcon, TrackPointCollection } from '../../map.dto'
import dayjs from 'dayjs'
import { PropType, computed } from 'vue'
import CollectionLineCard from './collection-line-card.vue'

const props = defineProps({
  track: {
    type: Object as PropType<TrackIcon>,
    default: () => ({}),
  },
  isPeer: Boolean,
})

const cardData = computed(() => {
  const item = (props.track.points[0].children || props.track.points).find(
    (item) => item.theme === (props.isPeer ? 'peer' : 'default')
  )
  return { ...item.collections[0], imsi: item.name }
})

function getTime(point: TrackPointCollection, isPeer?: boolean) {
  let startTime: string | undefined
  let endTime: string | undefined
  if (point.children?.length) {
    const item = point.children.find((item) => item.theme === (isPeer ? 'peer' : 'default'))
    startTime = item?.startTime
    endTime = item?.endTime
  } else {
    startTime = point.startTime
    endTime = point?.endTime
  }
  return {
    startTime: dayjs(startTime).format('HH:mm'),
    endTime: dayjs(endTime).format('HH:mm'),
  }
}
</script>

<template>
  <div class="map-track-peer-line-card">
    <CollectionLineCard
      v-bind="$attrs"
      v-if="$attrs.isPeerDetail"
      :data="cardData"
    ></CollectionLineCard>
    <div v-else class="map-track-peer-line-card__line">
      <a-tooltip>
        <template #title v-if="track.device.name?.length && track.device.name?.length > 9">
          {{ track.device.name }}
        </template>
        <div class="map-track-peer-line-card__deviceName">{{ track.device.name }}</div>
      </a-tooltip>

      <div class="time">
        {{ getTime(track.points[0], isPeer).startTime }}-{{
          getTime(track.points[0], isPeer).endTime
        }}
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import 'common-core/styles/export.scss';

@include b(map-track-peer-line-card) {
  @include e(line) {
    padding: 4px;
  }
  @include e(deviceName) {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
