class Main extends eui.UILayer {

  public constructor() {
    super();
    this.addEventListener(egret.Event.ADDED_TO_STAGE, this._onAddToStage, this);
  }

  private _onAddToStage() {
    const label = new eui.Label('Hello World!');
    this.addChild(label);
  }
}
