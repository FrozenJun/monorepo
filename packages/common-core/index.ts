import { emit, reveice } from './utils/service/provider.service'
import './utils/lodash'
import { App } from 'vue'
import './utils/vee-validate'
import _ from 'lodash'
import { type CvueOptions, setConfig } from './utils/config'
export { cvueOpt } from './core.config'

import * as AntDesign from './ant-design'
import * as Combine from './combine'
export {
  Button,
  ButtonGroup,
  Image,
  Modal,
  Pagination,
  Table,
  Popconfirm,
  Tree,
  Descriptions,
  DescriptionsItem,
  AutoComplete,
  Cascader,
  Checkbox,
  CheckboxGroup,
  DatePicker,
  Input,
  InputNumber,
  InputPassword,
  InputSearch,
  Radio,
  RadioGroup,
  RangePicker,
  Select,
  SelectOption,
  Switch,
  TimePicker,
  TimeRangePicker,
  TreeSelect,
  Upload,
  Form,
  FormItem,
  FormGroup,
} from './ant-design'
export { Ct, Cs, Co, Cmf } from './combine'

import dayjs from 'dayjs'
import localeData from 'dayjs/plugin/localeData'
import weekday from 'dayjs/plugin/weekday'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import weekYear from 'dayjs/plugin/weekYear'
dayjs.extend(weekday)
dayjs.extend(localeData)
dayjs.extend(weekOfYear)
dayjs.extend(weekYear)

const components = [..._.values(AntDesign), ..._.values(Combine)]

const install = function (app: App, opt: CvueOptions) {
  setConfig(opt)
  components.forEach((component) => {
    app.component(component.name, component)
  })
}

export { install, emit, reveice, CvueOptions, setConfig }
export default {
  install,
}
