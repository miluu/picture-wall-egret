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
    this.scene = new scene.Scene();
    this.addChild(this.scene);
    settings.init(this._sceneStart.bind(this));
  }

  /**
   * @private 开始运行场景
   */
  private _sceneStart(appSetting: settings.IAppSettings) {
    this.scene.useSettings(appSetting);
  }
}
