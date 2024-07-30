<script setup lang="ts">
import { InputAdapter } from 'commom-core/ant-design/input/input.adapter'
import { computed, reactive, ref, watch } from 'vue'
import SearchOutlined from '@ant-design/icons-vue/SearchOutlined'
import DeleteOutlined from '@ant-design/icons-vue/DeleteOutlined'
import { CollapseTransition } from 'common-base/vue/collapseTransition'
import _ from 'lodash'

const props = defineProps({
  keyword: {
    type: String,
    default: '',
  },
})

const emits = defineEmits(['cardListChange', 'onClear'])

// 搜索
const input = reactive<InputAdapter>({
  allowClear: true,
  placeholder: '请输入关键词',
  onKeydown: (keyEvent: KeyboardEvent) => {
    if (keyEvent.key === 'Enter') {
      onSearch()
    }
  },
  onFocus: () => {
    isShowHistory.value = true
  },
  onChange(v) {
    if (v.type === 'click') {
      emits('onClear')
    }
  },
})
const inputValue = ref('')
// 搜索目标
function onSearch() {
  const value = inputValue.value
  if (!value) {
    isShowHistory.value = true
    return
  }
  // 获取卡片数据
  emits('cardListChange', value)
}
function onClickOutside(isOutside) {
  if (isOutside) {
    isShowHistory.value = false
    getHistory()
  }
}
watch(
  () => props.keyword,
  (v) => {
    inputValue.value = props.keyword
  },
  { immediate: true }
)

// 历史记录
type TargetHistoryItem = {
  name: string
  key: string
  origin: Record<string, any>
}
const isShowHistory = ref(false)
const SEARCH_STORAGE_NAME = 'searchHistory'
const TARGET_STORAGE_NAME = 'targetHistory'
const searchHistoryTags = ref<string[]>(['1'])
const targetHistoryTags = ref<TargetHistoryItem[]>([])
const historyList = computed(() => {
  const historyItem: any[] = []
  if (searchHistoryTags.value.length) {
    const searchTags = searchHistoryTags.value.filter(
      (v) => !inputValue.value || v.startsWith(inputValue.value)
    )
    searchTags.length &&
      historyItem.push({
        title: '历史检索',
        type: SEARCH_STORAGE_NAME,
        option: searchTags.map((v) => ({
          label: v,
          key: SEARCH_STORAGE_NAME,
          value: v,
        })),
      })
  }
  if (targetHistoryTags.value.length) {
    const targetTags = targetHistoryTags.value.filter(
      (v) => !inputValue.value || v.name.startsWith(inputValue.value)
    )
    targetTags.length &&
      historyItem.push({
        title: '历史目标',
        type: TARGET_STORAGE_NAME,
        option: _.uniq(targetTags).map((v) => ({
          label: v.name,
          key: TARGET_STORAGE_NAME,
          value: v.key,
          origin: v.origin,
        })),
      })
  }
  return historyItem
})
getHistory()
function getHistory() {
  if (!localStorage) return
  try {
    searchHistoryTags.value = JSON.parse(localStorage.getItem(SEARCH_STORAGE_NAME) || '[]')
  } catch (e) {}
  try {
    targetHistoryTags.value = JSON.parse(localStorage.getItem(TARGET_STORAGE_NAME) || '[]')
  } catch (e) {}
}
function setSearchHistory(value: string) {
  if (value) {
    searchHistoryTags.value = searchHistoryTags.value.filter((v) => v !== value)
    searchHistoryTags.value.unshift(value)
    if (searchHistoryTags.value.length > 100) searchHistoryTags.value.length = 100
    localStorage &&
      localStorage.setItem(SEARCH_STORAGE_NAME, JSON.stringify(searchHistoryTags.value))
  }
}
function setTargetHistory(value: TargetHistoryItem) {
  if (value.name && value.origin) {
    targetHistoryTags.value = targetHistoryTags.value.filter((v) => v.key !== value.key)
    targetHistoryTags.value.unshift(value)
    if (targetHistoryTags.value.length > 30) targetHistoryTags.value.length = 30
    localStorage &&
      localStorage.setItem(TARGET_STORAGE_NAME, JSON.stringify(targetHistoryTags.value))
  }
}
function removeTargetHistory(key?: string) {
  if (typeof key === 'string') {
    targetHistoryTags.value = targetHistoryTags.value.filter((v) => v.key !== key)
    localStorage &&
      localStorage.setItem(TARGET_STORAGE_NAME, JSON.stringify(targetHistoryTags.value))
  } else {
    targetHistoryTags.value = []
    localStorage && localStorage.removeItem(TARGET_STORAGE_NAME)
  }
  getHistory()
}
function removeSearchHistory(key?: string) {
  if (typeof key === 'string') {
    searchHistoryTags.value = searchHistoryTags.value.filter((v) => v !== key)
    localStorage &&
      localStorage.setItem(SEARCH_STORAGE_NAME, JSON.stringify(searchHistoryTags.value))
  } else {
    searchHistoryTags.value = []
    localStorage && localStorage.removeItem(SEARCH_STORAGE_NAME)
  }
  getHistory()
}
function onRemoveIcon(type: string) {
  type === SEARCH_STORAGE_NAME ? removeSearchHistory() : removeTargetHistory()
}
function onTagClick(value: any) {
  emits('cardListChange', value)
}

