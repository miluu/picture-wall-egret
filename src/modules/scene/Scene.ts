namespace scene {
  /**
   * @class Scene 场景类
   * @author HuangYaxiong <hyxiong@qq.com>
   */
  export class Scene extends egret.DisplayObjectContainer {
    /**
     * 添加场景中的所有 Item 实例
     */
    private _items: Item[] = [];

    /**
     * extraItem
     */
    private _extraItems: Item[] = [];

    /**
     * 添加到场景中的所有 Repel 实例
     */
    private _repels: Repel[] = [];

    /**
     * swiper对象
     */
    private _swiper: swiper.Swiper;

    /**
     * 文字
     */
    private _text: SceneText;

    /**
     * 场景的背景，包含背景色与背景图片
     */
    private _bg: SceneBg;

    /**
     * 加载进度界面
     */
    private _loadingView: LoadingView;

    /**
     * 详情按钮
     */
    private _detailButton: Button;

    /**
     * 更多按钮
     */
    private _moreButton: Button;

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
      this._createButtons();
      this._loadRes();
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
      this.state.isButtonsShow = false;
      this.state.isExtraButtonsShow = false;
      this._createBg();
      this._createText();
      this._setButtonsPosition();
      this.mask = new egret.Rectangle(0, 0, this.state.sceneWidth, this.state.sceneHeight);

      let loading = this._loadingView = new LoadingView('loading...' , this.state.sceneWidth, this.state.sceneHeight, 0.2);
      loading.x = this.state.sceneWidth / 2;
      loading.y = this.state.sceneHeight / 2;
      this.addChild(loading);

      if (this.state.apiList.length) {
        this.start();
      }
    }

    /**
     * 隐藏 loading 层
     */
    public hideLoading() {
      this._loadingView.text = 'loading';
      this._loadingView.visible = false;
    }

    /**
     * 显示 loading 层
     * @param text {string} 显示的文字内容
     */
    public showLoading(text?: string) {
      let childCount = this.numChildren;
      this.setLoadingText(text || 'loading...');
      this._loadingView.visible = true;
      this.setChildIndex(this._loadingView, childCount);
    }

    /**
     * 设置 loading 层显示的文字内容
     * @param text {string} 文字内容
     */
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
          this._loadSources(data, this._loadedHandle.bind(this));
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
     * 预加载资源
     */
    private _loadRes() {
      RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this._onResLoaded, this);
      RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this._onResLoading, this);
      RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this._onResLoadErr, this);
      RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, function() {
        console.log('config loaded.');
      }, this);
      RES.addEventListener(RES.ResourceEvent.CONFIG_LOAD_ERROR, function() {
        console.log('config load error.');
      }, this);
      RES.loadConfig('resource/default.res.json', 'resource/');
      RES.loadGroup('preload');
      console.log('load start.');
    }

    /**
     * 资源加载完成回调
     */
    private _onResLoaded() {
      console.log('loaded!!!');
      this._moreButton.iconTexture = RES.getRes('star');
      this._detailButton.iconTexture = RES.getRes('info');
    }

    /**
     * 资源加载中回调
     */
    private _onResLoading() {
      console.log('loading');
    }

    /**
     * 资源加载失败回调
     */
    private _onResLoadErr() {
      console.log('load error!!!!!');
    }

    /**
     * 创建详情和更多功能按钮
     */
    private _createButtons() {
      this._detailButton = new Button(25, 0x000000, null, true);
      this._moreButton = new Button(25, 0x000000, null, true);
      this._detailButton.x = 300;
      this._detailButton.y = 100;
      this._moreButton.x = 200;
      this._moreButton.y = 100;
      this._detailButton.onClick = this._showDetail.bind(this);
      this._moreButton.onClick = this._showMore.bind(this);
    }

    /**
     * 设置按钮的位置
     */
    private _setButtonsPosition() {
      const {sceneWidth, sceneHeight} = this.state;
      const largeItemHeight = this._getLargeItemHeight();
      this._moreButton.x = (sceneWidth - largeItemHeight) / 2;
      this._detailButton.x = (sceneWidth + largeItemHeight) / 2;
      this._moreButton.y = this._detailButton.y = (sceneHeight - largeItemHeight) / 2;
    }

    /**
     * 显示按钮
     */
    private _showButtons() {
      this.state.isButtonsShow = true;
      this.addChild(this._detailButton);
      this.addChild(this._moreButton);
      this._detailButton.scaleX
        = this._detailButton.scaleY
        = this._detailButton.alpha
        = this._moreButton.scaleX
        = this._moreButton.scaleY
        = this._moreButton.alpha
        = 0;
      const scaleTo = {scaleX: 1, scaleY: 1, alpha: 1};
      let tw = new TWEEN.Tween(this._moreButton)
        .to(scaleTo, 800)
        .easing(TWEEN.Easing.Back.Out)
        .start();
      let tw2 = new TWEEN.Tween(this._detailButton)
        .delay(200)
        .to(scaleTo, 800)
        .easing(TWEEN.Easing.Back.Out)
        .start();
    }

    /**
     * 隐藏按钮
     */
    private _hideButtons() {
      if (this.state.isButtonsShow) {
        this.removeChild(this._detailButton);
        this.removeChild(this._moreButton);
        this.state.isButtonsShow = false;
      }
    }

    /**
     * 显示详情
     */
    private _showDetail() {
      this._extraItemsLeave();
      if (this.state.isExtraButtonsShow) {
        this._hideExtraButtons(this.state.selectedItem.data.extraItems);
      }
      const {selectedItem} = this.state;
      // TODO
    }

    /**
     * 显示更多功能
     */
    private _showMore() {
      const {selectedItem, isExtraButtonsShow} = this.state;
      const {extraItems} = selectedItem.data;
      this._extraItemsLeave();
      if (isExtraButtonsShow) {
        this._hideExtraButtons(extraItems);
      } else {
        this._showExtraButtons(extraItems);
      }
    }

    /**
     * 显示更多功能扩展按钮
     */
    private _showExtraButtons(extraItems: IApiExtraItem[]) {
      const {x, y} = this._moreButton;
      const moreButtonIndex = this.getChildIndex(this._moreButton);
      const centerPoint = new egret.Point(x, y);
      let btnsCount = extraItems.length;
      this.state.isExtraButtonsShow = true;
      _.forEach(extraItems, (item, index) => {
        let btn: Button = item.button;
        if (!btn) {
          const colorNumber = util.colorStringToNumber(item.bgColor);
          btn = new Button(15, colorNumber, item.texture, false);
          item.button = btn;
          btn.onClick = () => {
          };
        }
        btn.clearTweens();
        btn.y = y;
        btn.x = x;
        if (this.getChildIndex(btn) < 0) {
          this.addChildAt(btn, moreButtonIndex);
        }
        const twObj = btn.twObj || {
          deg: 360 / btnsCount * index,
          radius: 0
        };
        const tw = new TWEEN.Tween(twObj)
          .to({deg: '-360', radius: 60}, 1000)
          .easing(TWEEN.Easing.Cubic.Out)
          .onUpdate(() => {
            const pos = util.cyclePoint(centerPoint, twObj.radius, twObj.deg);
            btn.x = pos.x;
            btn.y = pos.y;
          });
        const tw2 = new TWEEN.Tween(twObj)
          .to({deg: '+360'}, 40000)
          .repeat(Infinity)
          .onUpdate(() => {
            const pos = util.cyclePoint(centerPoint, twObj.radius, twObj.deg);
            btn.x = pos.x;
            btn.y = pos.y;
          });
        tw.chain(tw2);
        tw.start();
        btn.tweens = [tw, tw2];
        btn.twObj = twObj;
        btn.onClick = () => {
          this._createExtraItems(item.itemsUrl);
        };
      });
    }

    /**
     * 创建扩展 items
     * @param url {string} 扩展 items Api 地址
     */
    private _createExtraItems(url: string) {
      this.showLoading();
      this._hideExtraButtons(this.state.selectedItem.data.extraItems);
      this._extraItemsLeave();
      ajax.getJson(url, {
        onError: () => {
          this.setLoadingText('加载失败！');
          setTimeout(() => {
            this.hideLoading();
          }, 1000);
        },
        onComplete: (data) => {
          this.hideLoading();
          const api = <IApi>data;
          this._loadSources(api, (successCount, failedCount, imagesCount, apiItems) => {
            if (successCount + failedCount < imagesCount) {
              return;
            }
            const itemHeight = this._getRowHeight();
            if (this._extraItems) {
              _.forEach(this._extraItems, (item) => {
                this.removeChild(item);
              });
              this._extraItems = [];
            }
            const itemsCount = apiItems.length;
            _.forEach(<IApiItem[]>apiItems, (apiItem, index) => {
              let originSize = {width: apiItem.imgs[0].width, height: apiItem.imgs[0].height};
              let changeSize = util.fixHeight(originSize, itemHeight);
              let texture = apiItem.imgs[0].texture;
              let item = new Item(changeSize.width, changeSize.height, null, texture);
              item.data = apiItem;
              let randomPos = this._randomOutsidePosition();
              item.x = randomPos.x;
              item.y = randomPos.y;
              item.acceptRepel = false;
              item.addEventListener(egret.TouchEvent.TOUCH_TAP, function() {
                item.clearTweens();
                _.remove(this._extraItems, item);
                this._extraItemsLeave();
                this._selectItem(item);
              }, this);
              this._extraItems.push(item);
              this._delayFrames(() => {
                this.addChild(item);
                if (index === itemsCount - 1) {
                  this._extraItemsEnter();
                }
              }, index * 3);
            });
          });
        }
      });
    }

    /**
     * 扩展 item 进入
     */
    private _extraItemsEnter() {
      console.log('extra items enter!!!!!!');
      if (!this._extraItems || !this._extraItems.length) {
        return;
      }
      const {sceneWidth, sceneHeight} = this.state;
      const itemsCount = this._extraItems.length;
      const radius = this._getExtraItemsRadius();
      const centerPoint = new egret.Point(sceneWidth / 2, sceneHeight / 2);
      _.forEach(this._extraItems, (item, index) => {
        const deg = 360 / itemsCount * index;
        const {x, y} = util.cyclePoint(centerPoint, radius, deg);
        let tw = new TWEEN.Tween(item)
          .to({x, y}, 1000)
          .easing(TWEEN.Easing.Cubic.Out)
          .start();
        let twObj = {deg};
        let tw2 = new TWEEN.Tween(twObj)
          .to({deg: '+360'}, 50000)
          .repeat(Infinity)
          .onUpdate(() => {
            const p = util.cyclePoint(centerPoint, radius, twObj.deg);
            item.x = p.x;
            item.y = p.y;
          });
        tw.chain(tw2);
        item.tweens = [tw, tw2];
      });
    }

    /**
     * 扩展 item 离开
     */
    private _extraItemsLeave() {
      const items = this._extraItems;
      this._extraItems = [];
      _.forEach(items, (item) => {
        item.clearTweens();
        this._itemBack(item);
      });
    }

    /**
     * 延迟数帧执行方法
     * @param callback {Function} 回调的方法
     * @param count {number} 延迟的帧数
     */
    private _delayFrames(callback: Function, count: number = 1) {
      let passedFrames = 0;
      this.addEventListener(egret.Event.ENTER_FRAME, onEnterFrame, this);
      function onEnterFrame() {
        passedFrames++;
        if (passedFrames >= count) {
          this.removeEventListener(egret.Event.ENTER_FRAME, onEnterFrame, this);
          callback();
        }
      }
    }

    /**
     * 获取随机一个场景外的位置
     */
    private getRandomOuterPos(center: IPosition): IPosition {
      let pos: IPosition = <IPosition>{};
      let rowHeight = this._getRowHeight();
      let {sceneWidth, sceneHeight} = this.state;
      let onTop = Math.random() > 0.5;
      if (onTop) {
        pos.y = -rowHeight * (1 + Math.random());
      } else {
        pos.y = sceneHeight + rowHeight * (1 + Math.random());
      }
      pos.x = Math.random() * sceneWidth;
      return pos;
    }

    /**
     * 隐藏扩展按钮
     */
    private _hideExtraButtons(extraItems: IApiExtraItem[], animate: boolean = true) {
      if (!this.state.isExtraButtonsShow) {
        return;
      }
      const btnsCount = extraItems.length;
      const {x, y} = this._moreButton;
      const point = new egret.Point(x, y);
      this.state.isExtraButtonsShow = false;
      _.forEach(extraItems, (item, index) => {
        const btn = item.button;
        btn.clearTweens();
        if (animate) {
          const twObj = btn.twObj;
          const twObjOrign = {
            deg: 360 / btnsCount * index,
            radius: 0
          };
          const tw = new TWEEN.Tween(twObj)
            .to(twObjOrign, 1000)
            .easing(TWEEN.Easing.Cubic.Out)
            .start()
            .onUpdate(() => {
              const pos = util.cyclePoint(point, twObj.radius, twObj.deg);
              btn.x = pos.x;
              btn.y = pos.y;
            })
            .onComplete(() => {
              this.removeChild(btn);
            });
          btn.tweens = [tw];
          btn.twObj = twObj;
        } else {
          btn.twObj = null;
          btn.tweens = [];
          this.removeChild(btn);
        }
      });
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
     * 加载所有图片资源
     * @param data {IApi} api数据
     */
    private _loadSources(data: IApi, callback: Function) {
      let imagesCount = this._getApiImagesCount(data);
      let successCount = 0;
      let failedCount = 0;
      const apiItems = data.result.items;
      _.forEach(apiItems, (item) => {
        _.forEach(item.extraItems, (extraItem) => {
          ajax.getTexture(extraItem.icon, {
            onComplete: (texture) => {
              successCount++;
              extraItem.texture = texture;
              if (callback) {
                callback(successCount, failedCount, imagesCount, apiItems);
              }
            },
            onError: () => {
              failedCount++;
              if (callback) {
                callback(successCount, failedCount, imagesCount, apiItems);
              }
            }
          });
        });
        _.forEach(item.imgs, (img) => {
          ajax.getTexture(img.url, {
            onComplete: (texture) => {
              successCount++;
              img.texture = texture;
              if (callback) {
                callback(successCount, failedCount, imagesCount, apiItems);
              }
            },
            onError: () => {
              failedCount++;
              if (callback) {
                callback(successCount, failedCount, imagesCount, apiItems);
              }
            }
          });
        });
      });
    }

    /**
     * 所有 items 的图像资源加载后执行的方法
     * @param successCount {number} 加载成功的数量
     * @param failedCount {number} 加载失败的数量
     * @param imagesCount {number} 总共需要加载的数量
     * @param apiItem {IApiItem[]} items api 数据对象
     */
    private _loadedHandle(successCount: number, failedCount: number, imagesCount: number, apiItems: IApiItem[]) {
      this._loadingView.text = `loading...\n${successCount + failedCount} / ${imagesCount}`;
      if (successCount + failedCount === imagesCount) {
        this.hideLoading();
        this._createItems(apiItems);
        this._delayFrames(() => {
          this._run();
          this._enter();
        }, 10);
      }
    }

    /**
     * 触摸屏幕时的回调方法，更新 lastOperateTime
     */
    private _touchScene() {
      this.state.lastOperateTime = new Date();
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

    /**
     * 判断 item 否在场景左侧，可设置偏移范围
     * @param {Item}
     * @param rangeOffset {number} 偏移范围
     * @return {boolean}
     */
    private _itemOutOfSceneLeftSide(item: Item, rangeOffset: number = 50): boolean {
      let {x} = this._getItemPositionWithOffset(item);
      x = x + item.width / 2;
      return this._outOfSceneLeftSide(x, rangeOffset);
    }

    /**
     * 判断 x 值是否在场景右侧，可设置偏移范围
     * @param x {number} x 坐标值
     * @param rangeOffset {number} 偏移范围
     * @return {boolean}
     */
    private _outOfSceneRightSide(x: number, rangeOffset: number = 50): boolean {
      return x > this.state.sceneWidth + rangeOffset;
    }

    /**
     * 判断 item 否在场景右侧，可设置偏移范围
     * @param {Item}
     * @param rangeOffset {number} 偏移范围
     * @return {boolean}
     */
    private _itemOutOfSceneRightSide(item: Item, rangeOffset: number = 50): boolean {
      let {x} = this._getItemPositionWithOffset(item);
      x = x - item.width / 2;
      return this._outOfSceneRightSide(x, rangeOffset);
    }

    /**
     * 运行场景动画
     */
    private _run() {
      this.addEventListener(egret.Event.ENTER_FRAME, this._onEnterFrame, this);
    }

    /**
     * 入场
     */
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

    /**
     * 离场
     */
    private _leave() {
      this.state.status = SCENE_STATUS.LEAVE;
      let leaveDirection = Math.random() > 0.5 ? 1 : -1;
      let itemsCount = this._items.length;
      let done = 0;
      this._extraItemsLeave();
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

    /**
     * ENTER_FRAME 事件回调方法，主要设置动画
     */
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

    /**
     * 判断当前时间与最后操作时间，间隔超过自动恢复时间则恢复场景状态
     */
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
        this._resetItem(selectedItem);
      }
    }

    /**
     * 创建文字
     */
    private _createText() {
      const {sceneHeight, sceneWidth, padding} = this.state;
      this._text = new SceneText(sceneHeight, this._getLargeItemHeight(), padding);
      this._text.x = Math.round(sceneWidth / 2);
      this._text.y = Math.round(sceneHeight / 2);
    }

    /**
     * 创建场景背景
     */
    private _createBg() {
      if (this._bg) {
        this.removeChild(this._bg);
      }
      this._bg = new SceneBg(this.state.sceneWidth, this.state.sceneHeight, this.state.bgColor, this.state.bgImage);
      this.addChild(this._bg);
      this._bg.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this._touchBg, this);
    }

    /**
     * 触摸背景时的回调方法
     */
    private _touchBg() {
      const {selectedItem} = this.state;
      if (selectedItem) {
        this._hideExtraButtons(selectedItem.data.extraItems);
        this._extraItemsLeave();
      }
    }

    /**
     * 触摸 swiper 时的回调方法
     */
    private _touchSwiper() {
      const {selectedItem} = this.state;
      if (selectedItem) {
        this._hideExtraButtons(selectedItem.data.extraItems);
        this._extraItemsLeave();
      }
    }


    /**
     * 创建场景 items
     * @parame apiItems {IApiItem[]} apiItem数组
     */
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
        if (this._itemOutOfSceneRightSide(item, 50)) {
          item.visible = false;
        }
        this.addChild(item);
      });

      function getMinWidthRowIndex(): number {
        let minWidth = _.min(state.rowWidthList);
        let index = _.findIndex(state.rowWidthList, width => width === minWidth);
        return index;
      }
    }

    /**
     * 判断当前场景是否可点击选择 item
     * @return {boolean}
     */
    private _canSelectItem(): boolean {
      return this.state.status === SCENE_STATUS.ENTER
        || this.state.status === SCENE_STATUS.RUNNING;
    }

    /**
     * 选中 item
     */
    private _selectItem(item: Item) {
      if (!this._canSelectItem()
        || this.state.selectedItem === item
        || item.isBacking
      ) {
        return;
      }
      if (this.state.selectedItem) {
        this._resetItem(this.state.selectedItem);
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
        }, 1500)
        .onComplete(() => {
          this._showSwiper(item);
        });
      tw1.chain(tw2);
      item.tweens.push(tw1, tw2);
    }

    /**
     * @private 展示 item 的 swiper
     * @param item {Item}
     */
    private _showSwiper(item: Item) {
      const height = this._getLargeItemHeight();
      this._swiper = new swiper.Swiper({
        viewWidth: height * 2,
        viewHeight: height,
        slideWidth: height,
        slideHeight: height,
        radius: height * 0.6,
        effect: swiper.SWIPER_EFFECT.CARROUSEL,
        backTime: 500
      });
      this._swiper.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this._touchSwiper, this);
      let textures = _.map(item.data.imgs, (img) => {
        let texture = img.texture;
        let slide = new swiper.Slide(height, height, texture);
        this._swiper.addSlide(slide);
      });
      const {sceneWidth, sceneHeight} = this.state;
      this._swiper.x = sceneWidth / 2;
      this._swiper.y = sceneHeight / 2;
      this._swiper.alpha = 0;
      this.addChild(this._swiper);
      let tw = new TWEEN.Tween(this._swiper)
        .to({alpha: 1}, 400)
        .start()
        .onComplete(() => {
          item.visible = false;
          this._showButtons();
        });
      this._swiper.tween = tw;
      this._showText(item);
    }

    /**
     * 显示文字
     * @param item {Item} 对应的 item
     */
    private _showText(item: Item) {
      const {brand, title, price, description} = item.data;
      const options: ITextOptions = {brand, title, price, description};
      this._text.setText(options);
      this.addChild(this._text);
    }

    /**
     * 隐藏文字
     */
    private _hideText() {
      console.log(1111);
      this.removeChild(this._text);
    }


    /**
     * item 复位，若 item 不在场景 items 列表内，则移到场景外随机位置并移除
     * @param item {Item}
     */
    private _resetItem(item: Item) {
      let repel = item.attatchedRepel;
      this.state.selectedItem = null;
      let _swiper = this._swiper;
      this._hideButtons();
      this._extraItemsLeave();
      if (this.state.isExtraButtonsShow) {
        this._hideExtraButtons(item.data.extraItems, false);
      }
      if (_swiper) {
        this._swiper = null;
        this._hideText();
        if (_swiper.tween) {
          _swiper.tween.stop();
        }
        let tw = new TWEEN.Tween(_swiper)
          .to({
            alpha: 0,
            scaleX: 0,
            scaleY: 0
          }, 200)
          .start()
          .onComplete(() => {
            this.removeChild(_swiper);
            _swiper = null;
          });
      }
      this._itemBack(item);
      if (repel) {
        repel.attach();
        repel.toOptions({radius: 0}, 1000, () => {
          item.attatchedRepel = null;
          item.acceptRepel = true;
          this._removeRepel(repel);
        });
      }
    }

    /**
     * @private item 返回原位或离开场景
     * @param item {Item}
     */
    private _itemBack(item) {
      item.visible = true;
      item.isBacking = true;
      item.clearTweens();
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

    /**
     * 移除 repel
     * @param repel {Repel}
     */
    private _removeRepel(repel: Repel) {
      _.remove(this._repels, repel);
      repel.die();
    }

    /**
     * 判断 item 是否在场景 items 列表内
     * @param item {Item}
     * @return {boolean}
     */
    private _isBaseItem(item: Item): boolean {
      return _.includes(this._items, item);
    }

    /**
     * 获取场景外部的一个随机位置
     * @return {IPosition}
     */
    private _randomOutsidePosition(): IPosition {
      const {sceneWidth, sceneHeight} = this.state;
      const rowHeight = this._getRowHeight();
      const direction = Math.random() > 0.5 ? 1 : -1;
      const x = Math.random() * sceneWidth;
      const y = sceneHeight / 2 + (sceneHeight / 2 + rowHeight + rowHeight * Math.random()) * direction;
      return {x, y};
    }

    /**
     * 添加 repel 到场景
     * @param item {Item} repel 要附加在该 item 上
     * @param x {number} x 坐标值
     * @param y {number} y 坐标值
     * @param radius {number} 作用半径
     * @param strong {number} 强度
     * @return {Repel} 添加的 repel 对象
     */
    private _addRepel(item?: Item, x: number = 0, y: number = 0, radius: number = 0, strong: number = 0): Repel {
      let repel = new Repel(x, y, radius, strong);
      item.attatchedRepel = repel;
      this._repels.push(repel);
      if (item) {
        repel.attach(item);
      }
      return repel;
    }

    /**
     * 获取某一行的 item 的 y 坐标值
     * @param rowIndex {number} 行号
     * @return {number} y 坐标值
     */
    private _getRowItemY(rowIndex: number): number {
      let itemHeight = this._getRowHeight();
      return (this.state.padding + itemHeight) * rowIndex + itemHeight / 2 + this.state.padding;
    }

    /**
     * 获取选中某个 item 后最终的 repel 作用半径
     * @return {number}
     */
    private _getRepelRadius(): number {
      const shorter = this._getShorterWidth();
      return shorter / 1.7;
    }

    /**
     * 获取扩展 items 旋转的半径大小
     * @return {number}
     */
    private _getExtraItemsRadius(): number {
      const shorter = this._getShorterWidth();
      const rowHeight = this._getRowHeight();
      return (shorter - rowHeight) / 2 - this.state.padding;
    }

    /**
     * 获取场景的较短边
     * @return {number}
     */
    private _getShorterWidth(): number {
      const {sceneWidth, sceneHeight} = this.state;
      const shorter = _.min([sceneWidth, sceneHeight]);
      return shorter;
    }

    /**
     * @private 获取 item 选中后的大图调试
     * @return {number}
     */
    private _getLargeItemHeight(): number {
      const shorter = this._getShorterWidth();
      const height = shorter * 0.43;
      return height;
    }

    /**
     * 获取 item 选中后的大图缩放比例
     * @return {number}
     */
    private _getLargeItemScale(): number {
      const height = this._getLargeItemHeight();
      const itemHeight = this._getRowHeight();
      return height / itemHeight;
    }

    /**
     * 获取 api 中的图片数量
     * @param api {IApi}
     * @return {number}
     */
    private _getApiImagesCount(api: IApi): number {
      let items = api.result.items;
      let count = 0;
      _.forEach(items, (item) => {
        if (item.imgs) {
          count += item.imgs.length;
        }
        if (item.extraItems) {
          count += item.extraItems.length;
        }
      });
      return count;
    }

  }

  /**
   * @class 场景背景类
   */
  class SceneBg extends egret.DisplayObjectContainer {
    /**
     * 背景宽度
     */
    private _bgWidth: number;
    /**
     * 背景高度
     */
    private _bgHeight: number;
    /**
     * 背景颜色
     */
    private _bgColor: number;
    /**
     * 背景图片 url
     */
    private _bgImage: string;

    /**
     * @constructor 创建场景背景实例
     * @param width {number} 背景宽度
     * @param height {number} 背景高度
     * @param bgColor {number} 背景色
     * @param bgImage {string} 背景图 url
     */
    constructor(width: number, height: number, bgColor: number = 0x000000, bgImage?: string) {
      super();
      this._bgWidth = width;
      this._bgHeight = height;
      this._bgColor = bgColor;
      this._bgImage = bgImage;

      this._createBgColor();
      this._createBgImage();
      this.touchEnabled = true;
    }

    /**
     * 创建背景色
     */
    private _createBgColor() {
      const shp = new egret.Shape();
      const g = shp.graphics;
      g.beginFill(this._bgColor);
      g.drawRect(0, 0, this._bgWidth, this._bgHeight);
      g.endFill();
      this.addChild(shp);
    }

    /**
     * 创建背景图
     */
    private _createBgImage() {
      ajax.getTexture(this._bgImage, {
        onComplete: (texture) => {
          const bgBmp = new egret.Bitmap(texture);
          const {textureWidth, textureHeight} = <egret.Texture>texture;
          bgBmp.x = (this._bgWidth - textureWidth) / 2;
          bgBmp.y = (this._bgHeight - textureHeight) / 2;
          this.addChild(bgBmp);
        }
      });
    }
  }

  interface ITextOptions {
    brand: string;
    title: string;
    price: number;
    description: string;
  };
  /**
   * @class 场景文字类
   */
  const TEXT_RATIO = {
    BRAND: 0.22,
    TITLE: 0.12,
    PRICE: 0.1,
    DESCRIPTION: 0.1
  };
  class SceneText extends egret.DisplayObjectContainer {
    private _brand: egret.TextField = new egret.TextField();
    private _title: egret.TextField = new egret.TextField();
    private _price: egret.TextField = new egret.TextField();
    private _description: egret.TextField = new egret.TextField();
    private _textWidth: number;
    private _itemHeight: number;
    private _blockHeight: number;
    constructor(sceneHeight: number, itemHeight: number, scenePadding: number) {
      super();
      this._init(sceneHeight, itemHeight, scenePadding);
    }
    public setText(options: ITextOptions) {
      this._brand.text = options.brand;
      this._title.text = options.title;
      this._price.text = `￥${options.price.toFixed(2)}`;
      this._description.text = options.description;
    }
    private _init(sceneHeight: number, itemHeight: number, scenePadding: number) {
      this._itemHeight = itemHeight;
      this._textWidth = Math.round(itemHeight);
      this._blockHeight = (sceneHeight - itemHeight) / 2 - scenePadding * 2;
      this._brand.width = this._textWidth;
      this._title.width = this._textWidth;
      this._price.width = this._textWidth;
      this._description.width = this._textWidth;
      this._brand.textColor = 0x000000;
      this._title.textColor = 0x000000;
      this._price.textColor = 0x000000;
      this._description.textColor = 0x000000;
      this._brand.textAlign = egret.HorizontalAlign.CENTER;
      this._title.textAlign = egret.HorizontalAlign.CENTER;
      this._price.textAlign = egret.HorizontalAlign.CENTER;
      this._description.textAlign = egret.HorizontalAlign.CENTER;
      this._brand.height = this._brand.size = Math.round(this._blockHeight * TEXT_RATIO.BRAND);
      this._brand.y = Math.round(-itemHeight / 2 - 0.45 * this._blockHeight);
      this._brand.x = Math.round(-this._textWidth / 2);
      this._brand.bold = true;
      this._brand.multiline = false;
      this._title.height = this._title.size = Math.round(this._blockHeight * TEXT_RATIO.TITLE);
      this._title.y = Math.round(itemHeight / 2 + this._blockHeight * 0.1);
      this._title.x = Math.round(-this._textWidth / 2);
      this._title.bold = true;
      this._title.multiline = false;
      this._price.height = this._price.size = Math.round(this._blockHeight * TEXT_RATIO.PRICE);
      this._price.y = Math.round(itemHeight / 2 + this._blockHeight * 0.3);
      this._price.x = Math.round(-this._textWidth / 2);
      this._price.multiline = false;
      this._description.size = Math.round(this._blockHeight * TEXT_RATIO.DESCRIPTION);
      this._description.y = Math.round(itemHeight / 2 + this._blockHeight * 0.48);
      this._description.x = Math.round(-this._textWidth / 2);
      this._description.lineSpacing = this._description.size * 0.3;
      this._description.height = (this._description.lineSpacing + this._description.size) * 3;
      this.addChild(this._brand);
      this.addChild(this._title);
      this.addChild(this._price);
      this.addChild(this._description);
    }
  }
}
