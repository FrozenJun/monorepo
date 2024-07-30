<template>
  <FormGroup :c="{ n: attrs.n }">
    <Table
      :class="className"
      :ref="$options.name"
      :c="attrs"
      :key="attrs.dataSourceAsync?.data?.length"
    >
      <template #bodyCell="{ column, text, record, index }">
        <template
          v-if="
            (!column.type || column.type === 'text') &&
            !column.editable?.isEditAlways &&
            !record[EDIT_ALWAYS_FLAG] &&
            !(record[EDIT_CURRENT_FLAG] && column.editable?.isEditCurrent)
          "
        >
          <!-- 枚举 column -->
          <template v-if="column.enumTypes && column.enumTypes.length">{{
            (column.enumTypes.find((i: any) => i.value === text) || {}).label
          }}</template>
          <!-- 时间 column -->
          <template v-else-if="column.format">{{
            text ? dayjs(new Date(text)).format(column.format) : ''
          }}</template>
          <!-- handler column -->
          <template v-else-if="column.textHandler">{{
            column.textHandler({ column, text, record, index })
          }}</template>
          <!-- 默认字符串 column -->
          <template v-else>{{ text }}</template>
        </template>
        <template v-else-if="column.type === 'image' && text">
          <a-popover trigger="hover" placement="right">
            <!-- 直接暴露Image组件popover组件会失效，这里加一个span -->
            <span>
              <Image
                class="ct__image"
                :c="setInner({ src: text, ...(column.image || {}), ...CT_IMAGE })"
              ></Image>
            </span>
            <template #content>
              <img class="ct__image-popover" :src="text" />
            </template>
          </a-popover>
        </template>
        <template v-else-if="column.type === 'images'">
          <ImagePreviewGroup>
            <template v-for="(src, index) in text" :key="index">
              <a-popover trigger="hover" placement="right">
                <span v-show="!column.onlyShowFirstImage || index === 0">
                  <Image
                    class="ct__image"
                    :c="setInner({ src, ...(column.image || {}), ...CT_IMAGE })"
                  ></Image>
                </span>
                <template #content>
                  <img class="ct__image-popover" :src="src" />
                </template>
              </a-popover>
            </template>
          </ImagePreviewGroup>
        </template>
        <template v-else-if="column.type === 'index' && attrs.pagination">
          {{ (attrs.pagination!.current! - 1) * attrs.pagination!.pageSize! + index + 1 }}
        </template>
        <template
          v-else-if="column.type === 'convert' && typeof column.convertHandle === 'function'"
        >
          <template v-if="!column.asyncData && !column.asyncData.api">
            {{ column.convertHandle({ column, text, record, index }) }}
          </template>
          <template v-else-if="!!column.asyncData.data">
            {{ column.convertHandle({ column, text, record, index }, column.asyncData) }}
          </template>
        </template>
        <template
          v-else-if="column.type === 'operate' && typeof column.operateRender === 'function'"
        >
          <div class="ct__operates" v-if="record[EDIT_CURRENT_FLAG] || attrs.onCtfDelete">
            <a-popconfirm
              :title="t('确定删除？')"
              :ok-text="t('确定')"
              :cancel-text="t('取消')"
              @confirm="ctfDelete(record)"
            >
              <a class="ct__operate-button is-danger"> {{ t('删除') }} </a>
            </a-popconfirm>
          </div>
          <div class="ct__operates" v-else>
            <div
              class="ct__operate"
              v-for="(operate, no) in generateOperates({
                column,
                text,
                record,
                index,
              })"
              :key="no"
            >
              <a-dropdown v-if="lodash.isArray(operate)">
                <a class="ct__more-btn" @click.prevent>
                  {{ t('更多') }}
                  <DownOutlined />
                </a>
                <template #overlay>
                  <a-menu>
                    <a-menu-item v-for="(item, idx) in operate" :key="idx">
                      <Popconfirm v-if="item.isDanger" :c="setInner(item.popconfirm)">
                        <a
                          href="javascript:;"
                          class="ct__operate-button is-danger"
                          @click="item.button.onClick"
                          >{{ item.button.text }}</a
                        >
                      </Popconfirm>
                      <a
                        href="javascript:;"
                        v-if="!item.isDanger && item.button"
                        @click="item.button.onClick"
                        class="ct__operate-button"
                        >{{ item.button.text }}</a
                      >
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
              <Popconfirm v-if="operate.isDanger" :c="setInner(operate.popconfirm)">
                <a
                  href="javascript:;"
                  class="ct__operate-button is-danger"
                  @click="operate.button.onClick"
                  >{{ operate.button.text }}</a
                >
              </Popconfirm>
              <a
                href="javascript:;"
                v-if="!operate.isDanger && operate.button"
                @click="operate.button.onClick"
                class="ct__operate-button"
                >{{ operate.button.text }}</a
              >
              <a-divider
                v-if="
                  no !==
                    generateOperates({
                      column,
                      text,
                      record,
                      index,
                    }).length -
                      1 && operate.button.visible
                "
                type="vertical"
              />
            </div>
          </div>
        </template>
        <template v-else-if="column.type === 'slot'">
          <slot :name="column.slotName" v-bind="{ column, text, record, index }"></slot>
        </template>
        <template
          v-else-if="
            (record[EDIT_CURRENT_FLAG] && column.editable?.isEditCurrent) ||
            column.editable?.isEditAlways ||
            record[EDIT_ALWAYS_FLAG]
          "
        >
          <div
            v-if="column.editable?.readMode && !record[column.dataIndex + '__isEditMode']"
            class="ct__editForm"
          >
            <Form :c="{ ...column.editable.form, n: record.id || `index${index}` }">
              <Field
                :name="column.editable?.formItem?.label"
                :rules="column.editable?.formItem?.rules || ''"
                v-slot="{ errors }"
                v-model="record[column.dataIndex]"
              >
                <div>{{ editModeTextHandler(column.editable.formItem, text) }}</div>
                <div class="ct__error">{{ errors[0] }}</div>
              </Field>
            </Form>
            <a class="ct__editOperate" @click="record[column.dataIndex + '__isEditMode'] = true">{{
              t('编辑')
            }}</a>
          </div>
          <div class="ct__editForm">
            <Form
              :key="record.id || record.rowId"
              v-if="!column.editable?.readMode || record[column.dataIndex + '__isEditMode']"
              :c="{ ...column.editable.form, n: record.id || record.rowId || `index${index}` }"
            >
              <!-- 共享一个formItem会导致一些意外bug，比如attrs上的modelValue、control共用 -->
              <!-- 需要将c保存到record上 -->
              <FormItem
                :c="
                  record[column.dataIndex + '__config'] ||
                  (record[column.dataIndex + '__config'] = lodash.cloneDeep(
                    column.editable.formItem
                  ))
                "
                v-model="record[column.dataIndex]"
              >
                <template v-for="(_, slot) in $slots" #[slot]="scope">
                  <slot :name="slot" v-bind="scope"></slot>
                </template>
              </FormItem>
            </Form>
            <div
              v-if="column.editable?.readMode && record[column.dataIndex + '__isEditMode']"
              class="ct__editOperate"
            >
              <a @click="record[column.dataIndex + '__isEditMode'] = false">{{ t('确定') }}</a>
            </div>
          </div>
        </template>
      </template>

      <template #headerCell="{ column, title }">
        <div v-if="column.headerSlotName">
          <slot :name="column.headerSlotName" v-bind="{ column, title }"></slot>
        </div>
        <template v-if="column.columnDataEditable && column.editable?.formItem">
          <div class="ct__column-editable">
            <span> {{ title }}</span>
            <a-popover placement="bottom" trigger="click">
              <EditOutlined class="ct__column-editable-icon" />
              <template #content>
                <FormItem
                  class="ct__column-editable-item"
                  modelValue=""
                  :c="editFormObj[title]"
                ></FormItem>
              </template>
            </a-popover>
          </div>
        </template>
      </template>
      <template #summary>
        <a-table-summary-row>
          <a-table-summary-cell :index="0" :col-span="24" v-if="attrs.selectedRowCount">
            <div class="ct__selectedRowCount">
              {{ t('已选') }}
              <span class="count">
                {{ attrs.selectedRowCount }}
              </span>
              {{ t('人') }}
            </div>
          </a-table-summary-cell>
          <a-table-summary-cell :col-span="24" v-if="attrs.onAddColumn">
            <a-button type="dashed" class="ct__add-button" @click="attrs.onAddColumn!()">
              <PlusCircleOutlined />{{ t('添加下一行数据') }}
            </a-button>
          </a-table-summary-cell>
        </a-table-summary-row>
      </template>
      <template v-for="(_, slot) in $slots" #[slot]="{ scope }">
        <slot :name="slot" v-bind="scope"></slot>
      </template>
    </Table>
  </FormGroup>
