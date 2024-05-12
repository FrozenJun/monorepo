/* tslint:disable */
/* eslint-disable */
export interface MemberQueryDto {

  /**
   * 注册时间截止
   */
  createdAtEnd?: number;

  /**
   * 注册时间起始
   */
  createdAtStart?: number;

  /**
   * 手机号(模糊搜索)
   */
  phone?: string;
}
