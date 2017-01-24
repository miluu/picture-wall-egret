namespace swiper {

  /**
   * @class Slide
   * @author HuangYaxiong <hyxiong@qq.com>
   */
  export class Slide extends egret.DisplayObjectContainer {
    /**
     * @private
     * @static
     * slide 实例数量
     */
    private static _slideCount: number;

    /**
     * @private 是否是克隆出来的 slide
     */
    private _isClone: boolean;
    /**
     * @private 背景 Shape 对象
     */
    private _bg: egret.Shape;
    /**
     * @private 图片 Bitmap 对象
     */
    private _image: egret.Bitmap;
    /**
     * @private 图片纹理 Texture 对象
     */
    private _texture: egret.Texture;
    /**
     * @private slide 宽度
     */
    private _slideWidth: number;
    /**
     * @private Slide 高度
     */
    private _slideHeight: number;
    /**
     * @private key 标识
     */
    private _slideKey: number;
    /**
     * @public z 值
     */
    public z: number;

    /**
     * @constructor
     * @param width {number} slide 宽度
     * @param height {number} slide 高度
     * @param texture {egret.Texture} 图片纹理 Texture 对象
     */
    constructor(width: number, height: number, texture: egret.Texture) {
      super();
      this._slideWidth = width;
      this._slideHeight = height;
      this._texture = texture;
      this.touchEnabled = true;
      this._init();
      Slide._slideCount++;
    }

    /**
     * @public
     * @get 是否是克隆出来的
     * @return {boolean}
     */
    public get isClone(): boolean {
      return !!this._isClone;
    }

    /**
     * @public 生成一个克隆对象
     * @return {Slide}
     */
    public clone(): Slide {
      const clone = new Slide(this._slideWidth, this._slideHeight, this._texture);
      clone._isClone = true;
      return clone;
    }

    /**
     * @private 初始化
     */
    private _init() {
      this._setSlideKey();
      if (!this._texture) {
        this._addBg();
      }
      this._addImage();
    }

    /**
     * @private 添加背景
     */
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

    /**
     * @private 添加图片
     */
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

    /**
     * @private 设置 key 标识
     */
    private _setSlideKey() {
      this._slideKey = Slide._slideCount;
    }
  }
}
