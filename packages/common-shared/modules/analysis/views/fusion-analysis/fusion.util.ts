import { SubjectRetrievalVo } from '@/api/modules/ams/models/subject-retrieval-vo'
import { ARCH_ELECTRONIC_GOODS_TYPE_ENUM, HOLOGRAM_DATA_TYPE_ENUM } from '@/api/modules/enum'
import { AdsFile } from '@/api/modules/ias/models/ads-file'

export const getNormalObjFromRes = (res: Partial<SubjectRetrievalVo>) => {
  switch (res.subjectType) {
    case HOLOGRAM_DATA_TYPE_ENUM.人:
      const person = res.person || {}
      return {
        ...res,
        ...person,
        address: (person.liveAreaAddress || '') + (person.liveAddressDetail || ''),
        avatarUrl: getPicture(person.pics),
      }
    case HOLOGRAM_DATA_TYPE_ENUM.车辆:
      const vehicle = res.vehicle || {}
      return {
        ...res,
        ...vehicle,
        vehicle: vehicle.plateNum,
        avatarUrl: getPicture(vehicle.pics),
      }
    case HOLOGRAM_DATA_TYPE_ENUM.码:
      const electronicGoods = res.electronicGoods || {}
      return {
        ...res,
        ...getCodeObj(electronicGoods.code, electronicGoods.type),
        ...electronicGoods,
      }
  }

  return res

  function getPicture(files: AdsFile[] | undefined) {
    const path = (files && files[0] && files[0].path) || ''
    return path.includes('/assets/') ? path : import.meta.env.VITE_BASE_URL + path
  }

  function getCodeObj(code?: string, type?: string) {
    switch (type) {
      case ARCH_ELECTRONIC_GOODS_TYPE_ENUM.IMEI:
        return { imei: code }
      case ARCH_ELECTRONIC_GOODS_TYPE_ENUM.IMSI:
        return { imsi: code }
      case ARCH_ELECTRONIC_GOODS_TYPE_ENUM.MAC:
        return { mac: code }
      case ARCH_ELECTRONIC_GOODS_TYPE_ENUM.手机号:
        return { phone: code }
    }
    return {}
  }
}
