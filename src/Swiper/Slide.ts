interface ISlideOptions {
  index: number;
  slideIndex: number;
  isCopy: boolean;
  [key: string]: any;
}

class Slide extends egret.Sprite {
  static index: number = 0;
  public bg: egret.Shape;/**/
  public options: ISlideOptions;
  constructor(public slideWidth: number, public slideHeight: number, public content?: egret.DisplayObject, isCopy: boolean = false) {
    super();
    this.addBg(slideWidth, slideHeight);
    if (content) {
      this.addContent(content);
    }
    let index = Slide.index++;
    this.options = {
      isCopy,
      index,
      slideIndex: index
    };
  }
  public setOptions(opt: any) {
    this.options = _.assign({}, this.options, opt);
  }
  public addBg(width: number, height: number) {
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
  public addContent(content: egret.DisplayObject) {
    this.content = content;
    this.addChild(content);
  }
}
