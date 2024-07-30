import { reactive } from 'vue'
import { CvueOptions } from './utils/config'

const t = (window as any).t || ((key: string) => key)

export const cvueOpt: CvueOptions = reactive({
  form: {
    labelCol: { style: { width: '80px' } },
    wrapperCol: { style: { width: '100%' } },
    itemWidth: '50%',
    labelAlign: 'right',
  },
  pagination: {
    current: 1,
    pageSize: 10,
    showTotal: (total) => `${t('共')} ${total} ${t('条')}`,
    showSizeChanger: true,
  },
  tree: {
    treeDataAsync: {
      immediate: true,
    },
  },
  inputPassword: {
    placeholder: t('请输入'),
  },
  inputNumber: {},
  select: {
    placeholder: t('请选择'),
  },
  treeSelect: {
    placeholder: t('请选择'),
  },
  datePicker: {
    placeholder: t('请选择'),
  },
  input: {
    placeholder: t('请输入'),
  },
  cascader: {
    placeholder: t('请输入'),
  },
  table: {},
  cs: {
    form: {
      itemWidth: '20%',
    },
  },
  ct: {
    dataSourceAsync: {
      immediate: true,
    },
    pagination: {
      current: 1,
      pageSize: 10,
      showTotal: (total) => `${t('共')} ${total} ${t('条')}`,
      showSizeChanger: true,
    },
  },
  modal: {
    okText: t('确定'),
    cancelText: t('关闭'),
  },
  cmf: {},
  upload: {
    previewModal: {
      title: t('图片预览'),
      width: '700px',
    },
    previewImage: {
      height: '400px',
    },
  },
})
