namespace scene {

  /**
   * @class Repel 作用于场景中的一个排斥源对象，会对靠近其半径范围内的对象产生排斥效果，排斥效果从中心逐渐衰减到边缘
   */
  export class Repel {

    /**
     * 所有 Repel 实例
     */
    private static _instances: Repel[] = [];

    /**
     * 依附的目标对象
     */
    public attachObject: IPosition;

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
      Repel._add(this);
    }

    /**
     * 用于获取目标对象应用排斥效果后的新座标点
     * @param target {IPosition} 作用目标对象
     * @return {point: egret.Point, offsetDistance: number, effectStrong: number} 目标对象应用排斥效果后的新座标点, 作用后偏移距离, 和作用强度
     */
    public use(target: IPosition): {point: egret.Point, offsetDistance: number, effectStrong: number} {
      const point = new egret.Point(target.x, target.y);
      const {center, strong, radius} = this;
      const distance = egret.Point.distance(point, center);
      let effectStrong = 0;
      let offsetDistance = 0;
      if (distance < radius) {
        const r1 = radius * strong;
        offsetDistance = (radius - distance) / radius * r1;
        const distanceX = point.x - center.x;
        const distanceY = point.y - center.y || 1;
        const offsetY = offsetDistance / distance * distanceY;
        const offsetX = offsetDistance / distance * distanceX;
        point.x += offsetX;
        point.y += offsetY;
        effectStrong = 1 - distance / radius;
      }
      return {point, offsetDistance, effectStrong};
    }

    /**
     * 设置依附的对象
     * @param target {IPosition} 依附的目标对象，为空则释放依附对象
     */
    public attach(target?: IPosition): Repel {
      this.attachObject = target;
      return this;
    }

    /**
     * 指定时间内渐变设置强度值至指定值
     * @param strong {number} 最终的强度值
     * @param time {number} 执行时间间隔
     * @param callback {(Repel?) => any} 执行完毕后的回调函数，可选参数为自身
     */
    public toStrong(strong: number, time: number, callback?: (Repel?) => any) {
      const repel = this;
      let tw = new TWEEN.Tween(this)
        .easing(TWEEN.Easing.Cubic.Out)
        .to({strong}, time)
        .onComplete(() => {
          if (callback) {
            callback(this);
          }
          TWEEN.remove(tw);
        })
        .start();
    }

    /**
     * 移除实例
     */
    public die() {
      this.center.x = null;
      this.attachObject = null;
      this.radius = null;
      this.strong = null;
      Repel._remove(this);
    }

    /**
     * 更新所有实例的 center 位置到附加对象
     */
    public update() {
      if (this.attachObject) {
        this.center.x = this.attachObject.x;
        this.center.y = this.attachObject.y;
      }
    }

    /**
     * 更新所有实例的 center 位置到附加对象
     */
    public static update() {
      _.forEach(Repel._instances, function(repel) {
        repel.update();
      });
    }

    /**
     * 获取全部 Repel 实例对象
     */
    public static getAll(): Repel[] {
      return Repel._instances;
    }

    /**
     * 获取所有有附加对象的实例
     */
    public static getAllHasAttachObject(): Repel[] {
      return _.filter(Repel._instances, (repel) => {
        return repel.attachObject;
      });
    }

    /**
     * 删除所有实例
     */
    public static removeAll() {
      _.forEach(Repel._instances, (repel) => {
        repel.die();
      });
    }

    /**
     * 添加实例对象
     * @parame repel {Repel} 要添加的实例
     */
    private static _add(repel: Repel) {
      Repel._instances.push(repel);
    }

    /**
     * 删除实例对象
     * @parame repel {Repel} 要添加的实例
     */
    private static _remove(repel: Repel) {
      _.pull(Repel._instances, repel);
    }
  }
}
