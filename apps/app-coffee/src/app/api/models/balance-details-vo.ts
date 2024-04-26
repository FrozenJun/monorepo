/* tslint:disable */
/* eslint-disable */
export interface BalanceDetailsVo {

  /**
   * 金额，类型为余额退款的退款金额也会填写到这里
   */
  amount: number;

  /**
   * 创建时间
   */
  createdAt: number;

  /**
   * 描述
   */
  desc?: string;
  id: string;

  /**
   * 退款时间，同上refundStatus
   */
  refundAt?: number;

  /**
   * 退款状态，仅类型为余额付款的明细该字段有效
   */
  refundStatus: 0 | 1 | 2;

  /**
   * 已退款金额，仅类型为余额付款的包含该字段
   */
  refundedAmount: number;

  /**
   * 标题
   */
  title: string;

  /**
   * 余额明细类型
   */
  type: 0 | 1 | 2;
}
