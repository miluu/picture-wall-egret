class Main extends egret.DisplayObjectContainer {
  items: Item[] = [];
  repel: Repel;
  toggle: boolean = false;
  public constructor() {
    super();
    this.addEventListener(egret.Event.ADDED_TO_STAGE, this._onAddToStage, this);
  }

  private _onAddToStage() {
    mouse.enable(this.stage);
    mouse.setMouseMoveEnabled(true);
    this.touchEnabled = true;
    _.times(20, (row) => {
      _.times(20, (col) => {
        let item = new Item(30, 30);
        item.basePosition.x = col * 40;
        item.basePosition.y = row * 40;
        this.addChild(item);
        this.items.push(item);
      });
    });
    this.repel = new Repel(0, 0, 200, 0.3);
    this.stage.addEventListener(mouse.MouseEvent.MOUSE_MOVE, function(e: egret.TouchEvent) {
      this.repel.center.x = e.stageX;
      this.repel.center.y = e.stageY;
    }, this);

    this.stage.addEventListener(egret.TouchEvent.TOUCH_TAP, function(e: egret.TouchEvent) {
      this.repel.toStrong(this.toggle ? 0.5 : 0, 500);
      this.toggle = !this.toggle;
    }, this);
    egret.Ticker.getInstance().register(this._animate, this);
  }

  private _animate() {
    TWEEN.update();
    _.forEach(this.items, (item) => {
      let {point, effectStrong} = this.repel.use(item.basePosition);
      item.x = point.x;
      item.y = point.y;
      item.alpha = 1 - effectStrong;
      item.scaleX = item.scaleY = 1 - effectStrong;
    });
  }

  // private _addSwiper() {
  //   this.swiper = new swiper.Swiper({
  //     viewHeight: 100,
  //     viewWidth: 500,
  //     slideWidth: 100,
  //     slideHeight: 100,
  //     activeCenter: false,
  //     loop: true,
  //     effect: 'carrousel',
  //     carrousel: {
  //       minScale: 0.1,
  //       radius: 100
  //     }
  //   });
  //   this.swiper.x = 10;
  //   this.swiper.y = 30;
  //   let t1 = new egret.TextField();
  //   let t2 = new egret.TextField();
  //   let t3 = new egret.TextField();
  //   let t4 = new egret.TextField();
  //   let t5 = new egret.TextField();
  //   let t6 = new egret.TextField();
  //   let t7 = new egret.TextField();
  //   let t8 = new egret.TextField();
  //   let t9 = new egret.TextField();
  //   let t10 = new egret.TextField();
  //   t1.text = '0';
  //   t2.text = '1';
  //   t3.text = '2';
  //   t4.text = '3';
  //   t5.text = '4';
  //   t6.text = '5';
  //   t7.text = '6';
  //   t8.text = '7';
  //   t9.text = '8';
  //   t10.text = '9';
  //   t1.textColor = t2.textColor = t5.textColor = t3.textColor = t4.textColor = t6.textColor = t7.textColor = t8.textColor = t9.textColor = t10.textColor = 0x000000;
  //   this.swiper
  //     .addSlide(t1)
  //     .addSlide(t2)
  //     .addSlide(t3)
  //     .addSlide(t4)
  //     .addSlide(t5)
  //     .start();
  //   this.swiper.onChange = function(activeIndex: number, preActiveIndex: number) {
  //     console.log(`active index changed from ${preActiveIndex} to ${activeIndex}.`);
  //   };
  //   this.addChild(this.swiper);
  // }
}
