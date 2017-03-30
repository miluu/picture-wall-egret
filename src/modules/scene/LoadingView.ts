namespace scene {
  /**
   * @class LoadingView 加载进度类
   * @author HuangYaxiong <hyxiong@qq.com>
   */
  export class LoadingView extends egret.DisplayObjectContainer {
    /**
     * 视图宽度
     */
    private _viewWidth: number;
    /**
     * 视图高度
     */
    private _viewHeight: number;
    /**
     * 显示文字内容
     */
    private _text: string;
    /**
     * 遮罩 Shape 对象
     */
    private _mask: egret.Shape;
    /**
     * 文字对象
     */
    private _textField: egret.TextField;

    /**
     * @constructor 创建一个 LoadingView 实例
     * @param text {string} 显示文字内容
     * @param viewWidth {number} 视图宽度
     * @param viewHeight {number} 视图高度
     * @param alpha {npublic} 遮罩透明度
     */
    constructor(text: string, viewWidth: number = 100, viewHeight: number = 50, alpha: number = 0.1) {
      super();
      this._text = text;
      this._viewWidth = viewWidth;
      this._viewHeight = viewHeight;
      this._init();
      this.alpha = alpha;
    }

    /**
     * @set 设置显示的文字内容
     * @param text {stirng}
     */
    public set text(text: string) {
      this._text = text;
      this._textField.text = text;
    }
    /**
     * @get 获取显示的文字内容
     * @return {string}
     */
    public get text(): string {
      return this._text;
    }

    /**
     * @set 设置显示的文字尺寸
     * @param size {number}
     */
    public set fontSize(size: number) {
      this._textField.size = size;
    }
    /**
     * @get 获取显示的文字尺寸
     * @return {number}
     */
    public get fontSize(): number {
      return this._textField.size;
    }

    /**
     * @set 设置显示的文字颜色
     * @param color {number}
     */
    public set fontColor(color: number) {
      this._textField.textColor = color;
    }
    /**
     * @get 获取显示的文字颜色
     * @return {number}
     */
    public get fontColor(): number {
      return this._textField.textColor;
    }

    /**
     * @set 设置遮罩透明度
     * @param alpha {number}
     */
    public set alpha(alpha: number) {
      this._mask.alpha = alpha;
    }
    /**
     * @get 获取遮罩透明度
     * @return {number}
     */
    public get alpha(): number {
      return this._mask.alpha;
    }

    /**
     * @set 设置视图宽度
     * @param width {number}
     */
    public set viewWidth(width: number) {
      this._viewWidth = width;
      this._textField.width = width;
      this._mask.width = width;
    }
    /**
     * @get 获取视图宽度
     * @return {number}
     */
    public get viewWidth(): number {
      return this._viewWidth;
    }

    /**
     * @set 设置视图高度度
     * @param width {number}
     */
    public set viewHeight(height: number) {
      this._viewHeight = height;
      this._textField.height = height;
      this._mask.height = height;
    }
    /**
     * @get 获取视图高度度
     * @return {number}
     */
    public get viewHeight(): number {
      return this._viewHeight;
    }

    /**
     * 初始化 LoadingView
     */
    private _init() {
      this._createMask();
      this._createText();
    }

    /**
     * 创建遮罩
     */
    private _createMask() {
      this._mask = new egret.Shape();
      this._mask.touchEnabled = true;
      const g = this._mask.graphics;
      g.beginFill(0x000000);
      g.drawRect(-this._viewWidth / 2, -this._viewHeight / 2, this._viewWidth, this._viewHeight);
      g.endFill();
      this._mask.alpha = 0.1;
      this.addChild(this._mask);
    }

    /**
     * 创建文字
     */
    private _createText() {
      this._textField = new egret.TextField();
      this._textField.text = this._text || '';
      this._textField.size = 14;
      this._textField.textAlign = egret.HorizontalAlign.CENTER;
      this._textField.verticalAlign = egret.VerticalAlign.MIDDLE;
      this._textField.width = this._viewWidth;
      this._textField.height = this._viewHeight;
      this._textField.x = -this._viewWidth / 2;
      this._textField.y = -this._viewHeight / 2;
      this._textField.lineSpacing = 5;
      this.addChild(this._textField);
    }
  }
}
