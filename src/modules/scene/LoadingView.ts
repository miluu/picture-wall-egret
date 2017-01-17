namespace scene {
  export class LoadingView extends egret.DisplayObjectContainer {
    private _viewWidth: number;
    private _viewHeight: number;
    private _text: string;
    private _mask: egret.Shape;
    private _textField: egret.TextField;

    constructor(text: string, viewWidth: number = 100,  viewHeight: number = 50, alpha: number = 0.1) {
      super();
      this._text = text;
      this._viewWidth = viewWidth;
      this._viewHeight = viewHeight;
      this._init();
      this.alpha = alpha;
    }
    public set text(text: string) {
      this._text = text;
      this._textField.text = text;
    }
    public get text(): string {
      return this._text;
    }
    public set fontSize(size: number) {
      this._textField.size = size;
    }
    public get fontSize(): number {
      return this._textField.size;
    }
    public set fontColor(color: number) {
      this._textField.textColor = color;
    }
    public get fontColor(): number {
      return this._textField.textColor;
    }
    public set alpha(alpha: number) {
      this._mask.alpha = alpha;
    }
    public get alpha(): number {
      return this._mask.alpha;
    }
    public set viewWidth(width: number) {
      this._viewWidth = width;
      this._textField.width = width;
      this._mask.width = width;
    }
    public get viewWidth(): number {
      return this._viewWidth;
    }
    public set viewHeight(height: number) {
      this._viewHeight = height;
      this._textField.height = height;
      this._mask.height = height;
    }
    public get viewHeight(): number {
      return this._viewHeight;
    }
    private _init() {
      this._createMask();
      this._createText();
    }
    private _createMask() {
      this._mask = new egret.Shape();
      const g = this._mask.graphics;
      g.beginFill(0x000000);
      g.drawRect(-this._viewWidth / 2, -this._viewHeight / 2, this._viewWidth, this._viewHeight);
      g.endFill();
      this._mask.alpha = 0.1;
      this.addChild(this._mask);
    }
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
      this.addChild(this._textField);
    }
  }
}
