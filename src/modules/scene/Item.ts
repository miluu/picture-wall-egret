namespace scene {
  export class Item extends egret.DisplayObjectContainer {
    static instanceCount = 0;

    private _itemWidth: number;
    private _itemHeight: number;
    private _bgColor: number;
    private _texture: egret.Texture;
    private _bg: egret.Shape = new egret.Shape();
    private _iamge: egret.Bitmap;
    private _itemKey: number;
    public basePosition: egret.Point = new egret.Point(0, 0);
    public rowIndex: number;
    public acceptRepel: boolean = false;
    public attatchedRepel: Repel;
    public isBacking: boolean = false;
    public data: IApiItem;

    constructor(itemWidth: number, itemHeight: number, bgColor?: number, texture?: egret.Texture) {
      super();
      this.touchEnabled = true;
      this._itemWidth = itemWidth;
      this._itemHeight = itemHeight;
      this._bgColor = bgColor || 0xdddddd;
      this._texture = texture;
      Item.instanceCount++;
      this._init();
    }
    private _init() {
      this._addBg();
      this._addImage();
      this._addKey();
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
        this._iamge = new egret.Bitmap(this._texture);
        this._iamge.width = this._itemWidth;
        this._iamge.height = this._itemHeight;
        this._iamge.anchorOffsetX = this._itemWidth / 2;
        this._iamge.anchorOffsetY = this._itemHeight / 2;
        this.addChild(this._iamge);
      }
    }
    private _addKey() {
      this._itemKey = Item.instanceCount++;
    }
  }
}
