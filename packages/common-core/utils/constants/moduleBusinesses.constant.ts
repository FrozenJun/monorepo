export const LABLE_PROP = {
  CDMA1XFreq: [
    {
      title: '频段类型(0-31)',
      prop: 'bandclass',
      type: 'integer',
    },
    {
      title: '频点(0-2047)',
      prop: 'arfcn',
      type: 'integer',
    },
  ],
  GSMFreq: [
    {
      title: 'ARFCN1',
      prop: 'ARFCN1',
      type: 'integer',
    },
    {
      title: 'ARFCN2',
      prop: 'ARFCN2',
      type: 'integer',
    },
    {
      title: 'ARFCN3',
      prop: 'ARFCN3',
      type: 'integer',
    },
    {
      title: 'ARFCN4',
      prop: 'ARFCN4',
      type: 'integer',
    },
    {
      title: 'ARFCN5',
      prop: 'ARFCN5',
      type: 'integer',
    },
    {
      title: 'ARFCN6',
      prop: 'ARFCN6',
      type: 'integer',
    },
    {
      title: 'ARFCN7',
      prop: 'ARFCN7',
      type: 'integer',
    },
    {
      title: 'ARFCN8',
      prop: 'ARFCN8',
      type: 'integer',
    },
  ],
  LTELq: [
    {
      title: '频点',
      prop: 'dlarfcn',
      type: 'integer',
    },
    {
      title: '优先级(0-7)',
      prop: 'priority',
      type: 'integer',
    },
    {
      title: '带宽(0-5)',
      prop: 'bandwidth',
      type: 'integer',
    },
  ],
  CDMA1XLq: [
    {
      title: '频段类型(0-31)',
      prop: 'bandclass',
      type: 'integer',
    },
    {
      title: '优先级(0-7)',
      prop: 'priority',
      type: 'integer',
    },
    {
      title: '频点(0-2047)',
      prop: 'arfcn',
      type: 'integer',
    },
    {
      title: 'PN(0-511)',
      prop: 'pci',
      type: 'integer',
    },
  ],
  GSMLq: [
    {
      title: '频段指示器',
      enum: [
        { label: 'GERAN_GSM850', value: 0 },
        { label: 'GERAN_GSM900', value: 1 },
        { label: 'GERAN_DCS1800', value: 2 },
        { label: 'GERAN_PCS1900', value: 3 },
      ],
      type: 'select',
      prop: 'bandIndicator',
    },
    {
      title: '频点',
      prop: 'bcchArfcn',
      type: 'integer',
    },
    {
      title: '优先级(0-7)',
      prop: 'cellReselePri',
      type: 'integer',
    },
    {
      title: '掩码',
      prop: 'ncc_Permitted',
      type: 'integer',
    },
  ],
}
