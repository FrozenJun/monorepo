import CryptoJS from 'crypto-js'

interface EncryptionInitOption {
  key: string
  iv: string
}

class Encryption {
  key: CryptoJS.lib.WordArray | undefined
  iv: CryptoJS.lib.WordArray | undefined

  init({ key, iv }: EncryptionInitOption) {
    this.key = CryptoJS.enc.Utf8.parse(key)
    this.iv = CryptoJS.enc.Utf8.parse(iv)
  }

  //解密方法
  decrypt(word?: string) {
    if (!word) return ''
    if (!this.key || !this.iv) throw new Error('Crypto key或者iv未定义')

    const encryptedHexStr = CryptoJS.enc.Hex.parse(word)
    const srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr)
    const decrypt = CryptoJS.AES.decrypt(srcs, this.key, {
      iv: this.iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    })
    const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8)
    return decryptedStr.toString()
  }

  //加密方法
  encrypt(word?: string) {
    if (!word) return ''
    if (!this.key || !this.iv) throw new Error('Crypto key或者iv未定义')

    const srcs = CryptoJS.enc.Utf8.parse(word)
    const encrypted = CryptoJS.AES.encrypt(srcs, this.key, {
      iv: this.iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    })
    return encrypted.ciphertext.toString().toUpperCase()
  }
}

export const encryption = new Encryption()
