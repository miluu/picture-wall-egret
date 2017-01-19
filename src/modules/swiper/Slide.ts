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

    constructor(width: number, height: number, texture: egret.Texture, debugKey?: number) {
      super();
      this._slideWidth = width;
      this._slideHeight = height;
      this._texture = texture;

      this._init();
      if (_.isNumber(debugKey)) {
        this._addIndex(debugKey);
      }
      Slide._slideCount++;
    }

    public get isClone() {
      return !!this._isClone;
    }

    public clone(): Slide {
      const clone = new Slide(this._slideWidth, this._slideHeight, this._texture);
      clone._isClone = true;
      return clone;
    }

    private _init() {
      this._setSlideKey();
      this._addBg();
      this._addImage();
    }

    private _addBg() {
      this._bg = new egret.Shape();
      const g = this._bg.graphics;
      g.beginFill(0xdddddd);
      g.drawRect(-this._slideWidth / 2, -this._slideHeight / 2, this._slideWidth, this._slideHeight);
      g.endFill();
      this.addChild(this._bg);
    }

    private _addImage() {
      if (this._texture) {
        const {textureWidth, textureHeight} = this._texture;
        this._image = new egret.Bitmap(this._texture);
        this._image.x = -textureWidth / 2;
        this._image.y = -textureHeight / 2;
        this.addChild(this._image);
      }
    }

    private _setSlideKey() {
      this._slideKey = Slide._slideCount;
    }

    private _addIndex(debugKey: number) {
      this._key = debugKey;
      let keyText = new egret.TextField();
      keyText.text = debugKey.toString();
      keyText.width = this._slideWidth;
      keyText.height = this._slideHeight;
      keyText.x = this._slideWidth / 2;
      keyText.y = this._slideHeight / 2;
      keyText.textAlign = egret.HorizontalAlign.CENTER;
      keyText.verticalAlign = egret.VerticalAlign.MIDDLE;
      this.addChild(keyText);
    }
  }
}