</template>

<script lang="ts">
import { Field } from 'vee-validate'
import { defineAsyncComponent, defineComponent, inject, PropType, reactive, ref } from 'vue'
import { CtAdapter, CtBindsOmitKeys, CT_DEFAULT, ctSlots, CT_IMAGE } from './ct.adapter'
import { COMPONENT_NAME, COMPONENT_TYPE } from '../../utils/constants/component'
import { useProvider } from '../../utils/hooks/useProvider'
import { useCommonSetup } from '../../utils/hooks/useCommonSetup'
import { useComputeAttrs } from '../../utils/hooks/useComputeAttrs'
import { useCt } from './ct.use'
import { dasherize } from 'common-base/pipe/string'
import Table from '../../ant-design/table/table.vue'
import Image from '../../ant-design/image/image.vue'
import Popconfirm from '../../ant-design/popconfirm/popconfirm.vue'
import dayjs from 'dayjs'
import { ImagePreviewGroup } from 'ant-design-vue'
import { useCtf } from './ctf.use'
import FormGroup from '../../ant-design/form-group/form-group.vue'
import _ from 'lodash'
import PlusCircleOutlined from '@ant-design/icons-vue/PlusCircleOutlined'
import EditOutlined from '@ant-design/icons-vue/EditOutlined'
import DownOutlined from '@ant-design/icons-vue/DownOutlined'
import { emit } from '../../utils/service/provider.service'
import { editModeTextHandler } from '../../utils/handlers'

