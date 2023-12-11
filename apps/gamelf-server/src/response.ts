import { HttpStatus } from '@nestjs/common'

export interface IErrorResponse {
  code: number
  msg: string
}

export interface ISuccessResponse<T = object> {
  code: number
  msg: string
  data?: T
}

export interface IPaginateResponse {
  current: number
  size: number
  total: number
  records: object[]
}

export const successResponse = <T>(
  data?: T | undefined,
  successText?: string,
): ISuccessResponse<T> => {
  return {
    code: 200,
    msg: successText || '成功',
    data,
  }
}

export const errorResponse = (errorText: string): IErrorResponse => {
  return {
    code: HttpStatus.BAD_REQUEST,
    msg: errorText || '失败',
  }
}
