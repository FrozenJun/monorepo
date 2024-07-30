<script setup lang="ts">
import { TrackIcon } from '../../map.dto'
import { PropType, computed, ref } from 'vue'
import TrackPeerLine from './map-track-peer-line.vue'

const props = defineProps({
  trackData: {
    type: Array as PropType<TrackIcon[]>,
    default: () => [],
  },
})
const activeKey = ref('1')
const tracks = computed(() => {
  return props.trackData.filter((track) => activeKey.value === '1' || track.type === 'peer')
})
</script>

<template>
  <div class="track-peer">
    <a-tabs v-model:activeKey="activeKey" centered>
      <a-tab-pane key="1" tab="全部点位">
        <TrackPeerLine :tracks="tracks"></TrackPeerLine>
      </a-tab-pane>
      <a-tab-pane key="2" tab="同行点位">
        <TrackPeerLine :tracks="tracks"></TrackPeerLine>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<style lang="scss">
@import 'common-core/styles/export.scss';
@include b(track-peer) {
  height: 100%;
  .ant-tabs-top > .ant-tabs-nav {
    margin: 0px;
  }
  .ant-tabs {
    height: 100%;
  }
  .ant-tabs-content {
    height: calc(100% - 100px);
  }
}
</style>
