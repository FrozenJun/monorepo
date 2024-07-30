<template>
  <VeeForm ref="validationForm" as="div" :class="className">
    <Form :ref="$options.name" v-bind="binds" class="form">
      <template #default>
        <FormItem
          v-for="(formItem, index) in attrs.formItems || []"
          :key="index"
          :c="setInner(formItem)"
          :formIndex="formIndex"
        >
          <template v-for="(_, slot) in $slots" #[slot]="scope">
            <slot :name="slot" v-bind="scope"></slot>
          </template>
        </FormItem>
        <slot v-if="!attrs.formItems"></slot>
      </template>

      <!-- TODO - 处理form slot -->
      <!-- <template
      v-for="slots in computedSlots($slots)"
      #[slots.type]="scope"
      :key="slots.type"
    >
      <slot
        v-for="name in slots.names"
        :name="name"
        v-bind="scope"
        :key="name"
      ></slot>
    </template> -->
    </Form>
  </VeeForm>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive, toRefs } from 'vue'
import { FormAdapter, FormBindsOmitKeys, FORM_DEFAULT, formSlots } from './form.adapter'
import { COMPONENT_NAME, COMPONENT_TYPE } from '../../utils/constants/component'
import { useProvider } from '../../utils/hooks/useProvider'
import { useCommonSetup } from '../../utils/hooks/useCommonSetup'
import { useComputeAttrs } from '../../utils/hooks/useComputeAttrs'
import { useForm } from './form.use'
import { Form } from 'ant-design-vue'
import { dasherize } from 'common-base/pipe/string'
import { FormItem } from '../form-item'
import { Form as VeeForm } from 'vee-validate'

export default defineComponent({
  name: COMPONENT_NAME.form,
  inheritAttrs: false,
  components: { Form, FormItem, VeeForm },
  emits: ['output-change'],
  props: {
    c: {
      type: Object as PropType<Record<string, any>>,
      default: () => reactive({}),
    },
    n: {
      type: String,
    },
    // 当form位于Arrayforms数组时，index表示当前item所在的form在forms中的序号
    formIndex: {
      type: Number,
      default: undefined,
    },
  },
  setup(props, ctx) {
    const type = COMPONENT_TYPE.form
    const className = dasherize(COMPONENT_NAME.form)

    /** 合并配置，获取attrs */
    const { attrs, binds } = useComputeAttrs<FormAdapter>({
      props,
      defaultOption: FORM_DEFAULT,
      type,
      omitKeys: FormBindsOmitKeys,
    })

    /** 组件输出 */
    const { output, state } = useForm({ attrs, props })

    /** 注册、注销组件 */
    useProvider({ attrs, output, type, ctx })

    /** 组件通用setup */
    const { computedSlots, setInner } = useCommonSetup({
      attrs,
      output,
      slotTypes: formSlots,
    })

    return { className, attrs, binds, computedSlots, setInner, ...toRefs(state) }
  },
})
</script>

<style lang="scss">
@import '../../styles/export.scss';

$namespace: 'c';

@include b(form) {
  width: 100%;
  .form {
    display: flex;
    flex-wrap: wrap;
  }
}
</style>
