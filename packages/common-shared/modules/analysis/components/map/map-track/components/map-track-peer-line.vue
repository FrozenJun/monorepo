<script setup lang="ts">
import { TrackIcon } from '../../map.dto'
import dayjs from 'dayjs'
import { PropType, computed } from 'vue'
import MapTrackPeerLineCard from './map-track-peer-line-card.vue'
const props = defineProps({
  tracks: {
    type: Array as PropType<TrackIcon[]>,
    default: () => [],
  },
  isDetail: {
    type: Boolean,
  },
})
const navbarInfo = computed(() => {
  const points = props.tracks.find((item) => item.type === 'peer')?.points
  if (points) {
    const targetName = points[0].children.find((item) => item.theme === 'default')?.name
    const subjectName = points[0].children.find((item) => item.theme === 'peer')?.name
    return {
      targetName,
      subjectName,
    }
  }
  return {}
})
const trackLine = computed(() => {
  // 一个点位有多个设备采集
  const track: (TrackIcon | any)[] = []
  props.tracks.forEach((item) => {
    if (item.points.length > 1) {
      for (let i = 1; i < item.points.length; i++) {
        track.push({
          ...item,
          points: [item.points[i]],
          startTime: item.points[i].startTime,
          endTime: item.points[i].endTime,
        })
      }
    }
  })
  const allPoints = [...props.tracks, ...track].sort(
    (a: any, b: any) => +dayjs(b.startTime) - +dayjs(a.startTime)
  )
  const res: { startDay: string; trackData: TrackIcon[] }[] = []
  allPoints.forEach((track) => {
    const startDay = dayjs(track.startTime).format('YYYY-MM-DD')
    const item = res.find((item) => item.startDay === startDay)
    if (item) {
      item.trackData.push(track)
    } else {
      res.push({ startDay, trackData: [track] })
    }
  })
  return res
})
</script>

<template>
  <div class="track-peer-line">
    <div class="track-peer-line__navbar">
      <div class="track-peer-line__navbar-item">
        <div class="guide target"></div>
        {{ navbarInfo.targetName }}
      </div>
      <div class="track-peer-line__navbar-item">
        <div class="guide peer"></div>
        同行
      </div>
      <div class="track-peer-line__navbar-item">
        <div class="guide subject"></div>
        {{ navbarInfo.subjectName }}
      </div>
    </div>
    <div class="track-peer-line__content gl-scroll-bar">
      <a-timeline v-for="(line, index) in trackLine" mode="left" :key="index">
        <div class="track-peer-line__startDay">{{ line.startDay }}</div>
        <template v-for="(item, index) in line.trackData" :key="index">
          <a-timeline-item
            :color="item.type === 'peer' ? 'red' : item.theme === 'default' ? 'blue' : 'green'"
          >
            <template #dot v-if="item.type === 'peer'">
              <div class="track-peer-line__dot">同</div>
            </template>
            <!-- 时间轴左边 -->
            <template #label>
              <div
                :class="['track-peer-line__info', item.type === 'peer' && 'is-peer']"
                v-if="item.theme === 'default'"
              >
                <MapTrackPeerLineCard
                  :isPeerDetail="isDetail"
                  :isReverse="true"
                  :track="item"
                ></MapTrackPeerLineCard>
              </div>
            </template>
            <!-- 时间轴右边 -->
            <div
              :class="['track-peer-line__info', item.type === 'peer' && 'is-peer']"
              v-if="item.type === 'peer' || item.theme === 'peer'"
            >
              <MapTrackPeerLineCard
                :isPeerDetail="isDetail"
                :track="item"
                :is-peer="true"
              ></MapTrackPeerLineCard>
            </div>
            <div v-else style="height: 64px"></div>
          </a-timeline-item>
        </template>
      </a-timeline>
    </div>
  </div>
</template>

<style lang="scss">
@import 'common-core/styles/export.scss';

@include b(track-peer-line) {
  font-family: PingFangSC-Regular, PingFang SC;
  height: 100%;
  @include e(navbar) {
    display: flex;
    justify-content: space-around;
    background: rgba(24, 144, 255, 0.04);
    height: 44px;
    align-items: center;
    margin-bottom: 12px;
    @include e(navbar-item) {
      display: flex;
      align-items: center;
      .guide {
        width: 15px;
        height: 1px;
        font-size: 14px;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.65);
        line-height: 12px;
        margin-right: 4px;
      }
      .target {
        border: 4px solid #1890ff;
      }
      .peer {
        border: 4px solid #f54336;
      }
      .subject {
        border: 4px solid #02bd00;
      }
    }
  }
  @include e(content) {
    height: 100%;
    overflow-y: auto;
    padding: 0 15px;
    @include e(startDay) {
      display: flex;
      justify-content: center;
      font-size: 14px;
      font-weight: 550;
      color: rgba(0, 0, 0, 0.85);
      line-height: 22px;
      margin-bottom: 8px;
    }
    @include e(dot) {
      width: 20px;
      height: 20px;
      background: #f54336;
      border-radius: 50%;
      font-size: 12px;
      font-weight: 500;
      color: #ffffff;
      line-height: 20px;
    }
    @include e(info) {
      padding: 4px;
      background: #f7f7f7;
      font-size: 14px;
      font-weight: 400;
      line-height: 22px;
      @include e(card) {
        border-bottom: 0px;
      }
      .deviceName {
        color: rgba(0, 0, 0, 0.85);
        padding-bottom: 4px;
      }
      .time {
        color: rgba(0, 0, 0, 0.45);
      }
      @include when(peer) {
        background-color: rgba(255, 236, 235, 1);
        .deviceName,
        .card-device-collection__code {
          color: rgba(245, 67, 54, 1);
        }
      }
    }
  }
  .ant-timeline-item {
    padding-bottom: 12px;
  }
  .ant-timeline.ant-timeline-label .ant-timeline-item-label {
    left: -7px;
  }
}
</style>
