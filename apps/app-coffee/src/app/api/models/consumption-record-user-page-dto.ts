/* tslint:disable */
/* eslint-disable */
export interface ConsumptionRecordUserPageDto {

  /**
   * 查询截止时间
   */
  createdAtEnd?: number;

  /**
   * 查询开始时间
   */
  createdAtStart?: number;
  memberId?: string;
  page: number;
  size: number;

  /**
   * 状态（多选）
   */
  status?: Array<0 | 1 | 2 | 3>;

  /**
   * 类型（多选）
   */
  types?: Array<0 | 1 | 2 | 3>;
}
