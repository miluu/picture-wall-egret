namespace scene {
  export class Button extends egret.DisplayObjectContainer {
    private _radius: number;
    private _bgColor: number;
    private _iconTexture: egret.Texture;
    private _shape: egret.Shape;
    private _icon: egret.Bitmap;
    private _outline: egret.Shape;
    public onClick: (event?: egret.TouchEvent) => any;

    constructor(radius: number, bgColor: number, iconTexture: egret.Texture, showOutline: boolean = true) {
      super();
      this._radius = radius;
      this._bgColor = bgColor;
      this._iconTexture = iconTexture;
      this._createShape();
      this._createIcon();
      this._createOutline(showOutline);
    }

    private _createShape() {
      this._shape = new egret.Shape();
      const g = this._shape.graphics;
      g.beginFill(this._bgColor);
      g.drawCircle(0, 0, this._radius);
      g.endFill();
      this.addChild(this._shape);
      this._shape.touchEnabled = true;
      this._shape.addEventListener(egret.TouchEvent.TOUCH_TAP, function(event: egret.TouchEvent) {
        if (this.onClick) {
          this.onClick(event);
        }
      }, this);
    }

    private  _createIcon() {
      this._icon = new egret.Bitmap(this._iconTexture);
      this._icon.width = this._radius * 2;
      this._icon.height = this._radius * 2;
      this._icon.x = -this._radius;
      this._icon.y = -this._radius;
      this.addChild(this._icon);
    }

    private _createOutline(showOutline: boolean) {
      if (!showOutline) {
        return;
      }
      this._outline = new egret.Shape();
      const g = this._outline.graphics;
      g.lineStyle(this._radius / 3, 0xffffff);
      g.drawCircle(0, 0, this._radius);
      g.endFill();
      this._outline.alpha = 0.5;
      this.addChildAt(this._outline, 0);
      let tw = new TWEEN.Tween(this._outline)
        .delay(200)
        .to({
          scaleX: 2,
          scaleY: 2,
          alpha: 0
        }, 600)
        .repeat(Infinity)
        .start();
    }
  }
}
