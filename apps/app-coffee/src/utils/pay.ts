import { PickupCodeComboAPIService } from '@/app/api/services/pickup-code-combo-api'
import { APP_ID } from '@/app/constant/global'
import { HideLoading, Loading, Toast } from './toast'
import { BalanceComboAPIService } from '@/app/api/services/balance-combo-api'
import { OrderAPIService } from '@/app/api/services/order-api'

export async function getCode() {
  try {
    const { code } = await uni.login({
      provider: 'weixin',
    })
    return code
  } catch (error) {
    console.error(error)
    Toast('获取code失败')
    return undefined
  }
}

export async function payPickup(comboId: string, onSuccess: any) {
  Loading('正在拉起支付...')
  const code = await getCode()
  if (code) {
    const { e, data } = await PickupCodeComboAPIService.pickupCodeComboControllerBuy({
      code,
      comboId,
    })
    HideLoading()
    if (e) return
    wx.requestPayment({
      appId: APP_ID,
      success: onSuccess,
      fail: () => {
        Toast('支付已取消')
      },
      ...data,
    })
  } else {
    HideLoading()
  }
}

export async function payBalance(comboId: string, onSuccess: any) {
  Loading('正在拉起支付...')
  const code = await getCode()
  if (code) {
    const { e, data } = await BalanceComboAPIService.balanceComboControllerBuy({
      code,
      comboId,
    })
    HideLoading()
    if (e) return
    wx.requestPayment({
      appId: APP_ID,
      success: onSuccess,
      fail: () => {
        Toast('支付已取消')
      },
      ...data,
    })
  } else {
    HideLoading()
  }
}

export async function payOrder(orderId: string, onSuccess: any) {
  Loading('正在拉起支付...')
  const code = await getCode()
  if (code) {
    const { e, data } = await OrderAPIService.orderControllerGetWepayParam({
      orderId,
      code,
    })
    HideLoading()
    if (e) return
    wx.requestPayment({
      appId: APP_ID,
      success: onSuccess,
      fail: () => {
        Toast('支付已取消')
      },
      ...data,
    })
  } else {
    HideLoading()
  }
}
