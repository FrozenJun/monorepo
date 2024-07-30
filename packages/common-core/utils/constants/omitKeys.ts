import { ElCommonAdapter } from '../dtos'

type NativeAttrs = 'style' | 'class' | 'id'

export const NATIVE_ATTRS = ['style', 'class', 'id']

export const DEFAULT_OMIT_KEYS: (keyof ElCommonAdapter<any, any, string> | NativeAttrs)[] = [
  'onSetup',
  'n',
  'extra',
  'slotAlias',
  '__INNER__',
]
