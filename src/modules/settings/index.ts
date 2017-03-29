/**
 * @namespace settings 设置模块
 * @author HuangYaxiong <hyxiong@qq.com>
 */

namespace settings {

  export interface IAppSettings {
    sceneWidth: number;
    sceneHeight: number;
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
    sceneWidth: 1366,
    sceneHeight: 768,
    padding: 30,
    rowCount: 6,
    speed: 1,
    bgColor: '#000',
    sceneChangeTime: 120,
    autoResetTime: 30
  };

  /**
   * 验证设置选项内容合法性
   * @param settings {IAppSettings}
   */
  function doVerify(settings: IAppSettings): boolean {
    if (
      _.isNaN(settings.sceneWidth)
      || _.isUndefined(settings.sceneWidth)
      || settings.sceneWidth <= 0
      || _.isNaN(settings.sceneHeight)
      || _.isUndefined(settings.sceneHeight)
      || settings.sceneHeight <= 0
      || _.isNaN(settings.rowCount)
      || _.isUndefined(settings.rowCount)
      || settings.rowCount <= 0
      || _.isNaN(settings.padding)
      || _.isUndefined(settings.padding)
      || settings.padding <= 0
      || _.isNaN(settings.speed)
      || _.isUndefined(settings.speed)
      || settings.speed <= 0
      || _.isNaN(settings.sceneChangeTime)
      || _.isUndefined(settings.sceneChangeTime)
      || settings.sceneChangeTime < 0
      || _.isNaN(settings.autoResetTime)
      || _.isUndefined(settings.autoResetTime)
      || settings.autoResetTime < 0
    ) {
      alert('数字格式不正确');
      return false;
    }
    return true;
  }
}
