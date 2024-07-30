<template>
  <div class="nested-form">
    <div class="nested-form__content">
      <div class="nested-form__left">
        <p v-if="!attrs.modelValue || !attrs.modelValue.length" class="nested-form__empty-text">
          {{ t('未配置数据') }}
        </p>
        <a-tooltip v-else :title="modelValueFormat">
          <p class="nested-form__names-count">{{ modelValueFormat }}</p>
        </a-tooltip>
      </div>

      <div class="nested-form__right">
        <a :class="['nested-form__operate']" @click="onEdit">{{ t('编辑') }}</a>
        <a
          v-if="attrs.modelValue && attrs.modelValue.length"
          :class="['nested-form__operate']"
          @click="attrs.modelValue = []"
          >{{ t('清空') }}</a
        >
      </div>
    </div>

    <Modal :c="modal">
      <div class="nested-form__modal">
        <TableForm :c="attrs" v-model="attrs.modelValue"></TableForm>
      </div>
    </Modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive, toRaw } from 'vue'
import {
  NestedFormAdapter,
  NestedFormBindsOmitKeys,
  NESTED_FORM_DEFAULT,
  nestedFormSlots,
} from './nested-form.adapter'
import { COMPONENT_NAME, COMPONENT_TYPE } from '../../utils/constants/component'
import { useProvider } from '../../utils/hooks/useProvider'
import { useCommonSetup } from '../../utils/hooks/useCommonSetup'
import { useComputeAttrs } from '../../utils/hooks/useComputeAttrs'
import { useNestedForm } from './nested-form.use'
import { dasherize } from 'common-base/pipe/string'
import { Modal } from '../../ant-design/modal'
import { TableForm } from '../table-form'

export default defineComponent({
  name: COMPONENT_NAME.nestedForm,
  inheritAttrs: false,
  components: { Modal, TableForm },
  emits: ['output-change', 'update:modelValue'],
  props: {
    c: {
      type: Object as PropType<NestedFormAdapter>,
      default: () => reactive({}),
    },
    n: {
      type: String,
    },
    modelValue: {
      type: Array,
      default: undefined,
    },
  },
  setup(props, ctx) {
    const type = COMPONENT_TYPE.nestedForm
    const className = dasherize(COMPONENT_NAME.nestedForm)

    /** 合并配置，获取attrs */
    const { attrs, binds } = useComputeAttrs<NestedFormAdapter>({
      props,
      defaultOption: NESTED_FORM_DEFAULT,
      type,
      omitKeys: NestedFormBindsOmitKeys,
    })

    /** 组件输出 */
    const { output, status, modelValueFormat } = useNestedForm({ attrs, props, ctx })

    /** 注册、注销组件 */
    useProvider({ attrs, output, type, ctx })

    /** 组件通用setup */
    const { computedSlots } = useCommonSetup({
      attrs,
      output,
      slotTypes: nestedFormSlots,
    })

    return {
      className,
      attrs,
      t: (window as any).t || ((key: string) => key),
      binds,
      computedSlots,
      modelValueFormat,
      ...toRaw(status),
    }
  },
})
</script>

<style lang="scss">
@import '../../styles/export.scss';

@include b(nested-form) {
  min-width: 208px;
  border: 1px solid #ccd;
  border-radius: 2px;
  transition: border-color 0.2s ease-out;

  @include e(content) {
    width: 100%;
    align-items: center;
    display: flex;
    font-size: 12px;
    height: 32px;
    justify-content: space-between;
    padding: 0px 10px;
    @include e(left) {
      width: calc(100% - 88px);
      max-width: calc(100% - 88px);
      display: flex;
      p {
        margin: 0;
      }
      @include e(names-count) {
        width: 100%;
        color: #999;
        flex: 1 1;
        overflow: hidden;
        padding: 0;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    @include e(right) {
      display: flex;

      @include e(operate) {
        margin-left: 8px;
        @include when(disabled) {
          cursor: not-allowed;
          color: #999;
        }
      }
    }

    @include e(select-wrapper) {
      position: relative;
      width: 100%;
      height: 690px;
      padding: 12px;

      @include e(modal-map-wrapper) {
        position: relative;
        width: 100%;
        height: 100%;
        @include e(modal-map) {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          width: 100%;
        }
      }

      @include e(modal-main) {
        bottom: 4px;
        box-shadow: 0 0 3px 0 hsl(0deg 0% 67% / 50%);
        background: #fff;
        position: absolute;
        left: 0;
        top: 4px;
        transition: right 0.5s ease;
        width: 370px;
        z-index: 99;
        display: flex;
        flex-direction: column;

        @include e(modal-content) {
          width: 100%;
          flex: 1;
          overflow-x: hidden;
          overflow-y: auto;

          @include e(device-list) {
            width: 100%;
            height: 100%;
            overflow-x: hidden;
            overflow-y: auto;

            @include e(device-item) {
              display: flex;
              width: 100%;
              height: 30px;
              align-items: center;

              @include e(device-index) {
                background: #dcdfe6;
                color: #000;
                height: 20px;
                line-height: 20px;
                margin-left: 10px;
                min-width: 21px;
                padding: 0 5px;
                text-align: center;
              }
              @include e(device-circle) {
                border-radius: 50%;
                height: 6px;
                margin-left: 5px;
                width: 6px;
                background-color: rgb(153, 153, 153);
              }
              @include e(device-type) {
                font-size: 14px;
                line-height: 30px;
                margin-left: 5px;
              }
              @include e(device-name) {
                flex: 1 1;
                margin-left: 8px;
                overflow: hidden;
                text-align: left;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
            }
          }

          @include e(empty) {
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }
        }

        @include e(modal-footer) {
          display: flex;
          width: 100%;
          padding: 12px 10px;
          @include e(modal-footer-button) {
            flex: 1;
            margin: 0 4px;
            height: 30px;
          }
        }
      }
    }
  }

  @include e(modal) {
    width: 100%;
    overflow: auto;
  }
}
</style>
