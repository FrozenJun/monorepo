export enum EFusionTypes {
  '轨迹分析' = 0,
  '同行分析' = 1,
  '落脚点分析' = 2,
}
export const FUSION_TYPES = [
  {
    name: '轨迹分析',
    value: EFusionTypes.轨迹分析,
    icon: 'icon-guijitu',
  },
  {
    name: '同行分析',
    value: EFusionTypes.同行分析,
    icon: 'icon-icon-',
  },
  {
    name: '落脚点分析',
    value: EFusionTypes.落脚点分析,
    icon: 'icon-xiazai20',
  },
]

export const TRACK_TYPE = [
  {
    title: '主体',
    color: 'rgba(74, 136, 230, 1)',
    theme: 'default',
  },
  {
    title: '同行',
    color: 'rgba(88, 160, 90, 1)',
    theme: 'peer',
  },
]
export const getTrackColorByTheme = (theme?: 'default' | 'peer') => {
  const item = TRACK_TYPE.find((track) => {
    return track.theme === (theme || 'default')
  })
  return item!.color
}
