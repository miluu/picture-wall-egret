namespace scene {
  export class Scene extends egret.DisplayObjectContainer {
    private _items: Item[] = [];
    private _repels: Repel[] = [];

    private _bg: SceneBg;

    public state: IState = <IState>{};

    constructor() {
      super();
    }

    public useSettings(settings: settings.IAppSettings) {
      this.state.sceneWidth = settings.sceneWidth;
      this.state.sceneHeight = settings.sceneHeight;
      this.state.bgColor = util.colorStringToNumber(settings.bgColor);
      this.state.bgImage = settings.bgImage;
      this.state.apiList = settings.apiList;
      this.state.rowCount = settings.rowCount;
      this.state.padding = settings.padding;
      this.state.speed = settings.speed;
      this.state.sceneChangeTime = settings.sceneChangeTime;
      this.state.autoResetTime = settings.autoResetTime;
      this.state.offset = 0;
      this._createBg();

      if (this.state.apiList.length) {
        this.start();
      }
    }

    public start(apiIndex: number = 0) {
      ajax.getJson(this.state.apiList[apiIndex], {
        onError: () => {
          alert('加载失败！');
        },
        onComplete: (data) => {
          if (!((<IApi>data).status === 'success')) {
            alert((<IApi>data).message || '加载失败!');
            return;
          }
          const apiItems = (<IApi>data).result.items;
          this._createItems(apiItems);
        }
      });
    }

    getRowHeight(): number {
      const {sceneHeight, rowCount, padding} = this.state;
      return (sceneHeight - (rowCount + 1) * padding) / rowCount;
    }

    private _createBg() {
      if (this._bg) {
        this.removeChild(this._bg);
      }
      this._bg = new SceneBg(this.state.sceneWidth, this.state.sceneHeight, this.state.bgColor, this.state.bgImage);
      this.addChild(this._bg);
    }

    private _createItems(apiItems: IApiItem[]) {
      const itemHeight = this.getRowHeight();
      const state = this.state;
      if (this._items) {
        _.forEach(this._items, (item) => {
          this.removeChild(item);
        });
        this._items = [];
      }
      let rowWidthArr: number[] = new Array(this.state.rowCount);
      _.fill(rowWidthArr, 0);
      _.forEach(apiItems, (apiItem, index) => {
        let originSize = {width: apiItem.imgs[0].width, height: apiItem.imgs[0].height};
        let changeSize = util.fixHeight(originSize, itemHeight);
        let item = new Item(changeSize.width, changeSize.height);
        let rowIndex = getMinWidthRowIndex();
        let rowWidth = rowWidthArr[rowIndex];
        item.y = getRowItemY(rowIndex);
        item.x = rowWidth + state.padding + item.width / 2;
        rowWidth += item.width + this.state.padding;
        rowWidthArr[rowIndex] = rowWidth;
        this.addChild(item);
        this._items.push(item);
      });

      function getMinWidthRowIndex(): number {
        let minWidth = _.min(rowWidthArr);
        let index = _.findIndex(rowWidthArr, width => width === minWidth);
        return index;
      }

      function getRowItemY(rowIndex): number {
        return (state.padding + itemHeight) * rowIndex + itemHeight / 2 + state.padding;
      }
    }
  }

  class SceneBg extends egret.DisplayObjectContainer {
    private _bgWidth: number;
    private _bgHeight: number;
    private _bgColor: number;
    private _bgImage: string;

    constructor(width: number, height: number, bgColor: number = 0x000000, bgImage?: string) {
      super();
      this._bgWidth = width;
      this._bgHeight = height;
      this._bgColor = bgColor;
      this._bgImage = bgImage;

      this._createBgColor();
      this._createBgImage();
    }

    private _createBgColor() {
      const shp = new egret.Shape();
      const g = shp.graphics;
      g.beginFill(this._bgColor);
      g.drawRect(0, 0, this._bgWidth, this._bgHeight);
      g.endFill();
      this.addChild(shp);
    }
    private _createBgImage() {
    }
  }
}
