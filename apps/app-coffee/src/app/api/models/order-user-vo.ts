/* tslint:disable */
/* eslint-disable */
import { Member } from './member';
import { OrderDeviceInfo } from './order-device-info';
import { OrderGoods } from './order-goods';
export interface OrderUserVo {

  /**
   * 订单总金额
   */
  amount: number;

  /**
   * 创建时间
   */
  createdAt: number;

  /**
   * 设备信息
   */
  deviceInfo: OrderDeviceInfo;

  /**
   * 商品信息
   */
  goods: Array<OrderGoods>;
  id: string;
  member?: Member;

  /**
   * 所属会员id
   */
  memberId?: string;

  /**
   * 支付时间
   */
  payAt?: number;

  /**
   * 支付方式
   */
  payway?: 0 | 1 | 2;

  /**
   * 使用的提货码
   */
  pickupCode?: string;

  /**
   * 退款时间
   */
  refundAt?: number;

  /**
   * 已退款金额
   */
  refundedAmount: number;

  /**
   * 订单来源
   */
  source: 0 | 1;

  /**
   * 源系统订单id
   */
  sourceOrderId: string;

  /**
   * 状态
   */
  status: 0 | 1 | 2 | 3;

  /**
   * 标题
   */
  title: string;
}
