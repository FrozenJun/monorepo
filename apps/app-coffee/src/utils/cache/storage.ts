import { cacheCipher } from '@/app/constant/encrypt'
import type { EncryptionParams } from '@/utils/encrypt'
import { AesEncryption } from '@/utils/encrypt'

export interface CreateStorageParams extends EncryptionParams {
  prefixKey: string
  hasEncrypt: boolean
  timeout?: number | null
}
export const createStorage = ({
  prefixKey = '',
  key = cacheCipher.key,
  iv = cacheCipher.iv,
  timeout = null,
  hasEncrypt = true,
}: Partial<CreateStorageParams> = {}) => {
  if (hasEncrypt && [key.length, iv.length].some((item) => item !== 16)) {
    throw new Error('When hasEncrypt is true, the key or iv must be 16 bits!')
  }
  // 加密信息
  const encryption = new AesEncryption({ key, iv })

  class Storage {
    private prefixKey?: string

    private encryption: AesEncryption

    private hasEncrypt: boolean

    /**
     *
     * @param {*} storage
     */
    constructor() {
      this.prefixKey = prefixKey
      this.encryption = encryption
      this.hasEncrypt = hasEncrypt
    }

    private getKey(key: string) {
      return `${this.prefixKey}${key}`.toUpperCase()
    }

    /**
     * 设置缓存
     * @param {string} key
     * @param {*} value
     * @param {*}  Expiration 过期时间
     * @memberof Cache
     */
    set(key: string, value: any, expire: number | null = timeout) {
      try {
        const stringData = JSON.stringify({
          value,
          time: Date.now(),
          expire: expire ? new Date().getTime() + expire * 1000 : null,
        })
        const stringifyValue = this.hasEncrypt
          ? this.encryption.encryptByAES(stringData)
          : stringData
        uni.setStorageSync(this.getKey(key), stringifyValue)
      } catch (err) {
        throw new Error(`setStorageSync error: ${err}`)
      }
    }

    /**
     * 读取缓存
     * @param {string} key
     * @param {*} def
     * @memberof Cache
     */
    get<T = any>(key: string, def: any = null): T {
      const val = uni.getStorageSync(this.getKey(key))
      if (!val) return def

      try {
        const decVal = this.hasEncrypt ? this.encryption.decryptByAES(val) : val
        const data = JSON.parse(decVal)
        const { value, expire } = data
        if (!expire || expire < new Date().getTime()) {
          this.remove(key)
          return def
        }
        return value
      } catch (e) {
        return def
      }
    }

    /**
     * 删除缓存
     * @param {string} key
     * @memberof Cache
     */
    remove(key: string) {
      uni.removeStorageSync(this.getKey(key))
    }

    /**
     * Delete all caches of this instance
     */
    clear(): void {
      uni.clearStorageSync()
    }
  }
  return new Storage()
}
