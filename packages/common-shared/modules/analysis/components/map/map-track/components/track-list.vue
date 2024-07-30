<script setup lang="ts">
import { TrackIcon } from '../../map.dto'
import dayjs from 'dayjs'
import { PropType, computed, ref } from 'vue'

const props = defineProps({
  trackData: {
    type: Array as PropType<TrackIcon[]>,
    default: () => [],
  },
  activeIndexArr: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
})
const trackList = computed(() => {
  const res: { date: string; list: (TrackIcon & { no: number; icon: string })[] }[] = []
  const len = props.trackData.length
  props.trackData.forEach((item, index) => {
    const timeArr = item.startTime?.split(' ') || []
    const date = timeArr[0]
    const track = res.find((item) => item.date === date)
    const no = len - index
    const icon = ''
    if (track) {
      track.list.push({ ...item, no, icon })
    } else {
      res.push({
        date,
        list: [{ ...item, no, icon }],
      })
    }
  })
  return res
})
const emits = defineEmits(['onCardClick'])

function onClick(item: TrackIcon) {
  emits('onCardClick', item)
}
</script>

<template>
  <div class="track-list gl-scroll-bar">
    <div v-for="(track, index) in trackList" class="track-list__item" :key="index">
      <div class="track-list__date">{{ track.date }}</div>
      <div
        v-for="(item, index) in track.list"
        :key="index"
        @click="onClick(item)"
        :class="['track-list__content', activeIndexArr.includes(item.index) && 'is-active']"
      >
        <div class="track-list__left">
          {{ item.index }}. &nbsp;
          <div class="track-list__name">
            {{ item.device.name }}
          </div>
          <i :class="['iconfont', item.icon]"></i>
        </div>
        <div class="track-list__time">
          {{
            item.startTime === item.endTime
              ? dayjs(item.startTime).format('HH:mm:ss')
              : `${dayjs(item.startTime).format('HH:mm:ss')}-${dayjs(item.endTime).format(
                  'HH:mm:ss'
                )}`
          }}
        </div>
      </div>
    </div>
    <div class="track-list__empty" v-if="!trackList.length">
      <a-empty></a-empty>
    </div>
  </div>
</template>

<style lang="scss">
@import 'common-core/styles/export.scss';
@mixin active {
  font-weight: 550;
  color: rgba(0, 0, 0, 0.85);
  background: rgba(0, 0, 0, 0.04);
}
@include b(track-list) {
  padding: 0px 16px 16px 16px;
  overflow-y: auto;

  @include e(item) {
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 550;
    line-height: 20px;
    padding-bottom: 16px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    @include e(date) {
      color: rgba(0, 0, 0, 0.85);
      padding: 16px 0px 12px 0;
    }
    @include e(content) {
      @include when(active) {
        @include active();
      }
      padding: 0px 4px;
      &:hover {
        @include active();
      }
      cursor: pointer;
      margin-bottom: 8px;
      font-weight: 400;
      font-size: 12px;
      color: rgba(0, 0, 0, 0.65);
      display: flex;
      justify-content: space-between;
      @include e(left) {
        display: flex;
        align-items: center;
        @include e(name) {
          padding-right: 8px;
          max-width: 150px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
  @include e(empty) {
    height: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
