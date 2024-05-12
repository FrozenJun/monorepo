/* tslint:disable */
/* eslint-disable */
export interface DeviceCreateDto {

  /**
   * 设备地址
   */
  addr: string;
  id: string;
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
