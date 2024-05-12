/* tslint:disable */
/* eslint-disable */
export interface PickupCodeComboCreateDto {

  /**
   * 总价
   */
  amount: number;

  /**
   * 数量
   */
  count: number;

  /**
   * 新会员专享
   */
  forNewMember: boolean;

  /**
   * 排序（降序）
   */
  sort: number;
}
