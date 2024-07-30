<template>
  <!-- bug?: 向Cascader内部添加任何slot甚至是注释都会导致Cascader消失 -->
  <Cascader
    :class="className"
    :ref="$options.name"
    v-bind="binds"
    :value="attrs.modelValue"
    @update:value="update"
  >
  </Cascader>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive, watch } from 'vue'
import {
  CascaderAdapter,
  CascaderBindsOmitKeys,
  CASCADER_DEFAULT,
  cascaderSlots,
} from './cascader.adapter'
import { COMPONENT_NAME, COMPONENT_TYPE } from '../../utils/constants/component'
import { useProvider } from '../../utils/hooks/useProvider'
import { useCommonSetup } from '../../utils/hooks/useCommonSetup'
import { useComputeAttrs } from '../../utils/hooks/useComputeAttrs'
import { useCascader } from './cascader.use'
import { Cascader } from 'ant-design-vue'
import { dasherize } from 'common-base/pipe/string'
import _ from 'lodash'

export default defineComponent({
  name: COMPONENT_NAME.cascader,
  inheritAttrs: false,
  components: { Cascader },
  emits: ['output-change', 'update:modelValue'],
  props: {
    c: {
      type: Object as PropType<CascaderAdapter>,
      default: () => reactive({}),
    },
    n: {
      type: String,
    },
    modelValue: {
      type: [Array] as PropType<string[] | number[]>,
      default: () => [],
    },
  },
  setup(props, ctx) {
    const type = COMPONENT_TYPE.cascader
    const className = dasherize(COMPONENT_NAME.cascader)

    /** 合并配置，获取attrs */
    const { attrs, binds } = useComputeAttrs<CascaderAdapter>({
      props,
      defaultOption: CASCADER_DEFAULT,
      type,
      omitKeys: CascaderBindsOmitKeys,
    })

    /** 组件输出 */
    const { output } = useCascader({ props, attrs, ctx })

    /** 注册、注销组件 */
    useProvider({ attrs, output, type, ctx })

    /** 组件通用setup */
    const { computedSlots } = useCommonSetup({
      attrs,
      output,
      slotTypes: cascaderSlots,
    })

    /** BUG - TODO
     * attrs.value.modelValue为undefined会触发一次newValue为上次trigger旧值的trigger
     * 导致clear失败
     */
    const update = (v) => {
      attrs.value.modelValue = v === undefined ? [] : v
    }

    return { className, attrs, binds, computedSlots, update }
  },
})
</script>
