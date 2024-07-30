import { CreateStorageParams, createStorage } from './storageCache'

const DEFAULT_CACHE_TIME = 60 * 60 * 24 * 7

export type Options = Partial<CreateStorageParams>
const createOptions = (storage: Storage, options: Options = {}): Options => {
  return {
    hasEncrypt: true,
    storage,
    ...options,
  }
}
export const create = (storage: Storage = sessionStorage, options: Options = {}) => {
  return createStorage(createOptions(storage, options))
}

export const createLocalStorage = (options: Options = { prefixKey: 'mdbd_' }) => {
  return create(localStorage, { ...options, timeout: DEFAULT_CACHE_TIME })
}
