/* tslint:disable */
/* eslint-disable */
export interface SmsSendRecordQueryDto {

  /**
   * 批量发送记录id
   */
  batchRecordId?: string;

  /**
   * 发送时间截止
   */
  createdAtEnd?: number;

  /**
   * 发送时间起始
   */
  createdAtStart?: number;

  /**
   * 会员id
   */
  memberId?: string;
  page: number;

  /**
   * 手机号(模糊搜索)
   */
  phone?: string;
  size: number;

  /**
   * 状态
   */
  status?: 1 | 2 | 3;

  /**
   * 短信模版id
   */
  tplId?: string;
}
