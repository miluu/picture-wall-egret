namespace scene {
  export class Scene extends egret.DisplayObjectContainer {
    private _items: Item[] = [];
    private _repels: Repel[] = [];

    private _bg: SceneBg;

    public state: IState = <IState>{};

    constructor() {
      super();
      console.log(this);
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
      // this.mask = new egret.Rectangle(0, 0, this.state.sceneWidth, this.state.sceneHeight);

      if (this.state.apiList.length) {
        this.start();
        let repel = new Repel(300, 300, 300, 0.4);
        this._repels = [repel];
      }
    }

    public start(apiIndex: number = 0) {
      console.log(`use api ${apiIndex}: ${this.state.apiList[apiIndex]}`);
      this.state.selectedApiIndex = apiIndex;
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
          this.state.status = SCENE_STATUS.ENTER;
          this._createItems(apiItems);
          this._run();
          this._enter();
        }
      });
    }

    public next() {
      let {selectedApiIndex, apiList} = this.state;
      let apiCount = apiList.length;
      selectedApiIndex++;
      if (selectedApiIndex > apiCount - 1) {
        selectedApiIndex = 0;
      }
      this.start(selectedApiIndex);
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

    private _enter() {
      let done = 0;
      let itemsCount = this._items.length;
      console.log('start enter.');
      _.forEach(this._items, (item) => {
        let time = 3000 + Math.random() * 5000;
        let toY = this._getRowItemY(item.rowIndex);
        let tw = new TWEEN.Tween(item.basePosition)
          .to({y: toY}, time)
          .easing(TWEEN.Easing.Cubic.Out)
          .start()
          .onComplete(() => {
            done++;
            if (done === itemsCount) {
              this.state.status = SCENE_STATUS.RUNNING;
              console.log('enter end.');
              _.delay(() => {
                this._leave();
              }, this.state.sceneChangeTime * 1000);
            }
          });
      });
    }

    private _leave() {
      this.state.status = SCENE_STATUS.LEAVE;
      let leaveDirection = Math.random() > 0.5 ? 1 : -1;
      let itemsCount = this._items.length;
      let done = 0;
      console.log('start leave.');
      _.forEach(this._items, (item) => {
        if (item === this.state.selectedItem) {
          itemsCount--;
          _.remove(this._items, item);
          return;
        }
        let rotation = 180 * Math.random();
        let time = 2000 + Math.random() * 3000;
        let toY = item.y + this.state.sceneHeight * leaveDirection;
        let twObj = {
          y: item.basePosition.y,
          alpha: item.alpha,
          rotation: item.rotation
        }
        let tw = new TWEEN.Tween(twObj)
          .to({
            y: toY,
            alpha: 0.5,
            rotation,
          }, time)
          .easing(TWEEN.Easing.Cubic.In)
          .onUpdate(() => {
            item.basePosition.y = twObj.y;
            item.alpha = twObj.alpha;
            item.rotation = twObj.rotation;
          })
          .onComplete(() => {
            done++;
            _.remove(this._items, item);
            if (done === itemsCount) {
              console.log('leave end.');
              this.next();
            }
          })
          .start();
      });
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
      const enterDirection = Math.random() > 0.5 ? 1 : -1;
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
        item.basePosition.y = this._getRowItemY(rowIndex) + this.state.sceneHeight * enterDirection;
        item.basePosition.x = rowWidth + state.padding + item.width / 2;
        rowWidth += item.width + this.state.padding;
        state.rowWidthList[rowIndex] = rowWidth;
        item.x = item.basePosition.x;
        item.y = item.basePosition.y;
        item.acceptRepel = true;
        item.addEventListener(egret.TouchEvent.TOUCH_TAP, function() {
          if (this.state.status !== SCENE_STATUS.LEAVE) {
            this._select(item);
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
    }

    private _select(item: Item) {
      this.state.selectedItem = item;
    }

    private _getRowItemY(rowIndex): number {
      let itemHeight = this._getRowHeight();
      return (this.state.padding + itemHeight) * rowIndex + itemHeight / 2 + this.state.padding;
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
