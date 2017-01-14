namespace scene {
  export class Item extends egret.DisplayObjectContainer {
    static instanceCount = 0;

    private _itemWidth: number;
    private _itemHeight: number;
    private _bgColor: number;
    private _bg: egret.Shape = new egret.Shape();
    public basePosition: egret.Point = new egret.Point(0, 0);
    constructor(itemWidth: number, itemHeight: number, bgColor?: number) {
      super();
      this._itemWidth = itemWidth;
      this._itemHeight = itemHeight;
      this._bgColor = bgColor || 0xdddddd;
      Item.instanceCount++;
      this._init();
    }
    private _init() {
      this._addBg();
      this._addIndex();
    }
    private _addBg() {
      const g = this._bg.graphics;
      g.beginFill(this._bgColor);
      g.drawRect(-this._itemWidth / 2, -this._itemHeight / 2, this._itemWidth, this._itemHeight);
      g.endFill();
      this.addChild(this._bg);
    }
    private _addIndex() {
      const text = new egret.TextField();
      text.text = Item.instanceCount.toString();
      text.size = 12;
      text.textColor = 0x000000;
      this.addChild(text);
    }
  }
}
