/* tslint:disable */
/* eslint-disable */
export interface PickupCodeUsageDetailsVo {

  /**
   * 具体的提货码
   */
  code?: string;

  /**
   * 创建时间
   */
  createdAt: number;

  /**
   * 描述
   */
  desc: string;
  id: string;

  /**
   * 关联的订单id
   */
  orderId?: string;

  /**
   * 退回时间，同上refunded
   */
  refundAt?: number;

  /**
   * 是否已退回，只有提货码使用的类型需要注意
   */
  refunded: 0 | 1 | 2 | 3;

  /**
   * 标题
   */
  title: string;

  /**
   * 提货码使用记录类型
   */
  type: 0 | 1 | 2 | 3;
}
