<template>
  <div :class="className">
    <div class="co__left">
      <Button
        v-for="(button, index) in attrs.selectButtons"
        :key="index"
        :c="setInner(button)"
      ></Button>
      <Button v-for="(operate, index) in operateButtons" :key="index" :c="setInner(operate.button)">
        <template #icon-add><PlusOutlined></PlusOutlined></template>
      </Button>
      <a-dropdown v-if="operateMoreButtons.length">
        <template #overlay>
          <a-menu>
            <a-menu-item
              v-for="(operate, index) in operateMoreButtons"
              :key="index"
              @click="operate.button?.onClick"
              :disabled="operate.button?.loading"
            >
              <div>
                {{ operate.button?.text }}
                <a-spin :indicator="indicator" :spinning="operate.button?.loading || false" />
              </div>
            </a-menu-item>
          </a-menu>
        </template>
        <a-button type="primary">
          更 多
          <DownOutlined />
        </a-button>
      </a-dropdown>
    </div>
    <div class="co__right">
      <Button
        v-for="(operate, index) in attrs.operateRightButtons"
        :key="index"
        :c="setInner(operate.button)"
      >
        <template #icon-add><PlusOutlined></PlusOutlined></template>
      </Button>
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, h, PropType, reactive } from 'vue'
import { CoAdapter, CoBindsOmitKeys, CO_DEFAULT, coSlots } from './co.adapter'
import { COMPONENT_NAME, COMPONENT_TYPE } from '../../utils/constants/component'
import { useProvider } from '../../utils/hooks/useProvider'
import { useCommonSetup } from '../../utils/hooks/useCommonSetup'
import { useComputeAttrs } from '../../utils/hooks/useComputeAttrs'
import { useCo } from './co.use'
import { dasherize } from 'common-base/pipe/string'
import Button from '../../ant-design/button/button.vue'
import PlusOutlined from '@ant-design/icons-vue/PlusOutlined'
import DownOutlined from '@ant-design/icons-vue/DownOutlined'
import LoadingOutlined from '@ant-design/icons-vue/LoadingOutlined'

export default defineComponent({
  name: COMPONENT_NAME.co,
  inheritAttrs: false,
  emits: ['output-change'],
  components: { Button, PlusOutlined, DownOutlined },
  props: {
    c: {
      type: Object as PropType<Record<string, any>>,
      default: () => reactive({}),
    },
    n: {
      type: String,
    },
  },
  setup(props, ctx) {
    const type = COMPONENT_TYPE.co
    const className = dasherize(COMPONENT_NAME.co)
    /** 合并配置，获取attrs */
    const { attrs, binds } = useComputeAttrs<CoAdapter>({
      props,
      defaultOption: CO_DEFAULT,
      type,
      omitKeys: CoBindsOmitKeys,
    })
    /** 组件输出 */
    const { output, operateButtons, operateMoreButtons } = useCo({ attrs })

    /** 注册、注销组件 */
    useProvider({ attrs, output, type, ctx })
    /** 组件通用setup */
    const { computedSlots, setInner } = useCommonSetup({
      attrs,
      output,
      slotTypes: coSlots,
    })
    const indicator = h(LoadingOutlined, {
      style: {
        fontSize: '16px',
      },
      spin: true,
    })
    return {
      className,
      attrs,
      binds,
      computedSlots,
      setInner,
      indicator,
      operateButtons,
      operateMoreButtons,
    }
  },
})
</script>

<style lang="scss">
@import '../../styles/export.scss';
@include b(co) {
  display: flex;
  padding: 15px 20px;
  justify-content: space-between;
  align-items: center;
  @include e(left) {
    .c-button {
      margin-right: 20px;
    }
    @include e(page-name) {
      font-size: 16px;
      font-weight: bold;
      color: rgba(0, 0, 0, 0.85);
      margin-bottom: 0;
      line-height: 22px;
    }
  }
  @include e(right) {
    display: flex;
    align-items: center;
    margin-right: 20px;
    .c-button {
      margin-right: 20px;
    }
  }
}
</style>
