<script setup lang="ts">
import { FormAdapter } from 'common-core/ant-design/form/form.adapter'
import dayjs, { Dayjs } from 'dayjs'
import { nextTick, onMounted, reactive, ref, watch } from 'vue'

const emits = defineEmits(['timeChange'])
const props = defineProps({
  endTime: {
    type: Number,
  },
})

watch(
  () => props.endTime,
  (v) => {
    if (v) {
      console.log(v)
      nextTick(() => {
        dateRange.models!.dateRangeValue = [dayjs(v - 86400 * 1000 * 30), dayjs(v)]
        emits('timeChange', dateRange.models!.dateRangeValue)
      })
    }
  },
  {
    immediate: true,
  }
)

const dates = ref<[Dayjs | null, Dayjs | null]>()
const dateRange = reactive<FormAdapter>({
  itemWidth: '100%',
  layout: 'vertical',
  formItems: [
    {
      label: '检索时间',
      type: 'range-picker',
      prop: 'dateRangeValue',
      control: {
        ranges: {
          近1天: [dayjs(+new Date() - 1 * 86400 * 1000), dayjs(new Date())],
          近3天: [dayjs(+new Date() - 3 * 86400 * 1000), dayjs(new Date())],
          近一周: [dayjs(+new Date() - 7 * 86400 * 1000), dayjs(new Date())],
          近一月: [dayjs(+new Date() - 30 * 86400 * 1000), dayjs(new Date())],
        },
        format: 'YYYY-MM-DD HH:mm',
        showTime: {
          format: 'HH:mm',
        },
        allowClear: false,
        disabledDate(current: Dayjs) {
          if (current.valueOf() > new Date().getTime()) return true
          if (
            !dates.value ||
            (dates.value as any).length === 0 ||
            (dates.value[0] && dates.value[1])
          ) {
            return false
          }
          const tooLate = dates.value[0] && current.diff(dates.value[0], 'days') > 30
          const tooEarly = dates.value[1] && dates.value[1].diff(current, 'days') > 30
          return !!tooEarly || !!tooLate
        },
        onCalendarChange(v: any, dateStrings, { range }) {
          dates.value = v
          if (dates.value && dates.value[0] && dates.value[1]) {
            // 间隔超过30天清除另一个
            if (range === 'start' && v[1].diff(v[0], 'days') > 30) {
              dates.value![1] = null
              dateRange.models!.dateRangeValue[1] = null
            } else if (range === 'end' && v[1].diff(v[0], 'days') > 30) {
              dates.value![0] = null
              dateRange.models!.dateRangeValue[0] = null
            } else {
              emits('timeChange', v)
            }
          }
        },
        onOk(v) {
          if (v && v.length && v[0] && v[1]) return
        },
      },
    },
  ],
  models: {
    dateRangeValue: [dayjs(+new Date() - 86400 * 1000 * 30), dayjs(+new Date())],
  },
})

onMounted(() => {
  emits('timeChange', dateRange.models!.dateRangeValue)
})
</script>

<template>
  <c-form :c="dateRange" class="fusion-time"> </c-form>
</template>

<style lang="scss">
@import 'common-core/styles/export.scss';
@include b(fusion-time) {
  width: 100%;
  background: #fff;
  .ant-picker-input > input {
    font-family: 'Helvetica Neue', Arial, Helvetica, sans-serif;
    font-size: 12px;
    line-height: 24px;
  }
  .ant-picker-range-separator {
    padding: 0 4px;
  }
}
</style>
