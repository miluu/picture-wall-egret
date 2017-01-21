/**
 * @namespace scene 场景模块
 * @author HuangYaxiong <hyxiong@qq.com>
 * 常量与接口
 */

namespace scene {

  /**
   * 场景状态常量
   * RUNNING 运行中
   * LEAVE 离场状态
   * ENTER 入场状态
   * LOADING 加载中
   */
  export const SCENE_STATUS = {
    RUNNING: 'running',
    LEAVE: 'leave',
    ENTER: 'enter',
    LOADING: 'loading'
  };

  export interface IState {
    sceneWidth: number;
    sceneHeight: number;
    padding: number;
    rowCount: number;
    offset: number;
    speed: number;
    bgColor: number;
    bgImage: string;
    sceneChangeTime: number;
    autoResetTime: number;
    apiList: string[];
    rowWidthList: number[];
    selectedItem: Item;
    status: string;
    selectedApiIndex: number;
    lastOperateTime: Date;
    isButtonsShow: boolean;
    isExtraButtonsShow: boolean;
  }

  export interface IApi {
    status: string;
    message: string;
    result: {
      items: IApiItem[]
    };
  }

  export interface IApiItem {
    id: string;
    brand: string;
    title: string;
    description: string;
    price: number;
    detailUrl: string;
    imgs: IApiImg[];
    extraItems: IApiExtraItem[];
  }

  export interface ISize {
    width: number;
    height: number;
  }

  export interface IApiImg extends ISize {
    url: string;
    texture: egret.Texture;
  }

  export interface IApiExtraItem {
    icon?: string;
    texture: egret.Texture;
    button: Button;
    bgColor?: string;
    itemsUrl: string;
  }

  export interface IPosition {
    x: number;
    y: number;
  }

  export interface IItemViewInfo {
    x?: number;
    y?: number;
    scaleX?: number;
    scaleY?: number;
    alpha?: number;
    rotation?: number;
  };

}
