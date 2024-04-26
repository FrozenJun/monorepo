/* tslint:disable */
/* eslint-disable */
export interface BalanceDetailsUserPageDto {
  memberId: string;
  page: number;
  size: number;

  /**
   * 类型（多选）
   */
  types?: Array<0 | 1 | 2>;
}
