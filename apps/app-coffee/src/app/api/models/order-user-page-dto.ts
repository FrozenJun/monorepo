/* tslint:disable */
/* eslint-disable */
export interface OrderUserPageDto {

  /**
   * 查询截止时间
   */
  createdAtEnd?: number;

  /**
   * 查询开始时间
   */
  createdAtStart?: number;
  page: number;

  /**
   * 支付方式（多选）
   */
  payways?: Array<0 | 1 | 2>;
  size: number;

  /**
   * 状态（多选）
   */
  status?: Array<0 | 1 | 2 | 3>;
}
