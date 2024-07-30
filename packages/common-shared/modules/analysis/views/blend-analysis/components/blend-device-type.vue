<script setup lang="ts">
import { DETECT_TYPE, DEVICE_TYPE } from '@/api/modules/enum'
import { getDetectIcon, getDeviceIcon } from '@/app/utils/get-data/map.data'
import { computed, ref, watch, PropType } from 'vue'

const props = defineProps({
  modelValue: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
  type: {
    type: String as PropType<'device' | 'detect'>,
    default: 'detect',
  },
})
const emits = defineEmits(['update:modelValue'])
const model = ref<string[]>([])
watch(
  () => props.modelValue,
  (v) => {
    model.value = v
  },
  {
    immediate: true,
  }
)

const deviceList = computed(() => {
  return props.type === 'detect'
    ? DETECT_TYPE.filter((i) => !['身份证', '手机号'].includes(i.label)).map((item) => {
        const icon = getDetectIcon(item.value)
        return {
          icon,
          ...item,
        }
      })
    : DEVICE_TYPE.map((item) => {
        const icon = getDeviceIcon(item.value)
        return {
          icon,
          ...item,
        }
      })
})

function onDeviceChoose(device: Record<string, any>) {
  const value = device.value
  if (model.value.includes(value)) {
    model.value = model.value.filter((v) => v !== value)
  } else {
    model.value.push(value)
  }
  emits('update:modelValue', model.value)
}
</script>

<template>
  <div class="fusion-device-type">
    <a-tooltip
      v-for="(device, index) in deviceList"
      :key="index"
      :title="device.label"
      :overlayStyle="{ fontSize: '12px' }"
    >
      <div
        :class="['fusion-device-type__icon', model.includes(device.value) && 'is-active']"
        @click="onDeviceChoose(device)"
      >
        <i :class="['iconfont', device.icon]"></i>
      </div>
    </a-tooltip>
  </div>
</template>

<style lang="scss">
@import 'common-core/styles/export.scss';

@include b(fusion-device-type) {
  display: flex;
  width: 100%;
  justify-content: space-between;
  @include e(tooltip) {
    font-size: 12px;
  }
  @include e(icon) {
    align-items: center;
    justify-content: center;
    color: #d9d9d9;
    border: 1px solid #d9d9d9;
    cursor: pointer;
    display: flex;
    flex-shrink: 0;
    font-size: 12px;
    height: 42px;
    position: relative;
    width: 42px;
    transition: all 0.3s;
    &:hover {
      border: 1px solid #09f;
    }
    @include when(active) {
      border: 1px solid #09f;
      color: #09f;
    }

    i {
      font-size: 24px;
    }
  }
}
</style>
