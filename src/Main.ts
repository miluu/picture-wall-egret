class Main extends egret.DisplayObjectContainer {
  scene: scene.Scene;

  public constructor() {
    super();
    this.addEventListener(egret.Event.ADDED_TO_STAGE, this._onAddToStage, this);
  }

  private _onAddToStage() {
    this.scene = new scene.Scene();
    // this.scene.y = 150;
    // this.scene.x = 300;
    this.addChild(this.scene);
    settings.init(this._sceneStart.bind(this));
  }

  private _sceneStart(appSetting: settings.IAppSettings) {
    this.scene.useSettings(appSetting);
  }
}
