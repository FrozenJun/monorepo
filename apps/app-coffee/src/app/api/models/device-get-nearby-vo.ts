/* tslint:disable */
/* eslint-disable */
export interface DeviceGetNearbyVo {

  /**
   * 设备地址
   */
  addr: string;

  /**
   * 距离(m)
   */
  distance: number;
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
