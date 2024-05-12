/* tslint:disable */
/* eslint-disable */
import { Member } from './member';
import { Order } from './order';
export interface ConsumptionRecordUserVo {

  /**
   * 金额，类型为微信退款的退款金额也会填写到这里
   */
  amount: number;

  /**
   * 充值的金额,充50送20里的50
   */
  balance?: number;

  /**
   * 创建时间
   */
  createdAt: number;

  /**
   * 描述
   */
  desc?: string;

  /**
   * 充值的金额,充50送20里的20
   */
  giftBalance?: number;
  id: string;
  member: Member;

  /**
   * 所属会员id
   */
  memberId: string;

  /**
   * 关联的订单
   */
  order?: Order;

  /**
   * 关联的订单ID
   */
  orderId?: string;

  /**
   * 支付时间
   */
  payAt?: number;

  /**
   * 提货码套餐id
   */
  pickupCodeComboId?: string;

  /**
   * 提货码数量
   */
  pickupCodeCount?: number;

  /**
   * 退款时间，只有订单支付类型需要关注
   */
  refundAt?: number;

  /**
   * 已退款金额，仅类型为微信付款的包含该字段
   */
  refundedAmount: number;

  /**
   * 状态
   */
  status: 0 | 1 | 2 | 3;

  /**
   * 标题
   */
  title: string;

  /**
   * 类型
   */
  type: 0 | 1 | 2 | 3;
}
