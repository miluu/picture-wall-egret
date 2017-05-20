namespace scene {
  /**
   * @class Item
   * @author HuangYaxiong <hyxiong@qq.com>
   */
  export class Item extends egret.DisplayObjectContainer {
    /**
     * @private
     * @static 创建过的实例数量
     */
    private static instanceCount = 0;

    /**
     * @private item 宽度
     */
    private _itemWidth: number;
    /**
     * @private item 高度
     */
    private _itemHeight: number;
    /**
     * @private 背景色
     */
    private _bgColor: number;
    /**
     * @private 背景图 Texture
     */
    private _texture: egret.Texture;
    /**
     * @private 背景色 Shape 对象
     */
    private _bg: egret.Shape = new egret.Shape();
    /**
     * @private 背景图 Bitmap 对象
     */
    private _image: egret.Bitmap;
    /**
     * @private itemKey 标记
     */
    private _itemKey: number;
    /**
     * @private 是否是克隆出来的对象
     */
    private _isClone: boolean;
    /**
     * @private item 的基本视图数据
     */
    private _viewInfo: IItemViewInfo = {};
    /**
     * @public 基准位置，未计算场景 offset 与 repel 造成的偏移
     */
    public basePosition: egret.Point = new egret.Point(0, 0);
    /**
     * @public 行号
     */
    public rowIndex: number;
    /**
     * @public 是否接受 repel 作用
     */
    public acceptRepel: boolean = false;
    /**
     * @public 附加在其上的 repel 对象
     */
    public attatchedRepel: Repel;
    /**
     * @public 作用在其上的 tweens 对象
     */
    public tweens: TWEEN.Tween[] = [];
    /**
     * @public 是否处在归位的过程中
     */
    public isBacking: boolean = false;
    /**
     * @public 对应的 api 数据
     */
    public data: IApiItem;

    /**
     * @public 角标 Shape
     */
    public flagImg: egret.Bitmap;

    /**
     * @constructor
     * @param itemWidth {number} 宽度
     * @param itemHeight {number} 高度
     * @param bgColor {number} 背景色
     * @param texture {egret.Texture} 图片的 texture 对象
     */
    constructor(itemWidth: number, itemHeight: number, bgColor: number = 0xdddddd, texture?: egret.Texture) {
      super();
      Item.instanceCount++;
      this.touchEnabled = true;
      this._itemWidth = itemWidth;
      this._itemHeight = itemHeight;
      this._bgColor = bgColor;
      this._texture = texture;
      this._init();
    }

    /**
     * @get 获取 item 宽度
     * @return {number}
     */
    get itemWidth(): number {
      return this._itemWidth;
    }
    /**
     * @get 获取 item 高度
     * @return {number}
     */
    get itemHeight(): number {
      return this._itemHeight;
    }
    /**
     * @get 获取 item 是否为克隆对象
     * @return {boolean}
     */
    get isClone(): boolean {
      return this._isClone || false;
    }
    /**
     * @get 获取 item 视图数据
     * @return {IItemViewInfo}
     */
    get viewInfo(): IItemViewInfo {
      return this._viewInfo;
    }

    /**
     * @public 添加角标
     */
    public addFlag(texture: egret.Texture, position?: 'TL' | 'TR' | 'BL' | 'BR') {
      console.log('addflag....');
      let {itemWidth, itemHeight} = this;
      let width = texture.textureWidth;
      let height = texture.textureHeight;
      let x: number, y: number;
      this.flagImg = new egret.Bitmap(texture);
      this.flagImg.anchorOffsetX = width / 2;
      this.flagImg.anchorOffsetY = height / 2;
      switch (position ? position.toUpperCase() : '') {
        case 'TL':
          x = -itemWidth / 2;
          y = -itemHeight / 2;
          break;
        case 'BL':
          x = -itemWidth / 2;
          y = itemHeight / 2;
          break;
        case 'BR':
          x = itemWidth / 2;
          y = itemHeight / 2;
          break;
        default:
          x = itemWidth / 2;
          y = -itemHeight / 2;
          break;
      }
      this.flagImg.x = x;
      this.flagImg.y = y;
      this.addChild(this.flagImg);
    }

    /**
     * @public 清除所有作用在其上的 Tween 是否为克隆对象
     */
    public clearTweens() {
      _.forEach(this.tweens, (tween) => {
        TWEEN.remove(tween);
      });
      this.tweens.length = 0;
    }

    /**
     * @public 返回一个当前 item 的克隆对象
     * @return {Item}
     */
    public clone(): Item {
      const clone = new Item(this._itemWidth, this._itemHeight, this._bgColor, this._texture);
      clone._isClone = true;
      clone.basePosition = this.basePosition.clone();
      clone.rowIndex = this.rowIndex;
      clone.acceptRepel = this.acceptRepel;
      clone.isBacking = this.isBacking;
      clone.data = this.data;
      clone.x = this.x;
      clone.y = this.y;
      clone.alpha = this.alpha;
      clone.scaleX = this.scaleX;
      clone.scaleY = this.scaleY;
      return clone;
    }

    /**
     * @private 初始化 item
     */
    private _init() {
      // this._addBg();
      this._addImage();
      this._addKey();
      this.addEventListener(egret.Event.ENTER_FRAME, this._updateViewInfo, this);
    }

    /**
     * @private 创建背景色
     */
    private _addBg() {
      const g = this._bg.graphics;
      g.beginFill(this._bgColor);
      g.drawRect(-this._itemWidth / 2, -this._itemHeight / 2, this._itemWidth, this._itemHeight);
      g.endFill();
      this.addChild(this._bg);
    }

    /**
     * @private 创建图片
     */
    private _addImage() {
      if (this._texture) {
        this._image = new egret.Bitmap(this._texture);
        this._image.width = this._itemWidth;
        this._image.height = this._itemHeight;
        this._image.anchorOffsetX = this._itemWidth / 2;
        this._image.anchorOffsetY = this._itemHeight / 2;
        this.addChild(this._image);
      }
    }

    /**
     * @private 添加 itemKey
     */
    private _addKey() {
      this._itemKey = Item.instanceCount;
    }

    /**
     * @private 更新 item 视图信息
     */
    private _updateViewInfo() {
      if (!this.isBacking && !this.isClone) {
        return;
      }
      this._viewInfo.x = this.x;
      this._viewInfo.y = this.y;
      this._viewInfo.scaleX = this.scaleX;
      this._viewInfo.scaleY = this.scaleY;
      this._viewInfo.alpha = this.alpha;
      this._viewInfo.rotation = this.rotation;
    }
  }
}
