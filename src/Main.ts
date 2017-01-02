class Main extends egret.DisplayObjectContainer {
  private swiper: Swiper;
  public constructor() {
    super();
    this.addEventListener(egret.Event.ADDED_TO_STAGE, this._onAddToStage, this);
  }

  private _onAddToStage() {
    this.touchEnabled = true;
    this._addSwiper();
  }

  private _addSwiper() {
    this.swiper = new Swiper({
      viewHeight: 100,
      viewWidth: 500,
      slideWidth: 100,
      slideHeight: 100,
      activeCenter: true,
      effect: 'carrousel'
    });
    this.swiper.x = 10;
    this.swiper.y = 30;
    this.swiper
      .addSlide()
      .addSlide()
      .addSlide()
      .addSlide()
      .addSlide()
      .start();
    this.swiper.onChange = function(activeIndex: number, preActiveIndex: number) {
      console.log(`active index changed from ${preActiveIndex} to ${activeIndex}.`);
    };
    this.addChild(this.swiper);
  }
}


