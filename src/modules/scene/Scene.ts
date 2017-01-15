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
      this.mask = new egret.Rectangle(0, 0, this.state.sceneWidth, this.state.sceneHeight);

      if (this.state.apiList.length) {
        this.start();
        let repel = new Repel(300, 300, 300, 0.4);
        this._repels = [repel];
        console.log(repel);
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
          this._run();
        }
      });
    }

    private _moveItemToRowTail(item: Item) {
      const {basePosition, rowIndex, width} = item;
      const {rowWidthList, padding} = this.state;
      const rowWidth = rowWidthList[rowIndex];
      rowWidthList[rowIndex] = rowWidth + padding + width;
      basePosition.x = rowWidth + padding + width / 2;
    }

    private _getRowHeight(): number {
      const {sceneHeight, rowCount, padding} = this.state;
      return (sceneHeight - (rowCount + 1) * padding) / rowCount;
    }

    private _getItemPositionWithOffset(item: Item): egret.Point {
      return new egret.Point(item.basePosition.x + this.state.offset, item.basePosition.y);
    }

    private _outOfSceneLeftSide(x: number, rangeOffset: number = 50): boolean {
      return x < -rangeOffset;
    }

    private _itemOutOfSceneLeftSide(item: Item, rangeOffset: number = 50): boolean {
      let {x} = this._getItemPositionWithOffset(item);
      x = x + item.width / 2;
      return this._outOfSceneLeftSide(x, rangeOffset);
    }

    private _outOfSceneRightSide(x: number, rangeOffset: number = 50): boolean {
      return x > this.state.sceneWidth + rangeOffset;
    }

    private _itemOutOfSceneRightSide(item: Item, rangeOffset: number = 50): boolean {
      let {x} = this._getItemPositionWithOffset(item);
      x = x - item.width / 2;
      return this._outOfSceneRightSide(x, rangeOffset);
    }

    private _run() {
      this.addEventListener(egret.Event.ENTER_FRAME, this._onEnterFrame, this);
    }

    private _onEnterFrame() {
      const {speed} = this.state;
      this.state.offset -= speed;
      _.forEach(this._items, (item) => {
        let itemPositionWithOffset = this._getItemPositionWithOffset(item);
        if (this._itemOutOfSceneRightSide(item, 50)) {
          item.visible = false;
        } else {
          item.visible = true;
          if (item.acceptRepel) {
            let itemPositionWithRepel = this._repels[0].use(itemPositionWithOffset);
            item.x = itemPositionWithRepel.point.x;
            item.y = itemPositionWithRepel.point.y;
            item.alpha = item.scaleX = item.scaleY = (1 - itemPositionWithRepel.effectStrong);
          } else {
            item.x = itemPositionWithOffset.x;
            item.y = itemPositionWithOffset.y;
            item.alpha = 1;
          }
        }
        if (this._itemOutOfSceneLeftSide(item, 50)) {
          this._moveItemToRowTail(item);
        }
      });
      Repel.update();
      TWEEN.update();
    }

    private _createBg() {
      if (this._bg) {
        this.removeChild(this._bg);
      }
      this._bg = new SceneBg(this.state.sceneWidth, this.state.sceneHeight, this.state.bgColor, this.state.bgImage);
      this.addChild(this._bg);
    }

    private _createItems(apiItems: IApiItem[]) {
      const itemHeight = this._getRowHeight();
      const state = this.state;
      state.rowWidthList = [];
      if (this._items) {
        _.forEach(this._items, (item) => {
          this.removeChild(item);
        });
        this._items = [];
      }
      state.rowWidthList = new Array(this.state.rowCount);
      _.fill(state.rowWidthList, 0);
      let repel = this._repels[0];
      _.forEach(apiItems, (apiItem, index) => {
        let originSize = {width: apiItem.imgs[0].width, height: apiItem.imgs[0].height};
        let changeSize = util.fixHeight(originSize, itemHeight);
        let item = new Item(changeSize.width, changeSize.height);
        let rowIndex = getMinWidthRowIndex();
        let rowWidth = state.rowWidthList[rowIndex];
        item.rowIndex = rowIndex;
        item.basePosition.y = getRowItemY(rowIndex);
        item.basePosition.x = rowWidth + state.padding + item.width / 2;
        rowWidth += item.width + this.state.padding;
        state.rowWidthList[rowIndex] = rowWidth;
        item.x = item.basePosition.x;
        item.y = item.basePosition.y;
        item.acceptRepel = true;
        item.addEventListener(egret.TouchEvent.TOUCH_TAP, function() {
          repel.strong = 0;
          repel.toStrong(0.4, 1000);
          if (repel.attachObject === item) {
            repel.attach();
            item.acceptRepel = true;
          } else {
            if (repel.attachObject) {
              (<Item>repel.attachObject).acceptRepel = true;
            }
            repel.attach(item);
            item.acceptRepel = false;
          }
        }, this);
        this.addChild(item);
        this._items.push(item);
      });

      function getMinWidthRowIndex(): number {
        let minWidth = _.min(state.rowWidthList);
        let index = _.findIndex(state.rowWidthList, width => width === minWidth);
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
