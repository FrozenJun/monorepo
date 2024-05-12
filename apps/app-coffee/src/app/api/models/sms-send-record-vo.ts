/* tslint:disable */
/* eslint-disable */
import { Member } from './member';
import { SmsBatchRecord } from './sms-batch-record';
import { SmsTpl } from './sms-tpl';
export interface SmsSendRecordVo {
  batchRecord?: SmsBatchRecord;

  /**
   * 批量发送记录id
   */
  batchRecordId?: string;

  /**
   * 发送回执，用于后续查询发送状态
   */
  bizId?: string;

  /**
   * 创建时间
   */
  createdAt: number;
  id: string;
  member?: Member;

  /**
   * 所属会员id
   */
  memberId?: string;
  phone: string;

  /**
   * 发送状态
   */
  status: 1 | 2 | 3;

  /**
   * 发送成功时间
   */
  successAt?: number;
  tpl: SmsTpl;

  /**
   * 短信模版id
   */
  tplId: string;
}
