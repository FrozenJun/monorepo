<script setup lang="ts">
import { inject, PropType, Ref, ref, watch } from 'vue'
import { VcOverlayHtmlProps, VcOverlayHtml } from 'vue-cesium'
import { VcReadyObject } from 'vue-cesium/es/utils/types'

defineProps({
  options: {
    type: Object as PropType<VcOverlayHtmlProps>,
    default: () => ({}),
  },
})
const vc = inject<Ref<VcReadyObject>>('vcReadyObjectRef')

const htmlRef = ref()
watch(htmlRef, (v: HTMLElement) => {
  if (v) {
    v.addEventListener('wheel', (e) => {
      e.preventDefault()
      vc?.value.viewer.scene.canvas.dispatchEvent(new WheelEvent(e.type, e))
    })

    // Listen for mouse events on the overlay and dispatch them to Cesium
    // v.addEventListener('mousedown', function (event) {
    //   dispatchCesiumMouseEvent('mousedown', event)
    // })

    // v.addEventListener('mouseup', function (event) {
    //   dispatchCesiumMouseEvent('mouseup', event)
    // })

    // v.addEventListener('mousemove', function (event) {
    //   dispatchCesiumMouseEvent('mousemove', event)
    // })

    v.addEventListener('wheel', function (event) {
      dispatchCesiumMouseEvent('wheel', event)
    })
  }
})

function dispatchCesiumMouseEvent(type, originEvent) {
  if (!vc) return
  let scene = vc.value.viewer.scene

  let event
  if (type === 'wheel') {
    event = new WheelEvent('wheel', originEvent)
  } else {
    event = new MouseEvent(type, originEvent)
  }

  const res = scene.canvas.dispatchEvent(event)
}
</script>

<template>
  <VcOverlayHtml class="cesium-overlay-html" v-bind="options">
    <div class="cesium-overlay-html__container" ref="htmlRef">
      <slot></slot>
    </div>
  </VcOverlayHtml>
</template>

<style lang="scss">
@import 'common-core/styles/export.scss';

$working-color: #3d7eff;
$online-color: #45cbae;
$offline-color: #4b4d5c;
$fault-color: #e94e4e;

@include b(cesium-overlay-html) {
  @include e(container) {
    position: relative;
    // transform: translate(-50%, -50%);
  }
}
</style>
