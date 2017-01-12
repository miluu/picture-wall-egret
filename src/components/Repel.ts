/**
 * Repel 作用于场景中的一个排斥源对象，会对靠近其半径范围内的对象产生排斥效果，排斥效果从中心逐渐衰减到边缘
 */
class Repel {
  /**
   * 依附的目标对象
   */
  public attachObject: egret.DisplayObject | egret.Point;

  /**
   * 中心坐标点
   */
  public center: egret.Point;

  /**
   * @constructor 创建一个 Repel 对象，中心点位于 (x, y) 的位置。
   * @param x {number} 中心点 x 坐标值, 默认为 0
   * @param y {number} 中心点 y 坐标值, 默认为 0
   * @param radius {number} 作用范围半径, 默认为 0
   * @param strong {number} 作用强度值, 取舍范围为 [0, 1]，默认为 0.5
   */
  constructor(x: number = 0, y: number = 0, public radius: number = 0, public strong: number = 0.5) {
    this.center = new egret.Point(x, y);
  }

  /**
   * 用于获取目标对象被排斥后的新座标点
   * @param target {egret.DisplayObject | egret.Point} 作用目标对象
   * @return {egret.Point} 目标对象被排斥后的新座标点
   */
  public repel(target: egret.DisplayObject | egret.Point): egret.Point {
    // TODO
    return new egret.Point();
  }

  /**
   * 设置依附的对象
   * @param target {egret.DisplayObject | egret.Point} 依附的目标对象，为空则释放依附对象
   */
  public attach(target?: egret.DisplayObject | egret.Point): Repel {
    this.attachObject = target;
    return this;
  }

  /**
   * 渐变设置强度值
   * @param strong {number} 最终的强度值
   * @param time {number} 执行时间间隔
   * @param callback {(Repel?) => any} 执行完毕后的回调函数，可选参数为自身
   */
  public toStrong(strong: number, time: number, callback?: (Repel?) => any) {
    const repel = this;
    let tw = new TWEEN.Tween(this)
      .easing(TWEEN.Easing.Cubic.Out)
      .to({strong: 0}, time)
      .onComplete(() => {
        if (callback) {
          callback(this);
        }
        TWEEN.remove(tw);
      })
      .start();
  }
}
