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
      loop: true,
      effect: 'carrousel',
      carrousel: {
        minScale: 0.1,
        radius: 100
      }
    });
    this.swiper.x = 10;
    this.swiper.y = 30;
    let t1 = new egret.TextField();
    let t2 = new egret.TextField();
    let t3 = new egret.TextField();
    let t4 = new egret.TextField();
    let t5 = new egret.TextField();
    t1.text = '0';
    t2.text = '1';
    t3.text = '2';
    t4.text = '3';
    t5.text = '4';
    t1.textColor = t2.textColor = t5.textColor = t3.textColor = t4.textColor = 0x000000;
    t1.textColor = t2.textColor = t5.textColor = t3.textColor = t4.textColor = 14;
    this.swiper
      .addSlide(t1)
      .addSlide(t2)
      .addSlide(t3)
      .addSlide(t4)
      .addSlide(t5)
      .start();
    this.swiper.onChange = function(activeIndex: number, preActiveIndex: number) {
      console.log(`active index changed from ${preActiveIndex} to ${activeIndex}.`);
    };
    this.addChild(this.swiper);
  }
}


