namespace scene {
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
  }

  export interface IApiExtraItem {
    icon?: string;
    bgColor?: string;
    itemsUrl: string;
  }

  export interface IPosition {
    x: number;
    y: number;
  }

}
