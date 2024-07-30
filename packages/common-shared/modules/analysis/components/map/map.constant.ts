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
  return TRACK_TYPE.find((track) => {
    return track.theme === theme
  })?.color
}

export enum ResideDataTypeEnum {
  '出现时长' = '1',
  '出现次数' = '2',
}
