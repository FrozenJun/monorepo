/* tslint:disable */
/* eslint-disable */
export interface OrderMemberPageDto {
  page: number;
  size: number;

  /**
   * 状态（多选）
   */
  status: Array<0 | 1 | 2 | 3>;
}
