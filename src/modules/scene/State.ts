namespace scene {
  export interface IState {
    sceneWidth: number;
    sceneHeight: number;
    padding: number;
    rowCount: number;
    offset: number;
    speed: number;
    bgColor: number;
    bgImage: string;
    apiList: string[];
  }
}
