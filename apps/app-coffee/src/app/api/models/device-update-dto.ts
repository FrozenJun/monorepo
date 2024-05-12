/* tslint:disable */
/* eslint-disable */
export interface DeviceUpdateDto {

  /**
   * 设备地址
   */
  addr: string;
  lat: number;
  lng: number;

  /**
   * 厂家
   */
  manufacturer: 0 | 1;

  /**
   * 设备名称
   */
  name: string;
}
