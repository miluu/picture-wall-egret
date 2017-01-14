namespace scene {
  export class Scene extends egret.DisplayObjectContainer {
    private _items: Item[] = [];
    private _repels: Repel[] = [];
    // private _swiper: swiper.Swiper;

    public state: State = new State();

    constructor() {
      super();
    }
  }
}
