/* tslint:disable */
/* eslint-disable */
import { SmsTpl } from './sms-tpl';
export interface SmsBatchRecordVo {

  /**
   * 批量发送回执，用于后续查询发送状态
   */
  bizId?: string;

  /**
   * 是否已经发送完毕(不管成功失败)
   */
  completed: boolean;

  /**
   * 发送完毕时间
   */
  completedAt?: number;

  /**
   * 创建时间
   */
  createdAt: number;

  /**
   * 发送失败数量
   */
  failCount: number;
  id: string;

  /**
   * 发送成功数量
   */
  successCount: number;

  /**
   * 发送的总数
   */
  totalCount: number;
  tpl: SmsTpl;

  /**
   * 短信模版id
   */
  tplId: string;
}
