<script setup lang="ts">
import { ModalAdapter } from 'common-core/ant-design/modal/modal.adapter'
import { provide, reactive, ref, watch } from 'vue'
import FusionAnalysis from '../index.vue'
import { HOLOGRAM_DATA_TYPE_ENUM } from '../../../../api/modules/enum'

const props = defineProps({
  n: {
    type: String,
    default: 'fusion-analysis',
  },
})

const objId = ref('')
const objType = ref<HOLOGRAM_DATA_TYPE_ENUM>()
const lastTime = ref<number>()
const modal = reactive<ModalAdapter>({
  n: props.n,
  title: '融合轨迹',
  width: '100%',
  footer: null,
  wrapClassName: 'gl-full-modal',
})
const lastPosition = ref({})
provide('lastPosition', lastPosition)
watch(
  () => modal.preload,
  (v) => {
    objId.value = v.objId || ''
    if (typeof v === 'string') {
      objId.value = v
      objType.value = HOLOGRAM_DATA_TYPE_ENUM.人
      lastTime.value = undefined
    } else if (typeof v === 'object') {
      objId.value = v.objId || ''
      objType.value = v.objType || HOLOGRAM_DATA_TYPE_ENUM.人
      lastTime.value = v.lastTime
    } else {
      objId.value = ''
      objType.value = undefined
      lastTime.value = undefined
    }
    if (v.lastPosition) {
      lastPosition.value = v.lastPosition
    }
  }
)
</script>

<template>
  <c-modal class="fusion-analysis-modal" :c="modal">
    <FusionAnalysis
      :objId="objId"
      :objType="objType"
      :endTime="lastTime"
      :readonly="modal.preload.readonly"
    ></FusionAnalysis>
  </c-modal>
</template>

<style lang="scss">
@import 'common-core/styles/export.scss';

@include b(fusion-analysis-modal) {
  width: 100%;
  height: 100%;

  .ant-modal-body {
    padding: 0;
  }
}
</style>
