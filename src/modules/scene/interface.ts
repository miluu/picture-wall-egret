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

  export const DEFAULT_DEVICEID = '1';

  export interface IState {
    sceneWidth: number;
    sceneHeight: number;
    padding: number;
    rowCount: number;
    offset: number;
    speed: number;
    bgColor: number;
    bgImage: string;
    bgFixMode: string;
    sceneChangeTime: number;
    sceneStartTime: Date;
    scenePassedTime: Date;
    autoResetTime: number;
    rowWidthList: number[];
    selectedItem: Item;
    status: string;
    lastOperateTime: Date;
    isButtonsShow: boolean;
    isExtraButtonsShow: boolean;
    nextApiItemsReady: boolean;
    nextApiRowWidthList: number[];
    showDetailAnimationTime: number;
    page: number;
    brandTextColor: string;
    titleTextColor: string;
    priceTextColor: string;
    descriptionTextColor: string;
    pixcelRatio: number;
    searchLoading: boolean;
    searchJump: Function;
    alreadySearchJump: boolean;
    labelHideTime: number;
  }

  export interface IConfig {
    deviceid: number | string;
    getConfigApi: string;
    getItemsApi: string;
    getSearchApi: string;
    getItemDetailApi: string;
    getSaleTypeApi?: string;
    getSearchType1Api?: string;
    __env__?: string;
  }

  export interface IApi {
    status: string;
    message: string;
    result: {
      bgm: string;
      items: IApiItem[]
    };
  }

  export interface ISaleTypesApi {
    status: string;
    message: string;
    result: {
      saleTypes: IApiExtraItem[]
    };
  }

  export interface ISettingsApi {
    status: string;
    message: string;
    result: {
      config: settings.IAppSettings;
    };
  }

  export interface IApiItem {
    goodsno: string;
    brand: string;
    title: string;
    description: string;
    price: number;
    detailUrl: string;
    thumbnail: IApiImg;
    imgs: IApiImg[];
    extraItems: IApiExtraItem[];
    extraItemsMerged?: boolean;
    flag?: IApiFlag;
  }

  export interface ISize {
    width: number;
    height: number;
  }

  export interface IApiImg extends ISize {
    url: string;
    texture: egret.Texture;
  }

  export interface IApiFlag extends ISize {
    icon: string;
    position?: 'TL' | 'TR' | 'BL' | 'BR';
    texture: egret.Texture;
    offset?: number;
  }

  export interface IApiExtraItem {
    icon?: string;
    texture: egret.Texture;
    button: Button;
    bgColor?: string;
    type: number;
    condition: string;
    label?: string;
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
