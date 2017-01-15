namespace scene {
  /**
   * @class Scene 场景类
   */
  export class Scene extends egret.DisplayObjectContainer {
    /**
     * 添加场景中的所有 Item 实例
     */
    private _items: Item[] = [];

    /**
     * 添加到场景中的所有 Repel 实例
     */
    private _repels: Repel[] = [];

    /**
     * 场景的背景，包含背景色与背景图片
     */
    private _bg: SceneBg;

    /**
     * 存储场景各种状态的对象
     */
    public state: IState = <IState>{};

    /**
     * @constructor 生成一个场景实例
     */
    constructor() {
      super();
      console.log(this);
    }

    /**
     * 应用设置到场景，并开始播放第一个 api 场景
     * @param settings {settings.IAppSettings} 设置参数
     */
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
      }
    }

    /**
     * 开始播放场景
     * @param apiIndex {number} 全用的 api 序号，默认为 0
     */
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

    /**
     * 播放下一个 api 的场景
     */
    public next() {
      let {selectedApiIndex, apiList} = this.state;
      let apiCount = apiList.length;
      selectedApiIndex++;
      if (selectedApiIndex > apiCount - 1) {
        selectedApiIndex = 0;
      }
      this.start(selectedApiIndex);
    }

    /**
     * 将 item 位置移动到所在行的末尾
     * @param {Item} 要移动的 item
     */
    private _moveItemToRowTail(item: Item) {
      const {basePosition, rowIndex, width} = item;
      const {rowWidthList, padding} = this.state;
      const rowWidth = rowWidthList[rowIndex];
      rowWidthList[rowIndex] = rowWidth + padding + width;
      basePosition.x = rowWidth + padding + width / 2;
    }

    /**
     * 根据设置参数获取每一行的高度
     * @return {number} 根据设置参数获取每一行的高度
     */
    private _getRowHeight(): number {
      const {sceneHeight, rowCount, padding} = this.state;
      return (sceneHeight - (rowCount + 1) * padding) / rowCount;
    }

    /**
     * 获取 item 应用偏移量之后的坐标点
     * @param item {Item} item 对象
     * @return {egret.Point} 应用偏移量之后的坐标点
     */
    private _getItemPositionWithOffset(item: Item): egret.Point {
      return new egret.Point(item.basePosition.x + this.state.offset, item.basePosition.y);
    }

    /**
     * 判断 x 值是否在场景左侧，可设置偏移范围
     * @param x {number} x 坐标值
     * @param rangeOffset {number} 偏移范围
     * @return {boolean}
     */
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
              let timer = new egret.Timer(this.state.sceneChangeTime * 1000, 1);
              timer.start();
              timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, function() {
                this._leave();
              }, this);
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
      _.forEach(this._items, (item, index) => {
        if (item === this.state.selectedItem) {
          itemsCount--;
          return;
        }
        let rotation = 180 * Math.random();
        let time = 2000 + Math.random() * 3000;
        let toY = item.y + this.state.sceneHeight * leaveDirection;
        let twObj = {
          y: item.basePosition.y,
          alpha: item.alpha,
          rotation: item.rotation
        };
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
            this.removeChild(item);
            _.remove(this._items, item);
            if (done === itemsCount) {
              console.log('leave end.');
              this.next();
            }
          })
          .start();
      });
      if (this.state.selectedItem) {
        _.remove(this._items, this.state.selectedItem);
      }
    }

    private _onEnterFrame() {
      const {speed, selectedItem} = this.state;
      this.state.offset -= speed;
      _.forEach(this._items, (item) => {
        if (item === selectedItem) {
          return;
        }
        let itemPositionWithOffset = this._getItemPositionWithOffset(item);
        if (this._itemOutOfSceneRightSide(item, 50)) {
          item.visible = false;
        } else {
          item.visible = true;
          if (item.acceptRepel) {
            let point = itemPositionWithOffset;
            let offsetDistance = 0;
            let offsetStrong = 0;
            _.forEach(this._repels, (repel) => {
              let repelEffect = repel.use(point);
              point = repelEffect.point;
              offsetDistance += repelEffect.offsetDistance;
              offsetStrong += repelEffect.effectStrong;
            });
            item.x = point.x;
            item.y = point.y;
            item.alpha = item.scaleX = item.scaleY = (1 - offsetStrong);
            // let itemPositionWithRepel = this._repels[0].use(itemPositionWithOffset);
            // item.x = itemPositionWithRepel.point.x;
            // item.y = itemPositionWithRepel.point.y;
            // item.alpha = item.scaleX = item.scaleY = (1 - itemPositionWithRepel.effectStrong);
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
