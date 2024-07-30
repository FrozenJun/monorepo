import { reactive } from 'vue'
import { CvueOptions } from 'common-core/utils/config'

export const cvueOpt: CvueOptions = reactive({
  form: {
    labelCol: { style: { width: '200px' } },
    wrapperCol: { style: { width: '100%' } },
    itemWidth: '50%',
    labelAlign: 'right',
  },
  pagination: {
    current: 1,
    pageSize: 10,
    showTotal: (total: number) => `${'共'} ${total} ${'条'}`,
    showSizeChanger: true,
  },
  tree: {
    treeDataAsync: {
      immediate: true,
    },
  },
  inputPassword: {
    placeholder: '请输入',
  },
  inputNumber: {},
  select: {
    placeholder: '请选择',
  },
  treeSelect: {
    placeholder: '请选择',
  },
  datePicker: {
    placeholder: '请选择',
  },
  input: {
    placeholder: '请输入',
  },
  cascader: {
    placeholder: '请输入',
  },
  table: {},
  cs: {
    form: {
      itemWidth: '20%',
      labelCol: { style: { width: '80px' } },
    },
  },
  ct: {
    dataSourceAsync: {
      immediate: true,
    },
    pagination: {
      current: 1,
      pageSize: 10,
      showTotal: (total) => `${'共'} ${total} ${'条'}`,
      showSizeChanger: true,
    },
  },
  modal: {
    okText: '确定',
    cancelText: '关闭',
  },
  cmf: {
    form: {
      labelCol: { style: { width: '80px' } },
    },
  },
  upload: {
    previewModal: {
      title: '图片预览',
      width: '700px',
    },
    previewImage: {
      height: '400px',
    },
  },
})
