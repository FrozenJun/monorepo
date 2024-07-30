import { ImageProps } from 'ant-design-vue'
import { ElCommonAdapter } from '../../utils/dtos'

export type ImageSlots = 'placeholder'
export const imageSlots = ['placeholder']

export const ImageBindsOmitKeys: (keyof ImageAdapter)[] = []
export type ImageAdapter = Partial<
  ImageProps & ElCommonAdapter<ImageAdapter, ImageOutput, ImageSlots>
>

export interface ImageOutput {}

export const IMAGE_DEFAULT: ImageAdapter = {}
