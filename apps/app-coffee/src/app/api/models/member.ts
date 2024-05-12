/* tslint:disable */
/* eslint-disable */
export interface Member {

  /**
   * 头像地址
   */
  avatarUrl?: string;

  /**
   * 账户余额
   */
  balance: number;

  /**
   * 创建时间
   */
  createdAt: number;
  id: string;

  /**
   * 新会员
   */
  newMember: boolean;

  /**
   * 昵称
   */
  nickname?: string;
  phone: string;
}