export default defineComponent({
  name: COMPONENT_NAME.ct,
  inheritAttrs: false,
  components: {
    Table,
    Image,
    Popconfirm,
    ImagePreviewGroup,
    FormItem: defineAsyncComponent(() => import('../../ant-design/form-item/form-item.vue')),
    Form: defineAsyncComponent(() => import('../../ant-design/form/form.vue')),
    FormGroup,
    PlusCircleOutlined,
    EditOutlined,
    DownOutlined,
    Field,
  },
  emits: ['output-change'],
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
    const type = COMPONENT_TYPE.ct
    const className = dasherize(COMPONENT_NAME.ct)

    /** 合并配置，获取attrs */
    const { attrs, binds } = useComputeAttrs<CtAdapter>({
      props,
      defaultOption: CT_DEFAULT,
      type,
      omitKeys: CtBindsOmitKeys,
    })
    const { ctfAdd, ctfDelete, ctfEdit, ctfSave, EDIT_CURRENT_FLAG, EDIT_ALWAYS_FLAG } = useCtf({
      attrs,
    })
    /** 组件输出 */
    const { output, generateOperates, editFormObj } = useCt({ attrs })

    /** 注册、注销组件 */
    useProvider({ attrs, output, type, ctx })
    /** 组件通用setup */
    const { computedSlots, setInner } = useCommonSetup({
      attrs,
      output,
      slotTypes: ctSlots,
    })

    function genFormConfig(column, text, record, index) {
      // 这里需要拷贝form，防止所有cell公用一个form对象和record对象
      // 使用clone拷贝formItem，又会导致表格的重新渲染会克隆新的formItem,
      // 使useComputeAttrs中attrs的计算属性多次触发，
      // 影响输入时的正确赋值
      // 使用column.editable.records[index]存储当前的form配置，防止被重置
      /**
       * TODO n存在硬编码，需要改进
       */
      // if (!column.editable.records) {
      //   column.editable.records = []
      // }
      // if (!column.editable.records[index]) {
      //   column.editable.records[index] = {}
      // }
      // _.defaultsDeepSafe(column.editable.records[index], _.cloneDeep(column.editable.form))
      // _.assign(column.editable.records[index], {
      //   models: record,
      //   n: record.id || `index${index}`,
      // })
      // return column.editable.records[index]
      return {
        ..._.cloneDeep(column.editable.form || {}),
        n: record.id || `index${index}`,
      }
    }

    return {
      className,
      attrs,
      binds,
      computedSlots,
      CT_IMAGE,
      generateOperates,
      setInner,
      dayjs,
      PlusCircleOutlined,
      EDIT_CURRENT_FLAG,
      EDIT_ALWAYS_FLAG,
      ctfAdd,
      ctfDelete,
      ctfEdit,
      ctfSave,
      reactive,
      genFormConfig,
      emit,
      lodash: _,
      console,
      t: (window as any).t || ((key: string) => key),
      DownOutlined,
      editModeTextHandler,
      editFormObj,
    }
  },
})
</script>

