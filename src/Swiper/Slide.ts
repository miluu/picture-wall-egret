class Slide extends egret.Sprite {
  static count: number = 0;

  bg: egret.Shape;
  constructor(public slideWidth: number, public slideHeight: number, public content?: egret.DisplayObject) {
    super();
    this.addBg(slideWidth, slideHeight);
    this._addCount();
  }
  private _addCount() {
    let text = new egret.TextField();
    text.text = String(Slide.count);
    text.textColor = 0x000000;
    text.size = 14;
    text.x = -this.slideWidth / 2;
    text.y = -this.slideHeight / 2;
    this.addChild(text);
    Slide.count++;
  }
  addBg(width: number, height: number) {
    this.bg = new egret.Shape();
    let g = this.bg.graphics;
    g.beginFill(0xdddddd);
    g.lineStyle(1, 0xffffff);
    g.drawRect(0, 0, width, height);
    g.endFill();
    this.bg.x = -this.slideWidth / 2;
    this.bg.y = -this.slideHeight / 2;
    this.addChild(this.bg);
  }
  addContent(content: egret.DisplayObject) {
    this.content = content;
    this.addChild(content);
  }
}
