class Main extends egret.DisplayObjectContainer {

  public constructor() {
    super();
    settings.init();
    this.addEventListener(egret.Event.ADDED_TO_STAGE, this._onAddToStage, this);
  }

  private _onAddToStage() {
    const item = new scene.Item(100, 100);
    this.addChild(item);
  }
}
