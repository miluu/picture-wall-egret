/**
 * @class Main 入口类
 * @author HuangYaxiong [hyxiong@qq.com]
 */

class Main extends egret.DisplayObjectContainer {
  /**
   * @public 场景
   */
  public scene: scene.Scene;

  /**
   * @constructor
   */
  public constructor() {
    super();
    this.addEventListener(egret.Event.ADDED_TO_STAGE, this._onAddToStage, this);
  }

  /**
   * @private 添加到舞台后执行
   */
  private _onAddToStage() {
    // this.scene = new scene.Scene();
    // this.addChild(this.scene);
    // settings.init(this._sceneStart.bind(this));

    const sw = new swiper.Swiper({
      viewWidth: 500,
      viewHeight: 200,
      slideWidth: 150,
      slideHeight: 150,
      radius: 200,
      onChange: (currentIndex) => {
        console.log(`Change to ${currentIndex}`);
      }
    });
    const slide1 = new swiper.Slide(150, 150, null, 1);
    const slide2 = new swiper.Slide(150, 150, null, 2);
    const slide3 = new swiper.Slide(150, 150, null, 3);
    const slide4 = new swiper.Slide(150, 150, null, 4);
    sw.addSlide(slide1).addSlide(slide2).addSlide(slide3).addSlide(slide4);
    this.addChild(sw);
    sw.x = 300;
    sw.y = 250;
  }

  /**
   * @private 开始运行场景
   */
  private _sceneStart(appSetting: settings.IAppSettings) {
    this.scene.useSettings(appSetting);
  }
}
