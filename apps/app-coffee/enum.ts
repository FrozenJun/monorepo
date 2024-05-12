export enum OrderPayway {
  微信支付,
  余额支付,
  提货码,
}

export enum OrderStatus {
  未支付,
  已完成,
  已退款,
  部分退款,
}

export enum ConsumptionRecordType {
  余额充值,
  提货码购买,
  订单支付,
  微信退款,
}

export enum ConsumptionRecordStatus {
  未支付,
  已完成,
  已退款,
  部分退款,
}

/** 提货码来源 */
export enum PickupCodeSoure {
  购买,
  系统赠送,
}

export enum BalanceDetailType {
  余额充值,
  余额付款,
  余额退款,
}

export enum BalanceDetailRefundStatus {
  无退款,
  部分退款,
  已退款,
}

export enum PickupCodeUsageDetailType {
  提货码购买,
  提货码赠送,
  提货码使用,
  提货码退回,
}

export enum OrderSource {
  朗立臣,
  维迪,
}

export enum DeviceManufacturer {
  朗立臣,
  维迪,
}

/** 和阿里云的保持一致 */
export enum SMSSendStatus {
  等待回执 = 1,
  发送失败 = 2,
  发送成功 = 3,
}
