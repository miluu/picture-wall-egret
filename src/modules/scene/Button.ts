namespace scene {
  export class Button extends egret.DisplayObjectContainer {
    private _radius: number;
    private _bgColor: number;
    private _iconTexture: egret.Texture;
    private _shape: egret.Shape;
    private _icon: egret.Bitmap;
    private _outline: egret.Shape;
    public onClick: () => any;

    constructor(radius: number, bgColor: number, iconTexture: egret.Texture) {
      super();
      this._radius = radius;
      this._bgColor = bgColor;
      this._iconTexture = iconTexture;
    }
  }
}
