/* tslint:disable */
/* eslint-disable */
import { MemberQueryDto } from './member-query-dto';
export interface SmsMemberBatchSendDto {
  memberIds?: Array<string>;
  memberQueryDTO?: MemberQueryDto;
  tplId: string;
}
