namespace swiper {

  export class Slide extends egret.DisplayObjectContainer {
    private static _slideCount: number;

    private _isClone: boolean;
    private _bg: egret.Shape;
    private _image: egret.Bitmap;
    private _texture: egret.Texture;
    private _slideWidth: number;
    private _slideHeight: number;
    private _slideKey: number;
    private _key: number;
    private _keyText: egret.TextField;
    private _debugKey: number;
    public z: number;

    constructor(width: number, height: number, texture: egret.Texture, debugKey?: number) {
      super();
      this._slideWidth = width;
      this._slideHeight = height;
      this._texture = texture;
      this._debugKey = debugKey;
      this.touchEnabled = true;
      this._init();
      if (_.isNumber(this._debugKey)) {
        this._addIndex(debugKey);
      }
      Slide._slideCount++;
    }

    public get isClone() {
      return !!this._isClone;
    }

    public clone(): Slide {
      const clone = new Slide(this._slideWidth, this._slideHeight, this._texture, this._debugKey);
      clone._isClone = true;
      if (clone._keyText) {
        clone._keyText.textColor = 0xffff00;
      }
      return clone;
    }

    private _init() {
      this._setSlideKey();
      if (!this._texture) {
        this._addBg();
      }
      this._addImage();
    }

    private _addBg() {
      this._bg = new egret.Shape();
      const g = this._bg.graphics;
      g.lineStyle(1, 0x999999);
      g.beginFill(0xeeeeee);
      g.drawRect(0, 0, this._slideWidth, this._slideHeight);
      g.endFill();
      this._bg.x = -this._slideWidth / 2;
      this._bg.y = -this._slideHeight / 2;
      this.addChild(this._bg);
    }

    private _addImage() {
      if (this._texture) {
        const {textureWidth, textureHeight} = this._texture;
        const height = this._slideHeight;
        const {width} = util.fixHeight({
          width: textureWidth,
          height: textureHeight
        }, height);
        this._image = new egret.Bitmap(this._texture);
        this._image.width = width;
        this._image.height = height;
        this._image.x = -width / 2;
        this._image.y = -height / 2;
        this.addChild(this._image);
      }
    }

    private _setSlideKey() {
      this._slideKey = Slide._slideCount;
    }

    private _addIndex(debugKey: number) {
      this._key = debugKey;
      this._keyText = new egret.TextField();
      this._keyText.text = debugKey.toString();
      this._keyText.width = this._slideWidth;
      this._keyText.height = this._slideHeight;
      this._keyText.x = -this._slideWidth / 2;
      this._keyText.y = -this._slideHeight / 2;
      this._keyText.textColor = 0xff0000;
      this._keyText.textAlign = egret.HorizontalAlign.CENTER;
      this._keyText.verticalAlign = egret.VerticalAlign.MIDDLE;
      this.addChild(this._keyText);
    }
  }
}
