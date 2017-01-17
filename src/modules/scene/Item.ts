namespace scene {
  interface IItemViewInfo {
    x?: number;
    y?: number;
    scaleX?: number;
    scaleY?: number;
    alpha?: number;
    rotation?: number;
  };

  export class Item extends egret.DisplayObjectContainer {
    static instanceCount = 0;

    private _itemWidth: number;
    private _itemHeight: number;
    private _bgColor: number;
    private _texture: egret.Texture;
    private _bg: egret.Shape = new egret.Shape();
    private _image: egret.Bitmap;
    private _itemKey: number;
    private _isClone: boolean;
    private _viewInfo: IItemViewInfo = {};
    public basePosition: egret.Point = new egret.Point(0, 0);
    public rowIndex: number;
    public acceptRepel: boolean = false;
    public attatchedRepel: Repel;
    public tweens: TWEEN.Tween[] = [];
    public isBacking: boolean = false;
    public data: IApiItem;

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
    get itemWidth() {
      return this._itemWidth;
    }
    get itemHeight() {
      return this._itemHeight;
    }
    get isClone() {
      return this._isClone || false;
    }
    get viewInfo() {
      return this._viewInfo;
    }
    public clearTweens() {
      _.forEach(this.tweens, (tween) => {
        TWEEN.remove(tween);
      });
      this.tweens.length = 0;
    }
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
    private _init() {
      this._addBg();
      this._addImage();
      this._addKey();
      this.addEventListener(egret.Event.ENTER_FRAME, this._updateViewInfo, this);
    }
    private _addBg() {
      const g = this._bg.graphics;
      g.beginFill(this._bgColor);
      g.drawRect(-this._itemWidth / 2, -this._itemHeight / 2, this._itemWidth, this._itemHeight);
      g.endFill();
      this.addChild(this._bg);
    }
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
    private _addKey() {
      this._itemKey = Item.instanceCount;
    }
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