defineExpose({
  isShowHistory,
  setSearchHistory,
  setTargetHistory,
  removeSearchHistory,
})
</script>

<template>
  <div class="blend-analysis-search">
    <div class="blend-analysis-search__main">
      <div class="blend-analysis-search__header">
        <div class="blend-analysis-search__header-context">检索目标</div>
      </div>
      <div class="blend-analysis-search__input" v-click-outside="onClickOutside">
        <c-input :c="input" v-model="inputValue">
          <template #suffix>
            <search-outlined
              style="color: rgba(0, 0, 0, 0.45); cursor: pointer"
              @click="onSearch"
            />
          </template>
        </c-input>
        <CollapseTransition>
          <div v-if="historyList.length && isShowHistory" class="blend-analysis-search__history">
            <div v-for="item in historyList" class="blend-analysis-search__history-item">
              <template v-if="item.option">
                <div class="blend-analysis-search__history-title">
                  {{ item.title }}
                  <DeleteOutlined
                    class="blend-analysis-search__history-delete"
                    @click="onRemoveIcon(item.type)"
                  ></DeleteOutlined>
                </div>
                <div class="blend-analysis-search__history-tags">
                  <template v-for="tag in item.option">
                    <a-tag
                      v-if="tag.key === SEARCH_STORAGE_NAME"
                      closable
                      class="blend-analysis-search__history-tag"
                      @click="onTagClick(tag.value)"
                      @close="removeSearchHistory(tag.value)"
                      >{{ tag.label }}</a-tag
                    >
                    <a-tag
                      v-else
                      closable
                      class="blend-analysis-search__history-tag"
                      @click="onTagClick(tag)"
                      @close="removeTargetHistory(tag.value)"
                      >{{ tag.label }}</a-tag
                    >
                  </template>
                </div>
              </template>
            </div>
          </div>
        </CollapseTransition>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import 'common-core/styles/export.scss';

@include b(blend-analysis-search) {
  width: 360px;
  height: 108px;
  background: #ffffff;
  box-shadow: 1px 2px 6px 0px rgba(0, 0, 0, 0.25);
  border-radius: 4px;
  // margin: 16px 0px 0px 16px;
  // position: relative;

  @include e(main) {
    width: 100%;
    height: 100%;
    padding: 16px 0px 0px 20px;
  }

  @include e(header) {
    width: 100%;
    height: 24px;

    @include e(header-context) {
      font-size: 16px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #333333;
      line-height: 24px;
    }
  }

  @include e(input) {
    width: 320px;
    height: 40px;
    background: #ffffff;
    border-radius: 4px;
    // border: 1px solid #D9D9D9;
    margin: 16px 0px 12px 0px;

    @include e(history) {
      position: absolute;
      width: 320px;
      padding: 5px 0px 12px 0px;
      border-radius: 2px;
      background: #fff;
      box-shadow: 0 0px 3px #0000001f;
      padding: 5px 12px 12px;
      z-index: 20;

      @include e(history-title) {
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #999;
        font-size: 12px;
        margin: 8px 0px 3px;

        @include e(history-delete) {
          cursor: pointer;
          float: right;
        }
      }

      @include e(history-tags) {
        display: flex;
        flex-wrap: wrap;
        max-height: 150px;
        overflow: hidden;

        @include e(history-tag) {
          cursor: pointer;
          height: 22px;
          margin-bottom: 3px;
        }
      }
    }
  }
}
</style>
