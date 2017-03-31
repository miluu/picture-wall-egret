/**
 * @namespace settings 设置模块
 * @author HuangYaxiong <hyxiong@qq.com>
 */

namespace settings {

  export interface IAppSettings {
    sceneWidth?: number;
    sceneHeight?: number;
    rowCount: number;
    padding: number;
    speed: number;
    sceneChangeTime: number;
    bgColor: string;
    bgImage?: string;
    autoResetTime: number;
    [key: string]: any;
  }

  /**
   * 默认设置选项
   */
  export const defaultSetting: IAppSettings = {
    sceneWidth: 0,
    sceneHeight: 0,
    padding: 30,
    rowCount: 6,
    speed: 1,
    bgColor: '#000',
    sceneChangeTime: 120,
    autoResetTime: 30
  };

}
