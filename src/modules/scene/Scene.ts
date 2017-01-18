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

    private _loadingView: LoadingView;

    /**
     * 存储场景各种状态的对象
     */
    public state: IState = <IState>{};

    /**
     * @constructor 生成一个场景实例
     */
    constructor() {
      super();
      this.touchEnabled = true;
      this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this._touchScene, this);
      this.addEventListener(egret.TouchEvent.TOUCH_END, this._touchScene, this);
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

      let loading = this._loadingView = new LoadingView('loading...' , this.state.sceneWidth, this.state.sceneHeight, 0.2);
      loading.x = this.state.sceneWidth / 2;
      loading.y = this.state.sceneHeight / 2;
      this.addChild(loading);

      if (this.state.apiList.length) {
        this.start();
      }
    }

    public hideLoading() {
      this._loadingView.text = 'loading';
      this._loadingView.visible = false;
    }

    public showLoading(text?: string) {
      let childCount = this.numChildren;
      this._loadingView.visible = true;
      this.setChildIndex(this._loadingView, childCount);
    }

    public setLoadingText(text: string) {
      this._loadingView.text = text;
    }
    /**
     * 开始播放场景
     * @param apiIndex {number} 全用的 api 序号，默认为 0
     */
    public start(apiIndex: number = 0) {
      this.showLoading();
      this.state.selectedApiIndex = apiIndex;
      this.state.status = SCENE_STATUS.LOADING;
      ajax.getJson(this.state.apiList[apiIndex], {
        onProgress: function(loaded, totle) {
        },
        onError: () => {
          alert('加载失败！');
        },
        onComplete: (_data) => {
          let data = <IApi>_data;
          if (!(data.status === 'success')) {
            alert(data.message || '加载失败!');
            return;
          }
          this._loadSources(data);
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

    private _loadSources(data: IApi) {
      let imagesCount = this._getApiImagesCount(data);
      let successCount = 0;
      let failedCount = 0;
      const apiItems = data.result.items;
      _.forEach(apiItems, (item) => {
        _.forEach(item.imgs, (img) => {
          ajax.getTexture(img.url, {
            onComplete: (texture) => {
              successCount++;
              img.texture = texture;
              loadedHandle(this);
            },
            onError: () => {
              failedCount++;
              loadedHandle(this);
            }
          });
        });
      });

      function loadedHandle(thisObj: Scene) {
        thisObj._loadingView.text = `loading...\n${successCount + failedCount} / ${imagesCount}`;
        if (successCount + failedCount === imagesCount) {
          thisObj.hideLoading();
          thisObj._createItems(apiItems);
          // Nice code!
          thisObj.once(egret.Event.ENTER_FRAME, function() {
            thisObj.once(egret.Event.ENTER_FRAME, function() {
              thisObj.once(egret.Event.ENTER_FRAME, function() {
                thisObj.once(egret.Event.ENTER_FRAME, function() {
                  thisObj.once(egret.Event.ENTER_FRAME, function() {
                    thisObj.once(egret.Event.ENTER_FRAME, function() {
                      thisObj.once(egret.Event.ENTER_FRAME, function() {
                        thisObj.once(egret.Event.ENTER_FRAME, function() {
                          thisObj._run();
                          thisObj._enter();
                        }, null);
                      }, null);
                    }, null);
                  }, null);
                }, null);
              }, null);
            }, null);
          }, null);
        }
      }
    }

    private _touchScene() {
      this.state.lastOperateTime = new Date();
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
      this.state.status = SCENE_STATUS.ENTER;
      let done = 0;
      let itemsCount = this._items.length;
      _.forEach(this._items, (item) => {
        let time = 2000 + Math.random() * 4000;
        let toY = this._getRowItemY(item.rowIndex);
        let tw = new TWEEN.Tween(item.basePosition)
          .to({y: toY}, time)
          .easing(TWEEN.Easing.Cubic.Out)
          .start()
          .onComplete(() => {
            done++;
            if (done === itemsCount) {
              this.state.status = SCENE_STATUS.RUNNING;
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
      this._autoReset();
      _.forEach(this._items, (item) => {
        if (item === selectedItem) {
          return;
        }
        let itemPositionWithOffset = this._getItemPositionWithOffset(item);
        if (this._itemOutOfSceneRightSide(item, 50)) {
          item.visible = false;
        } else {
          item.visible = !item.isBacking;
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
            let strong = offsetDistance / (this._getRepelRadius() * 0.8);
            if (strong > 1) {
              strong = 1;
            } else if (strong < 0) {
              strong = 0;
            }
            item.x = point.x;
            item.y = point.y;
            item.alpha = item.scaleX = item.scaleY = (1 - strong);
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

    private _autoReset() {
      const {autoResetTime, lastOperateTime, selectedItem, status} = this.state;
      if (!autoResetTime
        || !lastOperateTime
        || !selectedItem
        || status !== SCENE_STATUS.RUNNING
      ) {
        return;
      }
      const currentTime = new Date();
      if (currentTime.getTime() - lastOperateTime.getTime() > autoResetTime * 1000) {
        this._itemBack(selectedItem);
      }
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
        let texture = apiItem.imgs[0].texture;
        let item = new Item(changeSize.width, changeSize.height, null, texture);
        let rowIndex = getMinWidthRowIndex();
        let rowWidth = state.rowWidthList[rowIndex];
        item.data = apiItem;
        item.rowIndex = rowIndex;
        item.basePosition.y = this._getRowItemY(rowIndex) + this.state.sceneHeight * enterDirection;
        item.basePosition.x = rowWidth + state.padding + item.width / 2;
        rowWidth += item.width + this.state.padding;
        state.rowWidthList[rowIndex] = rowWidth;
        item.x = item.basePosition.x;
        item.y = item.basePosition.y;
        item.acceptRepel = true;
        item.addEventListener(egret.TouchEvent.TOUCH_TAP, function() {
          this._selectItem(item);
        }, this);
        this._items.push(item);
        this.addChild(item);
      });

      function getMinWidthRowIndex(): number {
        let minWidth = _.min(state.rowWidthList);
        let index = _.findIndex(state.rowWidthList, width => width === minWidth);
        return index;
      }
    }

    private _canSelectItem(): boolean {
      return this.state.status === SCENE_STATUS.ENTER
        || this.state.status === SCENE_STATUS.RUNNING;
    }

    private _selectItem(item: Item) {
      if (!this._canSelectItem()
        || this.state.selectedItem === item
        || item.isBacking
      ) {
        return;
      }
      if (this.state.selectedItem) {
        this._itemBack(this.state.selectedItem);
      }
      this.state.selectedItem = item;
      let repel = this._addRepel(item, item.x, item.y, 0, 0);
      repel.toOptions({
        strong: 0.5,
        radius: this._getRowHeight() * 2
      }, 1000, () => {
        repel.toOptions({
          strong: 0.65,
          radius: this._getRepelRadius()
        }, 1500);
      });

      let scale = this._getLargeItemScale();
      let tw1 = new TWEEN.Tween(item)
        .to({
          scaleX: 0.8,
          scaleY: 0.8,
          alpha: 1
        }, 1000)
        .easing(TWEEN.Easing.Cubic.InOut)
        .start();
      let tw2 = new TWEEN.Tween(item)
        .easing(TWEEN.Easing.Back.Out)
        .to({
          x: this.state.sceneWidth / 2,
          y: this.state.sceneHeight / 2,
          scaleX: scale,
          scaleY: scale
        }, 1500);
      tw1.chain(tw2);
      item.tweens.push(tw1, tw2);
    }

    private _itemBack(item: Item) {
      let repel = item.attatchedRepel;
      this.state.selectedItem = null;
      item.isBacking = true;
      item.clearTweens();
      if (repel) {
        repel.attach();
        repel.toOptions({radius: 0}, 1000, () => {
          item.attatchedRepel = null;
          item.acceptRepel = true;
          this._removeRepel(repel);
        });
      }
      if (!this._isBaseItem(item)) {
        const position = this._randomOutsidePosition();
        const tw = new TWEEN.Tween(item)
          .to({
            ...position,
            scaleX: 1,
            scaleY: 1
          }, 1000)
          .onComplete(() => {
            this.removeChild(item);
            item.isBacking = false;
          })
          .easing(TWEEN.Easing.Cubic.Out)
          .start();
      } else {
        const clone = item.clone();
        const index = this.getChildIndex(item);
        const itemViewInfo = item.viewInfo;
        this.addChildAt(clone, index);
        const tw = new TWEEN.Tween(clone)
          .to(itemViewInfo, 1000)
          .onComplete(() => {
            this.removeChild(clone);
            item.isBacking = false;
          })
          .easing(TWEEN.Easing.Cubic.Out)
          .start();
      }
    }

    private _removeRepel(repel: Repel) {
      _.remove(this._repels, repel);
      repel.die();
    }

    private _isBaseItem(item: Item) {
      return _.includes(this._items, item);
    }

    private _randomOutsidePosition(): IPosition {
      const {sceneWidth, sceneHeight} = this.state;
      const rowHeight = this._getRowHeight();
      const direction = Math.random() > 0.5 ? 1 : -1;
      const x = Math.random() * sceneWidth;
      const y = sceneHeight / 2 + (sceneHeight / 2 + rowHeight + rowHeight * Math.random()) * direction;
      return {x, y};
    }

    private _addRepel(item?: Item, x: number = 0, y: number = 0, radius: number = 0, strong: number = 0): Repel {
      let repel = new Repel(x, y, radius, strong);
      item.attatchedRepel = repel;
      this._repels.push(repel);
      if (item) {
        repel.attach(item);
      }
      return repel;
    }

    private _getRowItemY(rowIndex): number {
      let itemHeight = this._getRowHeight();
      return (this.state.padding + itemHeight) * rowIndex + itemHeight / 2 + this.state.padding;
    }

    private _getRepelRadius(): number {
      const shorter = this._getShorterWidth();
      return shorter / 1.7;
    }

    private _getShorterWidth(): number {
      const {sceneWidth, sceneHeight} = this.state;
      const shorter = _.min([sceneWidth, sceneHeight]);
      return shorter;
    }

    private _getLargeItemScale(): number {
      const shorter = this._getShorterWidth();
      const height = shorter * 0.43;
      const itemHeight = this._getRowHeight();
      return height / itemHeight;
    }

    private _getApiImagesCount(api: IApi): number {
      let items = api.result.items;
      let count = 0;
      _.forEach(items, (item) => {
        if (item.imgs) {
          count += item.imgs.length;
        }
      });
      return count;
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
      console.log(11111);
      ajax.getTexture(this._bgImage, {
        onComplete: (texture) => {
          console.log(22222);
          const bgBmp = new egret.Bitmap(texture);
          const {textureWidth, textureHeight} = <egret.Texture>texture;
          bgBmp.x = (this._bgWidth - textureWidth) / 2;
          bgBmp.y = (this._bgHeight - textureHeight) / 2;
          console.log(bgBmp);
          this.addChild(bgBmp);
        }
      });
    }
  }
}
