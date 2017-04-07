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
    bgFixMode?: string;
    autoResetTime: number;
    showDetailAnimationTime?: number;
    brandTextColor?: string;
    titleTextColor?: string;
    priceTextColor?: string;
    descriptionTextColor?: string;
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
    bgFixMode: 'noScale',
    sceneChangeTime: 120,
    autoResetTime: 30,
    showDetailAnimationTime: 3500,
    brandTextColor: '#000',
    titleTextColor: '#000',
    priceTextColor: '#000',
    descriptionTextColor: '#000'
  };

}