<style lang="scss">
@import '../../styles/export.scss';

@include b(ct) {
  .ant-spin-nested-loading {
    height: 100%;
  }

  .ant-spin-container {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .ant-table {
    overflow-y: auto;
    // scrollbar-color: rgba(0, 0, 0, 0.3) #6e6e6e;
    // scrollbar-width: thin;
    &::-webkit-scrollbar {
      width: 4px;
      height: 6px;
    }
    &::-webkit-scrollbar-track {
      box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    }
    &::-webkit-scrollbar-thumb {
      background-color: #6e6e6e;
    }
  }

  @include e(image) {
    cursor: pointer;
    vertical-align: middle;
    width: 40px;
    height: 40px;
    object-fit: contain;
  }

  @include e(image-popover) {
    width: 90px;
    height: 90px;
    object-fit: contain;
  }
  @include e(more-btn) {
    display: flex;
    align-items: center;
  }

  @include e(operates) {
    display: flex;
    flex-flow: nowrap;
    @include e(operate) {
      display: flex;
      align-items: center;
    }
    @include e(operate-button) {
      white-space: nowrap;
      color: var(--primary-color);
      &:hover,
      &:visited,
      &:focus,
      &:active {
        color: var(--primary-color);
      }

      @include when(danger) {
        color: #ff7875;
      }
    }
  }

  @include e(add-button) {
    display: block;
    margin: 10px 0px;
    width: 100%;
    color: #8c8c8c;
  }

  @include e(editForm) {
    display: flex;
    @include e(editOperate) {
      display: flex;
      align-items: center;
      padding-left: 2px;
      white-space: nowrap;
      font-size: 12px;
    }
  }

  @include e(error) {
    padding-top: 3px;
    color: red;
    font-size: 12px;
  }

  @include e(column-editable) {
    display: flex;
    align-items: center;
    @include e(column-editable-icon) {
      margin-left: 5px;
      cursor: pointer;
      transition: color 0.3s;
      &:hover {
        color: var(--primary-color);
      }
    }
    @include e(column-editable-item) {
      min-width: 100px;
    }
  }
  @include e(selectedRowCount) {
    font-size: 13px;
    font-family: SourceHanSansSC;
    font-weight: 400;
    line-height: 26px;
    .count {
      font-size: 18px;
      color: rgba(5, 127, 242, 1);
      letter-spacing: 0px;
    }
  }
  .ant-form-item {
    margin-bottom: 0;
  }
}
</style>
